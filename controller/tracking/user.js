import { Customer, DeliveryPartner } from "../../model/index.js";


export const updateUser = async (req, reply) => {
    try {
        const { userId } = req.user;
        const updateData = req.body;

        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId);
        let userModal;

        if (!user) {
            return reply.status(400).send({ message: "User not found" });
        }

        if (user.role === "Customer") {
            userModal = Customer;
        }
        else if (user.role === "DeliveryPartner") {
            userModal = DeliveryPartner;
        }

        const updateUser = await userModal.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        )

        if (!updateUser) {
            return reply.status(500).send({ message: "User Not Found" });
        }

        return reply.send({
            message: "Updated SuccessFully",
            user: updateUser,
        })
    }
    catch (e) {
        return reply.status(500).send({ message: "An error occurred", error: e.message });
    }
}