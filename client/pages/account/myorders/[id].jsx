import React, { useEffect, useState } from "react";
import AccountLayout from "../../../components/AccountLayout";
import { BsCheck2 } from "react-icons/bs";
import Image from "next/image";
import { verifyAuthentication } from "../../../utils/verifyAuth";
import { fetchOrderAPI } from "../../../APIs/order";
import { Button } from "@mui/material";
import {useNotification} from 'web3uikit';
import {useMoralis, useWeb3Contract} from 'react-moralis';
import WarrantyABI from '../../../constants/WarrantyNFTABI.json'
import {useDispatch} from 'react-redux';
import { mintNftOrder } from "../../../store/order/actions";
import { useRouter } from "next/router";

export const getServerSideProps = async(ctx) => {
  const auth = verifyAuthentication(ctx.req);
  if (auth.state) {
    try {
      console.log(ctx.query.id)
    const orderData = await fetchOrderAPI(ctx.query.id,auth.token);
    return {props : {order : orderData.data.order, user : auth.decodedData.user}};
    }catch(err) {
      console.log(err);
      return {notFound : true};
    }
  }
  return {
    redirect : {
      destination : '/auth'
    }
  }
};



const OrderItem = ({details}) => {
  return (
    <div className="flex items-center space-x-5 p-1 border-[1px] rounded-md">
      <div className="p-1 h-[50px] w-[50px] relative">
        <Image src={details.image} layout='fill' objectFit="contain" />
      </div>
      <div>
        <div className="font-semibold">{details.name}</div>
        <div className="text-accent text-sm ">Price : ₹{details.cost}</div>
      </div>
      <hr />
    </div>
  );
};

const Order = ({order,user}) => {
  const [warrantyStatus,setWarrantyStatus] = useState(false);
  const {account,chainId,isWeb3Enabled} = useMoralis();
  const [nftURI,setNFTURI] = useState(false);
  const [nftLoading,setNFtLoading] = useState(false);
  const {runContractFunction : tokenURI} = useWeb3Contract({
    abi: WarrantyABI,
    contractAddress: order.seller.warrantyAddress,
    functionName: "tokenURI",
    params: {
      tokenId : order.isNftMinted?order.tokenId:'1'
    }
  })
  const router = useRouter();

  useEffect(()=>{
    const fetchTokenURI = async()=>{
      if (order.isNftMinted) {
        const handleTokenSuccess = (result)=>{
          dispatchNotification({
            type : 'info',
            message : `NFT Detected with token URI : ${result}, token ID : ${order.tokenId}`,
            position : 'topR',
            title : 'NFT Detected!'
          })
          setNFtLoading(false);
          setNFTURI(result);
        }
        setNFtLoading(true);
        const tokenLink = await tokenURI({
          onSuccess : handleTokenSuccess,
          onError :(err)=>console.log(err)
        });
        console.log(tokenLink);
   
      }
    }
    if (!nftURI && isWeb3Enabled) {
    fetchTokenURI();
    }
  }, [order, isWeb3Enabled])


  const dispatchNotification = useNotification();
  const handleWeb3NotEnabled = ()=>{
    dispatchNotification({
      type : 'error',
      message : 'Please Connect your wallet',
     title : 'Wallet Connection',
     position : 'topR'
    })
  }
  const handleInCorrectAddress = ()=>{
    dispatchNotification({
      type : 'error',
      message : `This Wallet Address is not linked with the wallet, Please connect to ${order.customerWallet}`,
      position : 'topR',
      title : 'Wallet Connection'
    })
  }
  const handleError = (err,title)=>{
    dispatchNotification({
      type : 'error',
      message :err,
      position : 'topR',
      title : title
    })
  }
  const handleSuccess = (result,message,title,callback)=>{
    dispatchNotification({
      type : 'success',
      message :message,
      position : 'topR',
      title : title
    })
    if (callback) callback(result);
  }
  const dispatch = useDispatch();

  // const {runContractFunction : getCustomerOrders} = useWeb3Contract({
  //   abi: WarrantyABI,
  //   contractAddress: order.seller.warrantyAddress,
  //   functionName: "getCustomerOrders",
  //   params: {}
  // })
  const {runContractFunction : getTokenDetailsFromOrderId} = useWeb3Contract({
    abi: WarrantyABI,
    contractAddress: order.seller.warrantyAddress,
    functionName: "getTokenDetailsFromOrderId",
    params: {
     orderId : order.orderId
    }
  })
  
 
  
  // const handleCheckWarrantyStatus = async()=>{
  //   if (!isWeb3Enabled) return handleWeb3NotEnabled();
  //   if (account !== order.customerWallet) return handleInCorrectAddress();
  //   try {
  //     const callFunction = (result)=>{
  //      const stringOrderIds = result.map(r=>r.toString());
  //      console.log(stringOrderIds);
  //      if (stringOrderIds.includes(order.orderId)) {
  //       handleSuccess(order.orderId,"NFT has been issued, Please claim your warranty", "Warranty Status");
  //       setWarrantyStatus(true);
  //      }
  //      else {
  //       handleError("NFT has not been issued yet", "Warranty Status");
  //      }
  //     }
  //     const result = await getCustomerOrders({
  //       onError : ()=>handleError('Something Went Wrong', 'Warranty Status Error'),
  //       onSuccess:  (res)=>handleSuccess(res,'Warranty Result has been fetched', 'Warranty Status',callFunction)
  //     })
  //     console.log(result);
  //   }catch(err) {
  //     console.log(err);
  //   }

  // }
  const handleClaimWarranty = async()=>{
    if (!isWeb3Enabled) return handleWeb3NotEnabled();
    if (account !== order.customerWallet) return handleInCorrectAddress();
    const tokenId = await getTokenDetailsFromOrderId({
      onSuccess : (id)=>{
        dispatch(mintNftOrder(order._id,id.toString(),dispatchNotification));
        dispatchNotification({
          type :'success',
          message : `NFT has been minted successfully with id ${id.toString()}`,
          title : 'NFT Minted',
          position : 'topR'
        })
      },
      onError: (err)=>{
        console.log(err);
        dispatchNotification({
          type :'error',
          message : 'NFT has not been minted yet. Try again later.',
          title : 'NFT Minted',
          position : 'topR'
        })
      }
    })
  

    
  }
  const handleGoToNFT = ()=>{
    if (nftURI) {
      router.push(`https://ipfs.io/${nftURI.replace("ipfs://","ipfs/")}`)
    }else {
      dispatchNotification({
        type : 'error',
        message : 'NFT Not Found, Please Refresh',
        title : 'NFT URI',
        position :'topR'
      })
    }
  }
  return (
    <AccountLayout>
      <div className="font-default 2xl:px-5">
        <div className="p-2">
          <div className="text-sm text-gray-500 font-semibold">
            #{order?.orderId}
          </div>
          <div className="mt-1 text-xl font-poppins font-semibold">
            ORDER DETAILS
          </div>
        </div>
        <div className="mt-2 p-2">
          <div className="text-green-600 text-lg ">Delivered</div>
          <div className="mt-5">
            <div className="h-[5px] flex items-center justify-between w-[100%] bg-flipkartBlue">
              <div className="flex flex-col mt-[15px] justify-center">
                <div className="h-[20px] w-[20px] bg-flipkartBlue rounded-full flex items-center justify-center text-white">
                  <BsCheck2 />
                </div>
                <div className="text-xs">Ordered</div>
              </div>
              <div className="flex flex-col mt-[15px] items-center justify-center">
                <div className="h-[20px] w-[20px] bg-flipkartBlue rounded-full flex items-center justify-center text-white">
                  <BsCheck2 />
                </div>
                <div className="text-xs">Dispatched</div>
              </div>
              <div className="flex flex-col mt-[15px] items-end">
                <div className="h-[20px] w-[20px] bg-flipkartBlue rounded-full flex items-center justify-center text-white">
                  <BsCheck2 />
                </div>
                <div className="text-xs">Delivered</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 p-2">
          <div className="font-semibold text-lg">Items in this Order</div>
          <div className="mt-2 space-y-3">
            <OrderItem details={order.product}/>
          </div>
        </div>
        <div className="mt-5 p-2">
          <div className="font-semibold text-lg">Order Summary</div>
          <div className="mt-3">
            <div className="justify-between flex">
              <div>Items Subtotal(3) : </div>
              <div>₹{order.totalCost}</div>
            </div>
            <div className="justify-between flex">
              <div>Delivery Charges : </div>
              <div>₹{0}</div>
            </div>
            <div className="justify-between flex">
              <div>Total Tax : </div>
              <div>₹{0}</div>
            </div>
            <div className="justify-between flex mt-3">
              <div className="font-bold">Grand Total : </div>
              <div className="font-bold">₹{order.totalCost}</div>
            </div>
            <div className="justify-between flex mt-1">
              <div className="font-bold text-green-600">Total Savings : </div>
              <div className="font-bold text-green-600"> ₹{0}</div>
            </div>
          </div>
        </div>

        <div className="mt-5 p-2">
        <div className="font-semibold text-lg">Claim Warranty</div>
          {order.orderStatus==='delivered'?<div>
            {order.isNftMinted?<div>
              <div className="text-flipkartBlue">NFT has already been minted! {order.NFTUri}</div>
              <Button disabled={nftLoading} variant="outlined" onClick={handleGoToNFT}>{nftLoading?'Loading...':'Go to NFT'}</Button>
            </div>:<div><Button variant="outlined" onClick={handleClaimWarranty}>Claim NFT</Button></div>}

          </div>:<div>Order has not been delivered yet..</div>}

          
        </div>




        <div className="mt-5 p-2">
          <div className="text-lg font-semibold">Delivery Address</div>
          <div className="mt-2">
            <div>Kunal Sangtiani</div>
            <div>32/5 Rajmahal Colony, Manik Bagh Road</div>
            <div>Indore, India</div>
          </div>
        </div>
        <div className="flex mt-7 p-2">
          <div className="px-3 py-1 bg-red-500 cursor-pointer text-white rounded-md">
            Cancel Order
          </div>
        </div>
      </div>
    </AccountLayout>
  );
};

export default Order;
