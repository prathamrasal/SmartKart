import { createServerInstance } from "../utils/serverInstance";

export const addItemToCartAPI = async(productId,token)=>{
    const serverInstance = createServerInstance(token);
    const result = await serverInstance.post('/cart', {productId});
    return result;
}

export const getCartItemsAPI = async(token)=>{
    const serverInstance = createServerInstance(token);
    const result = await serverInstance.get('/cart');
    return result;
}

export const removeCartItemAPI = async(productId,token)=>{
    const serverInstance = createServerInstance(token);
    const result= await serverInstance.delete(`/cart/${productId}`);
    return result;
}