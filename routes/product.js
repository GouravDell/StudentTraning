const express = require("express");
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });


const { getAllProducts, createProduct, getProductById, deleteProduct, updateProduct, imageUpload } = require("../controllers/productController");
const verifyToken = require("../utils/verifyToekn");
router.get("/getAllProducts",verifyToken, getAllProducts);
router.post("/createProduct",verifyToken, upload.single('image'), createProduct);
router.get('/getProductById/:id',verifyToken, getProductById);
router.delete('/delete_product/:id',verifyToken, deleteProduct);
router.put('/update_product/:productId',verifyToken, updateProduct);
router.post('/imageuploader', upload.single('image'), imageUpload);

module.exports = router;