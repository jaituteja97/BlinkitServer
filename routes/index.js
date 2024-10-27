import { authRoutes } from "./auth.js";
import { orderRoute } from "./order.js";
import { categoryRoute, productRoute } from "./product.js";



const prefix  = "/api";

export const registerRoutes = async (fastify) => 
{
     fastify.register(authRoutes,{prefix : prefix});  
     fastify.register(categoryRoute,{prefix : prefix});  
     fastify.register(productRoute,{prefix : prefix});  
     fastify.register(orderRoute,{prefix : prefix});  
}

