const SellerRepository = require('../repository/seller.repository');
const bcrypt = require('bcrypt');
const generateToken = require('../util/jwt.config');
const cloudinary = require('../util/cloudinary');
const fs = require('fs');
const upload = require('../util/multer');
class SellerService {
  constructor() {
    this.sellerRepo = new SellerRepository();
  }

  async findById(id) {
    return await this.sellerRepo.findById(id);
  }

  async create(seller) {
    const hashedPassword = await bcrypt.hash(seller.password, 10);
    seller.password = hashedPassword;
    const newSeller = await this.sellerRepo.create(seller);
    return newSeller;
  }

  async login(email, password) {
    const seller = await this.sellerRepo.findByEmail(email);
    if (!seller) {
      throw new Error('Seller not found');
    }
    const match = await bcrypt.compare(password, seller.password);
    if (!match) {
      throw new Error('Password is incorrect');
    }
    const token = generateToken(seller.id);
    return { token, seller };
  }

  async update(id, sellerUpdates) {
    return await this.sellerRepo.update(id, sellerUpdates);
  }

  async delete(id) {
    return await this.sellerRepo.delete(id);
  }

  // Items

  async createItem(sellerId, item, filepath) {
    //cari seller by id
    const seller = await this.sellerRepo.findById(sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }

    try {
      //unggah file ke cloudinary
      const result = await cloudinary.uploader.upload(filepath, {
        use_filename: true 
      });

      //hapus file dari file local setelah berhasil diunggah
      fs.unlinkSync(filepath)

      //simpan url ke dalam item sblm buat item di database
      item.image = uploadResult.url

      return await this.sellerRepo.createItem(sellerId, item); 

    } catch (error) {
      // Tangani kesalahan saat mengunggah ke Cloudinary atau saat membuat item di sellerRepo
      console.error('Error creating item:', error);
      
      throw new Error('Failed to create item');
    }

  }

  async findItemById(itemId) {
    const item = await this.sellerRepo.findItemById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    return item;
  }

  async findAllItems(sellerId) {
    const seller = await this.sellerRepo.findById(sellerId);
    if (!seller) {
      throw new Error('Seller not found');
    }

    return await this.sellerRepo.findAllItems(sellerId);
  }
}

module.exports = SellerService;
