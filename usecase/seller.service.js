const SellerRepository = require("../repository/seller.repository");
const cloudinary = require("../util/cloudinary");

class SellerService {
  constructor() {
    this.sellerRepo = new SellerRepository();
  }

  async findById(id) {
    const seller = await this.sellerRepo.findById(id);
    if (!seller) {
      return "Seller not found";
    }

    return seller;
  }

  async update(id, sellerUpdates) {
    const seller = await this.sellerRepo.findById(id);

    if (!seller) {
      return "Seller not found";
    }

    const updatedSeller = await this.sellerRepo.update(id, sellerUpdates);

    if (!updatedSeller) {
      throw new Error("Failed to update seller");
    }

    return updatedSeller;
  }

  async delete(id) {
    const seller = await this.sellerRepo.findById(id);

    if (!seller) {
      return "Seller not found";
    }

    const deletedSeller = await this.sellerRepo.delete(id);

    if (!deletedSeller) {
      throw new Error("Failed to delete seller");
    }

    return deletedSeller;
  }

  // Items

  async createItem(sellerId, item, fileBuffer) {
    //cari seller by id
    const seller = await this.sellerRepo.findById(sellerId);
    if (!seller) {
      return "Seller not found";
    }

    try {
      // Upload image ke Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        upload.end(fileBuffer);
      });

      item.images = uploadResult.secure_url;

      const newItem = await this.sellerRepo.createItem(sellerId, item);

      return newItem;
    } catch (error) {
      throw new Error(error);
    }
  }

  async findItemById(itemId) {
    const item = await this.sellerRepo.findItemById(itemId);
    if (!item) {
      return "Item not found";
    }

    return item;
  }

  async findAllItems(sellerId) {
    const seller = await this.sellerRepo.findById(sellerId);
    console.log("Debug seller", seller);
    if (seller == "Seller not found") {
      return "Seller not found";
    }

    const items = await this.sellerRepo.findAllItems(sellerId);

    if (!items || items.length === 0) {
      return "Items not found";
    }

    return items;
  }

  async updateItem(itemId, itemUpdates, sellerId) {
    const item = await this.sellerRepo.findItemById(itemId);
    if (!item) {
      return "Item not found";
    }

    if (item.seller_id !== sellerId) {
      return "Unauthorized, you are not the seller of this item";
    }

    const updatedItem = await this.sellerRepo.updateItem(
      itemId,
      itemUpdates,
      sellerId
    );

    if (!updatedItem) {
      throw new Error("Failed to update item");
    }

    return updatedItem;
  }

  async deleteItem(itemId, sellerId) {
    const item = await this.sellerRepo.findItemById(itemId);
    if (!item) {
      return "Item not found";
    }

    if (item.seller_id !== sellerId) {
      return "Unauthorized, you are not the seller of this item";
    }

    const deletedItem = await this.sellerRepo.deleteItem(itemId, sellerId);

    if (!deletedItem) {
      throw new Error("Failed to delete item");
    }

    return "Success delete item";
  }
}

module.exports = SellerService;
