const { Seller, Item, User } = require("../models");
const { UniqueConstraintError } = require("sequelize");

class SellerRepository {
  async findById(id) {
    const data = await User.findByPk(id);
    if (!data) {
      return "Seller not found";
    } else {
      return data;
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
    const createdItem = await Item.create(item);
    // return createdItem.id as json
    return { id: createdItem.id };
  }

  async findItemById(itemId) {
    return await Item.findOne({ where: { id: itemId } });
  }

  async findAllItems(sellerId) {
    return await Item.findAll({ where: { seller_id: sellerId } });
  }
}

module.exports = SellerRepository;
