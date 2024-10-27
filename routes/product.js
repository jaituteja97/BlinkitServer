import { getAllCategory } from "../controller/products/category.js";
import { fetchProducts } from "../controller/products/products.js";


export const categoryRoute = async (fastify,options) =>
{
    fastify.get('/categories',getAllCategory); 
   
}

export const productRoute = async (fastify,options) =>
    {
        fastify.post('/products',fetchProducts); 
    }