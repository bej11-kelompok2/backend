const SellerService = require('../usecase/seller.service');
const BaseResponse = require('../util/base.response')
const uploadCloudinary = require('../middleware/cloudinary')
const uploadMulter = require('../util/multer')

class SellerController {
  constructor() {
    this.sellerService = new SellerService();
  }

  findById = async (req, res) => {
    try {
      const seller = await this.sellerService.findById(req.params.id);
      res.json(new BaseResponse(true, 'Seller found', seller));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  create = async (req, res) => {
    try {
      // if body is empty or null or undefined return error
      if (!req.body) {
        throw new Error('Body is empty');
      }
      const seller = await this.sellerService.create(req.body);
      res.json(new BaseResponse(true, 'Seller created', seller));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  login = async (req, res) => {
    try {
      console.log(req.email, req.password);
      const { seller, token } = await this.sellerService.login(req.body.email, req.body.password);
      const data = { seller, token }
      res.json(new BaseResponse(true, 'Seller logged in', data));
    }
    catch (error) {
      res.status(401).json(new BaseResponse(false, error.message, null));
    }
  }

  update = async (req, res) => {
    try {
      const seller = await this.sellerService.update(req.params.id, req.body);
      res.json(new BaseResponse(true, 'Seller updated', seller));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  delete = async (req, res) => {
    try {
      await this.sellerService.delete(req.params.id);
      res.json(new BaseResponse(true, 'Seller deleted', null));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  // Items
  createItem = async (req, res) => {
    try {
      //upload menggunakan multer 
      uploadMulter.array('images',5)(req,res, async (err) => {
        if (err) {
          return res.status(400).json(new BaseResponse(false, err.message, null));
        }
        if (!req.files || req.files.length === 0) {
          return res.status(400).json(new BaseResponse(false, 'No files uploaded or invalid file types', null));
        }
        //array untuk menyimpan URL gambar yang diunggah ke cloudinary
        const imageUrls = await Promise.all(req.files.map(async file => {
          const imageUrl = await uploadCloudinary(file.path);
          return imageUrl;
        }))

        if (imageUrls.some(url => !url)) {
          return res.status(500).json(new BaseResponse(false, 'Error uploading one or more files to Cloudinary', null));
        }
        // Gabungkan data item dengan URL gambar yang diunggah
        const itemData = {
        ...req.body,
        images: imageUrls // Menyimpan array URL gambar
        }
        const item = await this.sellerService.createItem(req.params.sellerId, itemData)
        req.files.forEach(file => {
          fs.unlinkSync(file.path);
        });
        res.json(new BaseResponse(true, 'Item created', item));
      })

    } catch (error) {
      res.status(500).json(new BaseResponse(false, error.message, null));
    }



    // try {
    //   const item = await this.sellerService.createItem(req.params.sellerId, req.body);
    //   res.json(new BaseResponse(true, 'Item created', item));
    // } catch (error) {
    //   res.status(404).json(new BaseResponse(false, error.message, null));
    // }
  }

  findItemById = async (req, res) => {
    try {
      const item = await this.sellerService.findItemById(req.params.itemId);
      res.json(new BaseResponse(true, 'Item found', item));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }

  findAllItems = async (req, res) => {
    try {
      const items = await this.sellerService.findAllItems(req.params.sellerId);
      res.json(new BaseResponse(true, 'Items found', items));
    } catch (error) {
      res.status(404).json(new BaseResponse(false, error.message, null));
    }
  }
}

module.exports = SellerController;
