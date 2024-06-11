const { Seller, Item } = require('../models');
const { UniqueConstraintError } = require('sequelize');

class SellerRepository {
  async findById(id) {
    const data = await Seller.findByPk(id);

    if (!data) {
      throw new Error('Seller not found');
    } else {
      return data;
    }
  }

  async create(seller) {
    try {
      return await Seller.create(seller);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new Error('Seller already exists');
      } else {
        throw new Error('Error creating seller');
      }
    }
  }

  async findByEmail(email) {
    return await Seller.findOne({ where: { email } });
  }

  async update(id, sellerUpdates) {
    return await Seller.update(sellerUpdates, { where: { id } });
  }

  async delete(id) {
    return await Seller.destroy({ where: { id } });
  }

  async createItem(sellerId, item) {
    item.seller_id = sellerId;
    return await Item.create(item);
  }

  async findItemById(itemId) {
    return await Item.findOne({ where: { id: itemId } });
  }

  async findAllItems(sellerId) {
    return await Item.findAll({ where: { seller_id: sellerId } });
  }
}

module.exports = SellerRepository;
