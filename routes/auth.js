import { updateRecord } from "adminjs";
import { fetchUser, loginCustomer, loginDeliverParthner, refreshToken } from "../controller/auth/auth.js";
import { verifyToken } from "../middleware/auth.js";
import { updateUser } from "../controller/tracking/user.js";


export const authRoutes = async (fastify,options) =>
{
    fastify.post('/customer/login',loginCustomer);  
    fastify.post('/delivery/login',loginDeliverParthner);  
    fastify.post('/refresh-token/login',refreshToken);  
    fastify.get('/user',{preHandler: [verifyToken]},fetchUser); 
    fastify.patch('/user',{preHandler: [verifyToken]},updateUser);
}