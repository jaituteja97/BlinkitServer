import mongoose from "mongoose";
import Counter from "./counter.js";

// Define the order schema
const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
        },
        deliveryPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryPartner",
        },
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        items: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                counter: { type: Number, required: true },
            }
        ],
        deliveryLocation: {
            longitude: { type: Number, required: true },
            latitude: { type: Number, required: true }, 
            address: { type: String },
        },
        pickupLocation: {
            longitude: { type: Number, required: true },
            latitude: { type: Number, required: true },
            address: { type: String },
        },
        deliverPersonLocation: {
            longitude: { type: Number },
            latitude: { type: Number }, 
            address: { type: String },
        },
        status: {
            type: String,
            enum: ["available", "confirmed", "arriving", "delivered", "cancelled"],
            default: "available",
        },
        totalPrice: { type: Number, required: true },
        createdAt: { type: Date},
        updatedAt: { type: Date},
    },
    // { timestamps: true } 
);


async function getSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { name: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.sequence_value;
}


orderSchema.pre("save", async function (next) {
    if (this.isNew) {
        const sequenceValue = await getSequenceValue("orderId");
        this.orderId = `ORDR${sequenceValue.toString().padStart(5, "0")}`;
    }
    next();
});

// Create and export the Order model
const Order = mongoose.model("Order", orderSchema);
export default Order;