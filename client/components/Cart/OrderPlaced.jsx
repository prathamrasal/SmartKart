import React from 'react'
import Confirmed from '../CircularProgress';
import Link from 'next/link'

const OrderPlaced = () => {
  return (
    <div className='w-full h-[85vh] justify-between text-center items-center'>
        <Confirmed>
            <div className=''>
                <div className='text-3xl font-[500] text-flipkartBlue'>Happy Shopping!😃</div>
                <div className='text-gray-600 cursor-pointer mt-2 underline'><Link href="/">Go back</Link></div>
            </div>
        </Confirmed>
    </div>
  )
}

export default OrderPlaced