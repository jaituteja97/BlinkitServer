import { Category } from "../../model/index.js"

export const getAllCategory= async(req,reply) => 
{
    const category = await Category.find();
    return reply.send(category);

}