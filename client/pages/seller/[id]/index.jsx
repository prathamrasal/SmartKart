import React, { useEffect, useState } from 'react'
import SellerPanelLayout from '../../../components/Seller/SellerPanelLayout'
import OrderDrawer from '../../../components/Seller/OrderDrawer'
import SearchBar from '../../../components/SearchBar'
import { verifyAuthentication } from '../../../utils/verifyAuth';
import { fetchAllOrderAPI } from '../../../APIs/order';
import moment from 'moment'
import { useDispatch,useSelector } from 'react-redux';
import { setAllOrders } from '../../../store/order/actions';
import Image from 'next/image';
export const getServerSideProps = async(ctx) => {
    const auth = verifyAuthentication(ctx.req);
    if (auth.state && auth.decodedData.user.role==='seller') {
        const fetchedOrders = await fetchAllOrderAPI(auth.token);
      return {props : {orders : fetchedOrders.data.orders, user : auth.decodedData.user}};
    }
    return {
      redirect : {
        destination : '/auth'
      }
    }
  };

const OrderItem = ({details})=>{
    const [isOpen,setIsOpen] = useState(false);
    const handleClose = ()=>setIsOpen(false);
    return (
        <>
        <OrderDrawer data={details} isOpen={isOpen} handleClose={handleClose}/>
        <div onClick={()=>setIsOpen(true)} className='px-8 grid grid-cols-[2fr_1fr_1fr_1fr_1fr] hover:bg-gray-100 transition-all items-center py-5 border-b-[1px] border-gray-300'>

            <div className='flex items-center gap-3'>
                <div className='w-[45px] h-[45px]  rounded-md relative'>
                  <Image src={details.product.image} layout='fill' objectFit='contain'/>
                </div>
                <div className='text-sm'>
                    <div className='font-[600]'>{details.product.name}</div>
                    <div className='text-gray-400 mt-[3px]'>{details.customer.username}</div>
                </div>
            </div>
            <div className=''>{moment(details.createdAt).date()}  {moment(details.createdAt).format('MMM')} {moment(details.createdAt).year()}, {moment(details.createdAt).format('HH')}:{moment(details.createdAt).format('MM')}</div>
            <div className='text-white bg-flipkartBlue px-3 py-[3px] h-fit w-fit rounded-md text-sm cursor-pointer'>{details.orderStatus}</div>
            <div className=''>{details.orderDetails.customerAddress.city}, {details.orderDetails.customerAddress.country}</div>
            <div className='text-green-600'>₹ {details.totalCost}</div>
        </div>
        </>
    )
}

const SellerPanel = ({orders,user}) => {
  console.log(orders);

  const dispatch = useDispatch();
  const {orders : stateOrders} = useSelector(state=>state.orders);
  useEffect(()=>{
    dispatch(setAllOrders(orders));
  }, []);
  return (
    <SellerPanelLayout>
        <div className='w-full h-full'>
            <div className='py-5'>
                <div className='px-6 w-full'>
                    <div className='mb-5 text-xl font-[500]'>Orders</div>
                <SearchBar/>
                </div>
                <div className='mt-7'>
                   {stateOrders.map(o=><OrderItem key={o._id} details={o}/>)}
                </div>
            </div>
        </div>
    </SellerPanelLayout>
  )
}

export default SellerPanel