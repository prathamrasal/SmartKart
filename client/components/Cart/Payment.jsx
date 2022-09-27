import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../../store/order/actions';
import Input from '../Input'
import {useMoralis} from 'react-moralis'
import {Loading, Skeleton, useNotification} from 'web3uikit'

const Payment = ({step,setStep,form,setForm}) => {
  const [dimenstion,setDimenstion] = useState({
    height : '500',
    width : '600'
  })
  const handleChange = (e)=>{
    setForm((prev)=>({...prev,[e.target.name] : e.target.value}));
}


const {isWeb3Enabled,isWeb3EnableLoading,account,chainId} = useMoralis();
const dispatch = useDispatch();

const {loading} = useSelector(state=>state.orders)

const notificationDispatch = useNotification();
const handlePlaceOrder = ()=>{
  if (isWeb3Enabled) {
  dispatch(placeOrder({...form, customerWallet : account},setStep,notificationDispatch));
  }
  else {
    notificationDispatch({
      type : 'error',
      message : 'Please connect your wallet to continue',
      title : 'Place Order',
      position : 'topR'
    })
  }
}

useEffect(()=>{
  setTimeout(()=>{
    setDimenstion({
      height : ref.current.clientHeight,
      width : ref.current.clientWidth
    })
  }, 500)
}, [])

const ref = useRef();

if (loading) return <div className='flex items-center justify-center' style={{height : dimenstion.height, width:  dimenstion.width}}>
<Loading
    size={50}
    spinnerColor="#2E7DAF"
    text='Placing your order....'
  />
 
  </div>


  return (
    <div ref={ref}>
       <div className='text-2xl font-[500] '>Apply Coupon</div>
       <div className='mt-6 grid grid-cols-[2.7fr_1fr] gap-5'>
        <Input value={form.couponCode} name="couponCode" onChange={handleChange} label='Coupon Code'/>
        <div className='border-[2px] text-flipkartBlue border-flipkartBlue cursor-pointer py-2 flex items-center justify-center font-[500] rounded-md w-full text-center'>Apply</div>
       </div>
       <div className='mt-12'>
        <div  className='px-5 py-2 bg-flipkartBlue w-fit  text-white  cursor-pointer rounded-md' onClick={handlePlaceOrder}>Place Order</div>
       </div>
    </div>
  )
}

export default Payment