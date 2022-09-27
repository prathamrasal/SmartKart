import React from "react";
import ProductImg from "../../public/assets/product.png";
import Image from "next/image";
import {AiFillStar} from 'react-icons/ai';
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../store/cart/actions";
import { useNotification } from "web3uikit";

const Rating = ()=>{
    return (
        <div className="flex items-center gap-4">
            <div className="flex px-4 py-[4px] bg-green-600 text-white rounded-xl">
                <div className="text-xs">4.3</div>
                <div><AiFillStar/></div>
            </div>
            <div className="text-sm text-gray-400">0 Ratings & 0 Reviews</div>
        </div>
    )
}

const Product = ({productDetails}) => {
  const {loading,items} = useSelector(state=>state.cart);
  const isIncluded =  items?.map(it=>it._id).includes(productDetails._id);
  const dispatch = useDispatch();
  const dispatchNotification = useNotification();
  const handleCart = ()=>{
    if (isIncluded) {
      dispatch(removeItemFromCart(productDetails,dispatchNotification));
    }
    else {
      dispatch(addItemToCart(productDetails,dispatchNotification));
    }
  }
  return (
    <div className="grid grid-cols-[0.2fr_0.8fr] gap-2 items-center w-full py-7 px-2 pr-8 border-b-[1px] border-b-gray-300">
      <div className="relative w-full h-[250px]">
        <Image src={productDetails.image} layout='fill' objectFit="contain" />
      </div>
      <div className="grid grid-cols-[0.8fr_0.3fr] w-full">
        <div className="">
          <div className="text-xl font-[600]">{productDetails?.name}</div>
          <div className="mt-2"><Rating/></div>
          <div className="mt-5 w-[80%] text-gray-400">{productDetails?.description?.slice(0,250)}..</div>
          <div className="mt-2">
            <div className="font-[450] text-gray-300 text-sm">Available Offers</div>
            <ul className="mt-1 text-sm font-[350] text-gray-400">
                <li>- 2 Years additional Warranty</li>
                <li>- 30% Off on all services</li>
                {/* <li>2 Years additional Warranty</li> */}
            </ul>
          </div>
        </div>
        <div className="flex w-full items-end flex-col text-right">
            <div className="text-2xl font-semibold">₹{productDetails.cost}</div>
            <div className="flex text-gray-500 mt-2 gap-3 justify-end text-sm w-full">
                <div className=""><strike>₹{productDetails.cost+5000}</strike></div>
                <div className="text-green-400   font-semibold ">56% Off</div>
            </div>
            <button disabled={(typeof(loading)==='string'&&loading===productDetails._id)} className=" mt-7 py-2 text-white cursor-pointer px-8 bg-flipkartBlue disabled:opacity-75 w-fit rounded-sm" onClick={handleCart}>{(typeof(loading)==='string'&&loading===productDetails._id)?'Loading...':isIncluded?'Remove from Cart':'Add to Cart'}</button>

        </div>
      </div>
    </div>
  );
};

export default Product;
