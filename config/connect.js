import mongoose from "mongoose"; 

export const connectDb = async (uri) => { 
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database connected");
    } catch (error) {
        console.error("DATABASE CONNECTION ERROR: ", error);
    }
};
