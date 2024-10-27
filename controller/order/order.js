import { Customer, DeliveryPartner } from "../../model/user.js";
import { Branch } from "../../model/branch.js";
import Order from "../../model/order.js";


export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.user;
        const { items, branch, totalPrice } = req.body;

        // Validate the total price
        if (!totalPrice || typeof totalPrice !== 'number') {
            return reply.status(400).send({ message: "Invalid total price" });
        }
        // Find customer and branch
        const customerData = await Customer.findById(userId);
        const branchData = await Branch.findById(branch);

        if (!customerData) {
            return reply.status(404).send({ message: "Customer not found" });
        }
        if (!branchData) {
            return reply.status(404).send({ message: "Branch not found" });
        }
        
        const newOrder = new Order({
            customer: userId,
            branch: branch,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                counter: item.counter
            })),
            totalPrice: totalPrice,
            branch,
            deliveryLocation:
            {   
                longitude: customerData.liveLocation.longitude,
                latitude: customerData.liveLocation.latitude,
                address: customerData.address || "No Address Available"
            },
            pickupLocation:
            {
                longitude: branchData.location.longitude,
                latitude: branchData.location.latitude,
                address: branchData.address || "No Address Available"
            }
        });

        const savedOrder = await newOrder.save();
        return reply.status(201).send({ message: "Order created successfully", order: savedOrder });
    } catch (e) {
        console.error("Error creating order:", e);
        return reply.status(500).send({ message: "Something went wrong" });
    }
};

export const confirmOrder = async (req, reply) => {

    try {
        const { userId } = req.user;
        const { orderId } = req.params;
        const { deliveryPersonLocation } = req.body;

        const deliverPartner = await DeliveryPartner.findById(userId);

        if (!deliverPartner) {
            return reply.status(400).send({ message: "Couldn't find delivery Partner" });
        }

        const order = await Order.findById(orderId)

        if (!order) {
            return reply.status(400).send({ message: "Order Not Found" });
        }
        if (order.status != "available") {
            return reply.status(400).send({ message: "Order is not available" });
        }

        order.status = "confirmed";
        order.deliveryPartner = userId;
        order.deliverPersonLocation =
        {
            latitude: deliveryPersonLocation.latitude,
            longitude: deliveryPersonLocation.longitude,
            address: deliveryPersonLocation.address || "",
        }
        await order.save();
        return reply.send(order);

    }
    catch (e) {
        return reply.status(500).send({ message: "Failed to Confirmed Order" });
    }
}


export const updateOrderStatus = async (req, reply) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;
        const { status, deliverPartnerLocation } = req.body;

        const deliverPartner = await DeliveryPartner.findById(userId);

        if (!deliverPartner) {
            return reply.status(404).send({ message: "Delivery Person Not found" });
        }

        const order = await Order.findById(orderId)

        if (!order) {
            return reply.status(400).send({ message: "Order Not Found" });
        }
        if (["cancelled", "delivered"].includes(order.status)) {
            return reply.status(400).send({ message: "Order can't be updated" });
        }
        if (order.deliveryPartner.toString() != userId) {
            return reply.status(403).send({ message: "UnAuthorized" });
        }

        order.status = status;
        order.deliveryPartner = userId;

        order.deliverPersonLocation = deliverPartnerLocation,
        await order.save();
        return reply.send(order);

    }

    catch (e) {
        return reply.status(500).send({ message: "Failed to Update Order Status" });
    }
}


export const getOrder = async (req, reply) => { 
    try {
        const { status, customerId, deliveryPartnerId, branchId } = req.body || {}; 

        let query = {};
        
        if (status) {
            query.status = status;
        }
        if (customerId) {
            query.customer = customerId;
        }
        if (deliveryPartnerId) {
            query.deliveryPartner = deliveryPartnerId; 
        }
        if (branchId) {
            query.branch = branchId;
        }

        const orders = await Order.find(query).populate("customer branch items.item deliveryPartner");

        return reply.send(orders);
    }
    catch (e) {
        console.error("Error retrieving orders:", e);
        return reply.status(500).send({ message: "Failed to retrieve orders" });
    }
};


export const getOrderById = async (req, reply) => {
    try {
        const { userId } = req.user;
        const {orderId} = req.params;
       
        const orders = await Order.findById(orderId);

        return reply.send(orders);
    }
    catch (e) {
        return reply.status(500).send({ message: "Failed to Retrive Order" });
    }
}