import React from 'react'
import Product from './Product'

const ProductsContainer = ({products}) => {
  return (
    <div className='bg-bgPrimary-700 px-6 py-3 text-textPrimary'>
        <div className='font-[500] text-textPrimary text-2xl py-3 pb-4'>All Products <span className='ml-2 text-sm text-gray-500 font-normal'>(Showing {products?.length || 0} products)</span></div>
        <hr  className='border-gray-500'/>
        <div className='mt-4 space-y-5'>
            {/* Products */}
            {products?.map(p=>(
              <Product productDetails={p} key={p._id}/>
            ))}
        </div>
    </div>
  )
}

export default ProductsContainer