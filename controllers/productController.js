const Product = require("../models/productSchema");
const { responseObj } = require("../config/responseObj");
const AppError = require("../utils/customError");

module.exports = {
    //get Product API
    getAllProducts: async (req, res, next) => {
        try {
            const product = await Product.find({});
            if (!product || product.length === 0) {
                throw new AppError(false, responseObj.not_found, 404);
            }
            return res.status(200).send({
                ...responseObj.get_product,
                data: product
            });

        } catch (error) {
            return next(error);
        }
    },
    // Create Product API
    createProduct: async (req, res, next) => {
        try {
            console.log("File:", req.file);
            console.log("Body:", req.body);

            const {
                product_name,
                description,
                price,
                user_id,
                Instock
            } = req.body;

            // Check image
            if (!req.file) {
                throw new AppError(false, "Product image is required", 400);
            }

            const create_product = await Product.create({
                product_name,
                description,
                price: parseFloat(price),
                user_id,
                image: req.file.filename,
                Instock: Instock === "true"
            });

            if (!create_product) {
                throw new AppError(false, responseObj.add_product, 400);
            }

            return res.status(201).send({
                ...responseObj.create,
                data: create_product
            });

        } catch (error) {
            return next(error);
        }
    },

    // Get Product By ID
    getProductById: async (req, res, next) => {
        try {
            const productId = req.params.id;
            const get_data = await Product.findById(productId);
            if (!get_data) {
                throw new AppError(false, responseObj.not_found, 404);
            }

            return res.status(200).send({
                ...responseObj.get_product,
                data: get_data
            });

        } catch (error) {
            return next(error);
        }
    },

    // Delete Product API
    deleteProduct: async (req, res, next) => {
        try {
            const productId = req.params.id;

            const data = await Product.deleteOne({
                _id: productId
            });

            // deletedCount is important
            if (data.deletedCount === 0) {
                throw new AppError(false, responseObj.not_found, 404);
            }

            return res.status(200).send({
                ...responseObj.delete_data
            });

        } catch (error) {
            return next(error);
        }
    },

    // Update Product API
    updateProduct: async (req, res, next) => {
        try {
            const productId = req.params.productId;

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { $set: req.body },
                {
                    new: true,
                    runValidators: true
                }
            );

            // Check matchedCount instead of checking data itself
            if (!updatedProduct) {
                throw new AppError(
                    false,
                    responseObj.not_found,
                    404
                );
            }

            return res.status(200).send({
                ...responseObj.update_product,
                data: updatedProduct
            });

        } catch (error) {
            return next(error);
        }
    },

    // Image Upload API
    imageUpload: async (req, res, next) => {
        try {
            console.log("File:", req.file);
            console.log("Body:", req.body);

            if (!req.file) {
                throw new AppError(false, "Image is required", 400);
            }

            return res.status(200).send({
                success: true,
                message: "Image uploaded successfully",
                filename: req.file.filename
            });

        } catch (error) {
            return next(error);
        }
    },

    // Get Sales Product Using Lookup
    getsalesProduct: async (req, res, next) => {
        try {
            const getAll_Product = await Product.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "sales"
                    }
                }
            ]);

            if (!getAll_Product || getAll_Product.length === 0) {
                throw new AppError(false, responseObj.not_found, 404);
            }

            return res.status(200).send({
                ...responseObj.get_product,
                result: getAll_Product
            });

        } catch (error) {
            return next(error);
        }
    },

    // Get Product With ID
    getProductwithID: async (req, res, next) => {
        try {
            const productId = req.params.id;

            // Don't use parseInt for MongoDB ObjectId
            const get_data = await Product.findById(productId);

            if (!get_data) {
                throw new AppError(false, responseObj.not_found, 404);
            }

            return res.status(200).send({
                ...responseObj.get_product,
                result: get_data
            });

        } catch (error) {
            return next(error);
        }
    }
};