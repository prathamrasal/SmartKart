import React, { useEffect } from 'react'
import AccountLayout from '../../../components/AccountLayout';
import Image from 'next/image';

import { verifyAuthentication } from '../../../utils/verifyAuth';
import { fetchAllOrderAPI } from '../../../APIs/order';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { setAllOrders } from '../../../store/order/actions';
export const getServerSideProps = async(ctx) => {
  const auth = verifyAuthentication(ctx.req);
  if (auth.state) {
    const orders = await fetchAllOrderAPI(auth.token);
    return {props : {user : auth.decodedData.user, orders : orders.data.orders}};
  }
  return {
    redirect : {
      destination : '/auth'
    }
  }
};
// }

const OrderItem = ({details})=>{
  return (
    <>
    <div className='lg:hidden  flex items-center p-2 space-x-4'>
      <div className='p-1 border-2 rounded-md'>
        <Image src='/product/p1.png' width={70} height={70}/>
      </div>
      <div>
        <div className='font-semibold '>Calpol Syrup and 3 more items...</div>
        <div className='text-sm text-gray-400'>Ordered on 22-Jan-2022</div>
        <div className='text-xs  text-blue-600'>Status : In Transit</div>
        
      </div>
    </div>
    <div className='hidden lg:block rounded-md font-default border-2'>
      <div className=''>
        <div className='justify-between p-3 bg-gray-100 text-gray-500 flex items-center'>
          <div className='flex space-x-7 items-center text-sm'>
            <div className='flex flex-col'>
              <div className=''>Order Placed</div>
              <div className='font-semibold'>{moment(details.createdAt).date()}  {moment(details.createdAt).format('MMM')} {moment(details.createdAt).year()}</div>
            </div>
            <div className='flex flex-col'>
              <div>Total</div>
              <div className='font-semibold'>₹{details.totalCost}</div>
            </div>
            <div className='flex flex-col'>
              <div>Delivered To</div>
              <div className='font-semibold'>{details?.customer?.username}</div>
            </div>
          </div>
          <div className='flex flex-col text-xs'>
            <div>ORDER #{details.orderId}</div>
            <div className='text-primary underline'>View Order Details</div>
          </div>
        </div>
      </div>
      <div className='bg-white p-3 mt-1 flex justify-between 3xl:p-5'>

        <div>
          <div className='text-primary font-semibold'>{details.orderStatus}</div>
          <div className='flex space-x-6 mt-3 w-[60px] h-[60px] relative'>
          <div>
          <Image src={details.product.image} layout='fill' objectFit='contain'/>
          </div>
        
          </div>
          <div className='mt-2 text-sm'>1 Items in this Order</div>
        </div>
        <div>
          <div className='text-xs px-4 py-[2px] border-2 rounded-md shadow-lg xl:text-sm  2xl:px-8 '><Link href={`/account/myorders/${details.orderId}`}>View Order</Link></div>
        </div>
      </div>

    </div>
    <hr className='lg:hidden' />
    </>
  )
}

const Orders = ({orders,user}) => {

  return (
    <AccountLayout>
     <div className='p-3 font-poppins lg:p-4'>
        <div className='text-2xl font-semibold'>MY ORDERS</div>
        <div className='w-[20%] h-[2px] bg-primary'></div>
        <div className='mt-4 flex space-x-3 items-center'>
          <div className='w-[100%]'>
          <input type="text" className='text-sm border-2 outline-none w-[100%] lg:p-2 p-[6px] rounded-md' placeholder='Search All Orders' />
          </div>
          <div>
            <select name="filterOrders" className='border-2 lg:p-[7px] p-1 rounded-md' id="filterOrder">
              <option value="AllOrders">All Orders</option>
              <option value="Active Orders">Active Orders</option>
              <option value="Active Orders">Delivered Orders</option>
              <option value="cancelledOrders">Cancelled Orders</option>
            </select>
          </div>
        </div>
        <hr className='lg:hidden'/>
        <div className='mt-6 space-y-3 lg:space-y-6'>
          {orders.map(o=><OrderItem details={o}/>)}
        </div>
      </div>
    </AccountLayout>
  )
}

export default Orders