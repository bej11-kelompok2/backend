const SellerService = require("../usecase/seller.service");
const BaseResponse = require("../util/base.response");

class SellerController {
  constructor() {
    this.sellerService = new SellerService();
  }

  findById = async (req, res) => {
    try {
      const seller = await this.sellerService.findById(req.params.id);
      res.json(new BaseResponse(true, "Seller found", seller));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  };

  login = async (req, res) => {
    try {
      const { seller, token } = await this.sellerService.login(
        req.body.email,
        req.body.password
      );
      const data = { seller, token };
      res.json(new BaseResponse(true, "Seller logged in", data));
    } catch (error) {
      res.status(401).json(new BaseResponse(false, error.message, null));
    }
  };

  update = async (req, res) => {
    try {
      const seller = await this.sellerService.update(req.user.id, req.body);
      res.json(new BaseResponse(true, "Seller updated", seller));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  };

  delete = async (req, res) => {
    try {
      await this.sellerService.delete(req.params.id);
      res.json(new BaseResponse(true, "Seller deleted", null));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  };

  // Items
  createItem = async (req, res) => {
    const data = JSON.parse(req.body.seller);

    try {
      if (!req.file) {
        throw new Error("Image required");
      }

      console.log(req.user.userId);

      const item = await this.sellerService.createItem(
        req.user.userId,
        data,
        req.file.buffer
      );

      res.json(new BaseResponse(true, "Item created", item));
    } catch (error) {
      console.error("Error in createItem controller:", error);
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  };

  findItemById = async (req, res) => {
    try {
      const item = await this.sellerService.findItemById(req.params.itemId);
      res.json(new BaseResponse(true, "Item found", item));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  };

  findAllItems = async (req, res) => {
    try {
      const items = await this.sellerService.findAllItems(req.params.sellerId);
      res.json(new BaseResponse(true, "Items found", items));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  };
}

module.exports = SellerController;
