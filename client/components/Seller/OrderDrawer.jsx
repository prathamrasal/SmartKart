import { Drawer } from "@mui/material";
import React, { useState } from "react";
import { MdClear, MdOutlinePayment } from "react-icons/md";
import { TbPhoneCall } from "react-icons/tb";
import { AiOutlineShoppingCart } from "react-icons/ai";
import moment from 'moment'
import Image from "next/image";
import { updateOrderStatus } from "../../store/order/actions";
import { useDispatch } from "react-redux";
import {useNotification} from 'web3uikit';
import {useWeb3Contract} from 'react-moralis'
import WarrantyABI from '../../constants/WarrantyNFTABI.json';

const OrderItem = ({details}) => {
  
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-5">
        <div className="w-[44px]  rounded-md h-[44px] relative">
          <Image src={details.image} layout='fill' objectFit="contain"/>
        </div>
        <div className="">
          <div className="font-[500] text-sm">{details.name}</div>
          <div className="text-sm text-gray-400">{details.type}</div>
        </div>
      </div>
      <div className="text-sm">₹ {details.cost}</div>
    </div>
  );
};

const OrderDrawer = ({ isOpen, handleClose,data }) => {
  const dispatch = useDispatch();
  const notificationDispatch = useNotification();
  const [status,setStatus] = useState(data.orderStatus)
  const handleChange = (e)=>{
    if (status==='delivered') {
      notificationDispatch({
        type : 'error',
        message : `Cannot update the product once its delivered`,
        title : 'Status Update',
        position : 'topR'
      })
    }
    setStatus(e.target.value);
  }
  const {runContractFunction : mintNftWithOrder} = useWeb3Contract({
    abi: WarrantyABI,
    contractAddress: data.seller.warrantyAddress,
    functionName: "mintNftWithOrder",
    params: {
      customer : data.customerWallet,
      orderId : data.orderId,
      activeTokenURI : data.activeTokenURI,
      expireTokenURI : data.expireTokenURI,
      expiry : 100,
    },
  });

  const handleSave = async(e)=>{

    const handleSuccess = (e)=>{
      console.log(e);
      notificationDispatch({
        type : 'success',
        message : `Order ${data.orderId} has been updated to ${status}`,
        title : 'Status Update',
        position : 'topR'
      })
      dispatch(updateOrderStatus(data._id,status));
    }
    const handleError = (err)=>{
      console.log(err);
      notificationDispatch({
        type : 'error',
        message : `Something went wrong!`,
        title : 'Status Update',
        position : 'topR'
      })
    }

    if (status==='delivered') {
      const result = await mintNftWithOrder({
        onSuccess : handleSuccess,
        onError : handleError
      });
    }
    else {
      handleSuccess();
    }
  }
 
  return (
    <div>
      <Drawer open={isOpen} onClose={handleClose} anchor={"right"}>
        <div className="w-[500px] p-7 h-[100vh] overflow-y-auto">
          <div className="flex items-center justify-between w-full">
            <div className="text-xl font-[500]">Order #{data.orderId}</div>
            <div className="" onClick={handleClose}>
              <MdClear size={24} />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div className="text-base">
              <span className="font-[500]">Date : </span> {moment(data.createdAt).date()}  {moment(data.createdAt).format('MMMM')} {moment(data.createdAt).year()}
            </div>
            <div className="select flex items-center">
              <select onChange={handleChange} defaultValue={data.orderStatus} value={status} className="border-b-[2px] rounded-md px-5 py-1 outline-none">
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <div onClick={handleSave} className="bg-green flex items-center justify-center border-[1px] p-2 text-center">✅</div>
            </div>
          </div>
          <div className="mt-6 w-full">
            <div className="bg-bgPrimary-600 flex items-center py-[7px] px-2">
              <div className="font-semibold">Order Summary</div>
            </div>
            <div className="mt-5 w-full space-y-6 pb-5 border-b-[1px]">
              <OrderItem details={data.product}/>
             
            </div>
            <div className="mt-5 space-y-1 text-sm">
              <div className="flex justify-between items-center">
                <div className="font-[600]">Sub Total</div>
                <div>₹{data.totalCost}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-[600]">Discount</div>
                <div>₹ {0}</div>
              </div>
              <div className="flex justify-between items-center pt-5">
                <div className="font-[600]">Total</div>
                <div className="font-[600]">₹ {data.totalCost}</div>
              </div>
            </div>
          </div>
          <div className="mt-6 w-full">
            <div className="bg-bgPrimary-600 flex items-center py-[7px] px-2">
              <div className="font-semibold">Customer Details</div>
            </div>
            <div className="mt-5 text-gray-800">
              <div className="w-full flex justify-between">
                <div className="flex gap-2 items-center">
                  <div className="w-[40px] h-[40px] rounded-full bg-flipkartYellow"></div>
                  <div className="">{data.customer.username}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <div>
                    <TbPhoneCall />
                  </div>
                  <div className="text-gray-600 text-sm">+91 {data.customer.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-5 px-2">
                <div>
                  <AiOutlineShoppingCart />
                </div>
                <div className="text-sm">
                  {data.orderDetails.customerAddress.houseNumber}, {data.orderDetails.customerAddress.city}, {data.orderDetails.customerAddress.pincode} , {data.orderDetails.customerAddress.country}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 px-2">
                <div>
                  <MdOutlinePayment />
                </div>
                <div className="text-sm">Cash on delivery</div>
              </div>
            </div>

            <div className="mt-6">
            <div className='bg-bgPrimary-600 flex items-center py-[7px] px-2 mt-6'>
                <div className='font-semibold'>Additional Details</div>
            </div>
            <div className="mt-4 text-sm space-y-1">
                <div className="flex items-center gap-2">
                    <div className="font-[600]">Warranty NFT : </div>
                    <div className="">Not Minted</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="font-[600]">Warranty : </div>
                    <div className="">{data.product.warranty} years</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="font-[600]">Customer Wallet Address : </div>
                    <div className="">Not Found</div>
                </div>
            </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default OrderDrawer;
