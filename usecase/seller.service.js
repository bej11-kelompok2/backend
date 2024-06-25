const SellerRepository = require("../repository/seller.repository");
const cloudinary = require("../util/cloudinary");
const fs = require("fs");
const upload = require("../util/multer");
class SellerService {
  constructor() {
    this.sellerRepo = new SellerRepository();
  }

  async findById(id) {
    return await this.sellerRepo.findById(id);
  }

  async update(id, sellerUpdates) {
    return await this.sellerRepo.update(id, sellerUpdates);
  }

  async delete(id) {
    return await this.sellerRepo.delete(id);
  }

  // Items

  async createItem(sellerId, item, fileBuffer) {
    //cari seller by id
    console.log(sellerId);
    const seller = await this.sellerRepo.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
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
      // Tangani kesalahan saat mengunggah ke Cloudinary atau saat membuat item di sellerRepo
      console.error("Error creating item:", error);

      throw new Error("Failed to create item");
    }
  }

  async findItemById(itemId) {
    const item = await this.sellerRepo.findItemById(itemId);
    if (!item) {
      throw new Error("Item not found");
    }

    return item;
  }

  async findAllItems(sellerId) {
    const seller = await this.sellerRepo.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    return await this.sellerRepo.findAllItems(sellerId);
  }
}

module.exports = SellerService;
