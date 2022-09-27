import { createServerInstance } from "../utils/serverInstance"

export const placeOrderAPI = async(form,token)=>{
    const serverInstance = createServerInstance(token);
    const result = await serverInstance.post('/order',form);
    return result;
}
export const fetchAllOrderAPI = async(token)=>{
    const serverInstance = createServerInstance(token);
    const result = await serverInstance.get('/order');
    return result;
}

export const fetchOrderAPI = async(id,token)=>{
    const serverInstance = createServerInstance(token);
    const result = await serverInstance.get(`/order/${id}`);
    return result;
}

export const updateOrderStatusAPI = async(id,status,token)=>{
    const serverInstance = createServerInstance(token);
    const result = await serverInstance.post(`/order/${id}`, {status});
    return result;
}

export const verifySellerAPI = async(data,token)=>{
    const serverInstance = createServerInstance(token);
    const result = await serverInstance.post('/auth/verifySeller', data);
    return result;
}

export const mintNFTAPI = async(id,tokenId,token)=>{
    const serverInstance = createServerInstance(token);
    const result = await serverInstance.post(`/order/mintNFT/${id}`, {tokenId});
    return result;
}