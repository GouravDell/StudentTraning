const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        // User who placed the order
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // Products purchased
        items: [
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                product_name: {
                    type: String,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0
                },

                // price * quantity
                total: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],

        // Total amount of order
        total_amount: {
            type: Number,
            required: true,
            min: 0
        },

        // Payment information
        payment_status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
                "refunded"
            ],
            default: "pending"
        },

        payment_method: {
            type: String,
            enum: [
                "COD",
                "CARD",
                "UPI",
                "NET_BANKING"
            ],
            required: true
        },

        // Order status
        order_status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending",
            index: true
        },

        // Shipping address
        shipping_address: {
            name: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            }
        },

        // Payment transaction ID
        transaction_id: {
            type: String,
            default: null
        },

        // Cancellation reason
        cancellation_reason: {
            type: String,
            default: null
        }
    },

    {
        timestamps: true
    }
);

// Indexes for frequently used queries
orderSchema.index({
    user_id: 1,
    createdAt: -1
});

orderSchema.index({
    order_status: 1,
    createdAt: -1
});

module.exports = mongoose.model("Order", orderSchema);