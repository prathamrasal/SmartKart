import React from 'react'
import FilterComponent from './FilterComponent'

const Filters = () => {
  const categoryOptions = ['Apple', 'Samsung', 'Oppo', 'Vivo'];
  const sellerOptions = ['Darshan Electronics', 'Smart Electronics', 'Walmart']
  return (
    <div className='bg-bgPrimary-700'>
      <div className='px-6 py-4 text-textPrimary font-semibold text-xl'>
        Filters
      </div>
      <hr className='border-gray-300'/>
      <div className='mt-3 py-3 pb-12 px-6 space-y-12 ng'>
        <FilterComponent title='Category' options={sellerOptions} />
        <FilterComponent title='Seller' options={categoryOptions}/>
      </div>
    </div>
  )
}

export default Filters