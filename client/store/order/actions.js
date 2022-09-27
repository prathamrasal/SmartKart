import { fetchAllOrderAPI, mintNFTAPI, placeOrderAPI, updateOrderStatusAPI } from "../../APIs/order";
import { setCart } from "../cart/actions";
import { actionTypes } from "./constants";


export const setOrderLoading = (state)=>{
    return {
        type : actionTypes.SET_LOADING,
        payload : state
    }
}

export const addOrder = (data)=>{
    return {
        type : actionTypes.ADD_ORDER,
        payload : data
    }
}

export const editOrder = (updatedData)=>{
    return {
        type : actionTypes.EDIT_ORDER,
        payload : updatedData
    }
}

export const setAllOrders = (orders)=>{
    return {
        type : actionTypes.SET_ALL_ORDERS,
        payload : orders
    }
}

export const placeOrder = (form, setStep, notificationDispatch)=>async(dispatch,getState)=>{
    const cartItems = getState().cart.items;
    const products = cartItems.map(c=>c._id);
    try {
        dispatch(setOrderLoading(true));
        const result = await placeOrderAPI({...form,productId : products});
        dispatch(addOrder(result.data.order));
        if (setStep) setStep(2);
        dispatch(setCart([]));
        if (notificationDispatch) {
            notificationDispatch({
                type : 'success',
                message : 'Order placed successfully!',
                title : 'Place Order',
                position : 'topR'
              })
            
        }
    }catch(err) {
        if (notificationDispatch) {
            notificationDispatch({
                type : 'error',
                message : err?.response?.data?.message || 'Something went wrong!',
                title : 'Place Order',
                position : 'topR'
              })
            
        }
    }finally {
        dispatch(setOrderLoading(false));
    }
}

export const updateOrderStatus = (id,status)=>async(dispatch,getState)=>{
    try {
        dispatch(setOrderLoading(true));
        const result = await updateOrderStatusAPI(id,status);
        console.log(result.data.updatedOrder)
        console.log(result.data.updatedOrder);
        dispatch(editOrder(result.data.updatedOrder));
    }catch(err) {
        console.log(err);
    }finally {
        dispatch(setOrderLoading(false));
    }
}

export const mintNftOrder = (id,tokenId,dispatchNotification)=>async(dispatch,getState)=>{
    try {
        dispatch(setOrderLoading(true));
        const result = await mintNFTAPI(id,tokenId);
        console.log(result.data.updatedOrder)
        dispatch(editOrder(result.data.updatedOrder));
        dispatchNotification({
            type : 'success',
            message : 'Order Updated',
            title : 'Order Update',
            position : 'topR'
        })
    }catch(err) {
        console.log(err);
    }finally {
        dispatch(setOrderLoading(false));
    }
}


export const fetchAllOrders = ()=>async(dispatch,getState)=>{
    try{
        dispatch(setOrderLoading(true));
        const result = await fetchAllOrderAPI();
       dispatch( setAllOrders(result.data.orders));
    }catch(err) {
        console.log(err);
    } finally{
        dispatch(setOrderLoading(false));
    }
}