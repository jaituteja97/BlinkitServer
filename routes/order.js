import { confirmOrder, createOrder, getOrder, getOrderById, updateOrderStatus } from "../controller/order/order.js";
import { verifyToken } from "../middleware/auth.js";

export const orderRoute = async (fastify,options) =>
    {
        fastify.post('/order',{preHandler: [verifyToken]},createOrder); 
        fastify.get('/order',{preHandler: [verifyToken]},getOrder); 
        fastify.patch('/order/:orderId/status',{preHandler: [verifyToken]},updateOrderStatus); 
        fastify.post('/order/:orderId/confirm',{preHandler: [verifyToken]},confirmOrder); 
        fastify.post('/order/:orderId',{preHandler: [verifyToken]},getOrderById); 
    } 