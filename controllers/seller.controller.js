const SellerService = require("../usecase/seller.service");
const BaseResponse = require("../util/base.response");
const { validationResult } = require("express-validator");

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
      if (req.user.roles !== "seller") {
        throw new Error("Unauthorized, Seller only");
      }
      const seller = await this.sellerService.update(req.user.id, req.body);
      res.json(new BaseResponse(true, "Seller updated", seller));
    } catch (error) {
      res.status(400).json(new BaseResponse(false, error.message, null));
    }
  };

  delete = async (req, res) => {
    try {
      if (req.user.roles !== "seller") {
        throw new Error("Unauthorized, Seller only");
      }
      await this.sellerService.delete(req.params.id);
      res.json(new BaseResponse(true, "Seller deleted", null));
    } catch (error) {
      res.status(400).json(new BaseResponse(false, error.message, null));
    }
  };

  // Items
  createItem = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json(new BaseResponse(false, errors.array(), null));
      }

      const data = JSON.parse(req.body.seller);
      console.log(req.body);

      if (req.user.role !== "seller") {
        console.log(req.user.role);
        throw new Error("Unauthorized, Seller only");
      }

      if (!req.file) {
        console.log(req.file);
        throw new Error("Image required");
      }

      const item = await this.sellerService.createItem(
        req.user.userId,
        data,
        req.file.buffer
      );

      res.json(new BaseResponse(true, "Item created", item));
    } catch (error) {
      console.error("Error in createItem controller:", error);
      res.status(400).json(new BaseResponse(false, error.message, null));
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
      return res.status(200).json(new BaseResponse(true, "Success", items));
    } catch (error) {
      console.log("Error in findAllItems controller:", error);
      return res
        .status(500)
        .json(new BaseResponse(false, "An unexpected error occurred", null));
    }
  };
}

module.exports = SellerController;
