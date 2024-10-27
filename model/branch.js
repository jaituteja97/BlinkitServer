import mongoose from "mongoose";


const branchSchema = new mongoose.Schema(
    {
        name: { type: String,required : true },
        location: {
            latitude: {
                type: Number,
            },
            longitude: {
                type: Number
            },
        },
        address: {
            type : String,
            required : true,
        },
        // deliveryPartners : [
        //     {
        //        type : mongoose.Schema.Types.ObjectId,
        //        ref : "DeliverPartner"
        //     },
        // ]
    }
);

export const Branch = mongoose.model("Branch",branchSchema);