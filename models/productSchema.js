const mongoose = require("mongoose");
const product = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  product_name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: 'uploads/Myimage.jpeg'
  },
  description: {
    type: String,
    required: true
  },
  Instock: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["pending", "success"],
    default: "pending"
  }
}, { timestamps: true },
)
module.exports = mongoose.model("Product", product);