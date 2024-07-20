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

    const [updateCount, updatedSellers] = await this.sellerRepo.update(
      id,
      sellerUpdates
    );

    if (updateCount === 0) {
      throw new Error("Failed to update seller");
    }

    return updatedSellers[0];
  }

  async delete(id) {
    const seller = await this.sellerRepo.findById(id);

    if (!seller) {
      return "Seller not found";
    }

    const deleteCount = await this.sellerRepo.delete(id);

    if (deleteCount === 0) {
      throw new Error("Failed to delete seller");
    }

    return deleteCount;
  }

  // Items

  async createItem(sellerId, item, fileBuffer) {
    const seller = await this.sellerRepo.findById(sellerId);
    if (!seller) {
      return "Seller not found";
    }

    try {
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

      if (!newItem) {
        throw new Error("Failed to create item");
      }

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

  async findAllItemsById(sellerId) {
    const seller = await this.sellerRepo.findById(sellerId);
    if (!seller) {
      return "Seller not found";
    }

    const items = await this.sellerRepo.findAllItemsById(sellerId);

    if (!items || items.length === 0) {
      return "Items not found";
    }

    return items;
  }

  async findAllItems() {
    const items = await this.sellerRepo.findAllItems();

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

    const updatedItems = await this.sellerRepo.updateItem(
      itemId,
      itemUpdates,
      sellerId
    );

    return updatedItems;
  }

  async deleteItem(itemId, sellerId) {
    const item = await this.sellerRepo.findItemById(itemId);
    if (!item) {
      return "Item not found";
    }

    if (item.seller_id !== sellerId) {
      return "Unauthorized, you are not the seller of this item";
    }

    const deleteCount = await this.sellerRepo.deleteItem(itemId, sellerId);

    if (deleteCount === 0) {
      throw new Error("Failed to delete item");
    }

    return "Success delete item";
  }
}

module.exports = SellerService;
