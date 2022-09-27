import React from 'react'

const FilterItem = ({title}) => {
  return (
    <div className='flex items-center gap-3'>
        <div className=''><input type="checkbox" /></div>
        <div className='text-gray-600'>{title}</div>
    </div>
  )
}

export default FilterItem