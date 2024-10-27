import jwt from "jsonwebtoken";
import { Customer,DeliveryPartner } from "../../model/index.js";

const generateToken = (user) => {
    const accessToken = jwt.sign({ userId: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

    const refreshToken = jwt.sign({ userId: user._id, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

    return { accessToken, refreshToken }
}

export const loginCustomer = async (req, reply) => {
    try {
        let { phone } = req.body;
        let customer = await Customer.findOne({ phone });
        if (!customer) {
            customer = new Customer({ phone: phone, role: "Customer", isActivated: true });
            await customer.save();
        }
        const { accessToken, refreshToken } = generateToken(customer);

        return reply.send({
            message: customer ? "Login Successful" : "Customer Created Successfull",
            accessToken: accessToken,
            refreshToken: refreshToken,
            customer,
        })

    }
    catch (e) {
        return reply.status(500).send({ message: "An error occured",e})
    }
}


export const loginDeliverParthner = async (req, reply) => {
    try {
        let { email, password } = req.body;
        let deliveryPartner = await DeliveryPartner.findOne({email});
     
        if (!deliveryPartner) {
            return reply.status(404).send({ message: "Delivery Partner Not Exist" })
        }

        const isMatch = password == deliveryPartner.password;

        if (isMatch) {
       
            const { accessToken, refreshToken } = generateToken(deliveryPartner);
           
            return reply.send({
                message: "Login Successful",
                accessToken: accessToken,
                refreshToken: refreshToken,
                deliveryPartner: deliveryPartner,
            });
        }
        else {
            return reply.status(400).send({ message: "Invalid Credentials", })
        }
    }
    catch (e) {
        return reply.status(500).send({ message: "An error occured",e})
    }
}

export const refreshToken = async (req, reply) => {
    const { refreshToken } = req.body;

    try {
        if (!refreshToken) {
            return reply.status(401).send({ message: "Refresh token required" });
        }
        else {
            const decord = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            let user;
            if (decord.role === "Customer") {
                user = await Customer.findById(decord.userId);
            }
            else if (decord.role === "DeliveryPartner") {
                user = await DeliveryPartner.findById(decord.userId);
            }
            else {
                reply.status(403).send({ message: "Invalid Role" });
            }

            if (!user) {
                reply.status(403).send({ message: "Invalid Refresh Token" });
            }

            const { accessToken, refreshToken: newRefreshToken } = generateToken(user);

            return reply.send({ message: "Token refresh", accessToken, refreshToken });


        }
    }
    catch (e) {
        return reply.status(403).send({ message: "Invalid Refresh Token" });
    }

}

export const fetchUser = async (req, reply) => {
    try {
        const { userId, role } = req.user;
        
        let user;
        if (role === "Customer") {
            user = await Customer.findById(userId);
        }
        else if (role === "DeliveryPartner")
        {
            user = await DeliveryPartner.findById(userId);
        }
        if (!user) {
            return reply.status(404).send({message: "User not found" })
        }

        return reply.send({message : "User Fetch Successfully",user})

    }
    catch (e) {
        return reply.status(500).send({ message: "An error occured", error })
    }
}