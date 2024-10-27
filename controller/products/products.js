import { Product } from "../../model/index.js"

export const fetchProducts = async (req,reply) => 
{
     let { categoryId } = req.body;

    try{
          const products = await Product.find({category : categoryId}).select('-category');

          if(!products)
          {
            return reply.code(404).send({ message: "No products found" });
          }
          
          return reply.send({products});

    }   
    catch(e)
    {
        return reply.code(500).send({ message: "Internal Server Error" });
    }  
}