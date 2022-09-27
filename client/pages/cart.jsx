import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import {RiCheckboxCircleFill} from 'react-icons/ri';
import Input from '../components/Input';
import Shipping from '../components/Cart/Shipping';
import Payment from '../components/Cart/Payment';
import OrderPlaced from '../components/Cart/OrderPlaced';
import { verifyAuthentication } from '../utils/verifyAuth';
import { fetchAllCartItems, setCart } from '../store/cart/actions';
import { getCartItemsAPI } from '../APIs/cart';
import {useDispatch, useSelector} from 'react-redux';
import { setAuthDetails } from '../store/auth/actions';
import Image from 'next/image';
import Link from 'next/link';
const OrderItem = ({details}) => {
    return (
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-5">
          <div className="w-[44px]  relative rounded-md h-[44px]">
            <Image layout='fill' objectFit='contain' src={details.image}/>
          </div>
          <div className="">
            <div className="font-[500] text-sm">{details.name.slice(0,50)}...</div>
            <div className="text-sm text-gray-400">{details.type}</div>
          </div>
        </div>
        <div className="text-sm">₹{details.cost}</div>
      </div>
    );
  };

  export const getServerSideProps = async(ctx) => {
    const auth = verifyAuthentication(ctx.req);
    if (auth.state) {
      try {
      const cartItems = await getCartItemsAPI(auth.token);
      return {props : {cart : cartItems.data.cart.product || [],user : auth.decodedData.user}}
      }catch(err) {
        console.log(err);
        return {
          notFound : true
        }
      }

    }
    return {
      redirect : {
        destination : '/auth'
      }
    }
  };
  

const Cart = ({user,cart}) => {
  console.log(user,cart);

  const [form,setForm] = useState({
    customerAddress : "",
    houseNumber : "",
    city : "",
    pincode : "",
    country : "",
    state : "",
    couponCode : "",
});

  const [step,setStep] = useState(0);
  const dispatch = useDispatch();
  const {loading,items,total} = useSelector(state=>state.cart)
  useEffect(()=>{
    if (user) {
      dispatch(setAuthDetails({isLoggedin : true,user : user}));
      dispatch(setCart(cart));
    }
  }, []);
  console.log(total)

    
  return (
    <>
    <Header/>
    {cart.length===0?<div className='h-[80vh] w-full flex items-center justify-center flex-col'>
      <div className='text-4xl font-[600] text-center'>Your Cart is Empty! :(</div>
      <button className='text-center bg-flipkartYellow mt-8 px-7 text-lg w-fit py-2 rounded-md cursor-pointer'><Link href="/">Continue Shopping</Link></button>

    </div>: 
    step===2?<OrderPlaced/>:<div className='grid grid-cols-[3fr_1.6fr] gap-16 p-8 px-28'>
      <div>
        {step==0&&<Shipping form={form} setForm={setForm} step={step} setStep={setStep}/>}
        {step==1&&<Payment step={step} form={form} setForm={setForm} setStep={setStep}/>}
      </div>
        <div>
            <div className='flex justify-between items-center'>
                <div className='text-2xl font-[500] '>Summary</div>
                <div className='w-[40px] h-[40px] rounded-xl bg-gray-300 flex items-center justify-center font-[500] text-gray-700'>{items.length}</div>
            </div>
            <div className='mt-7 space-y-7 pb-8 border-b-[1px] border-gray-300'>
              {loading&&<div>loading...</div>}
               {items.map(item=><OrderItem key={item._id} details={item}/>)}
            </div>
            <div className='mt-6 space-y-2'>
            <div className="flex justify-between items-center">
                <div className="font-[500]">Sub Total</div>
                <div>₹{total}</div>
              </div>
            <div className="flex justify-between items-center pb-5 border-b-[1px] border-gray-300">
                <div className="font-[500]">Discount</div>
                <div>₹0</div>
              </div>
            <div className="flex justify-between items-center pt-5">
                <div className="font-[600] text-lg">Total</div>
                <div className='font-[600] text-lg'>₹{total}</div>
              </div>
            </div>
        </div>
    </div>}
    </>
  )
}

export default Cart