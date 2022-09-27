import React from 'react'
import {FiSearch} from 'react-icons/fi'

const SearchBar = ()=>{
    return (
        <div className='flex items-center relative w-[50%]'>
            <div className='absolute left-2 text-gray-500'>
            <FiSearch/>
            </div>
            <input type='text' placeholder='Search Order' className='w-full pl-9 outline-none bg-bgPrimary-600 py-2 rounded-md'/>
        </div>
    )
}

export default SearchBar