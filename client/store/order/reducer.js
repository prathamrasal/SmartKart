import { actionTypes } from "./constants"

const initialState = {
    loading : false,
    orders : [],


}


const orderReducer = (state=initialState,action)=>{
    switch(action.type) {
        case actionTypes.SET_LOADING : return {...state,loading : action.payload};
        case actionTypes.SET_ALL_ORDERS : return {...state,orders : action.payload};
        case actionTypes.ADD_ORDER : return {...state, orders : [...state.orders,action.payload]};
        case actionTypes.EDIT_ORDER : return {...state,orders : [...state.orders.filter(p=>p.orderId!==action.payload.orderId), action.payload]}
        default : return state
    }
}

export default orderReducer;