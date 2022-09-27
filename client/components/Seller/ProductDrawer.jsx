import React, { useState } from 'react'
import { MdClear } from "react-icons/md";

import { Drawer } from "@mui/material";
import InputField from './ProductField';
import ProductTextArea from './ProductTextArea';
import { useDispatch, useSelector } from 'react-redux';
import { addSellerProduct, editSellerProduct } from '../../store/products/actions';
import Image from 'next/image';
const ProductDrawer = ({isOpen,handleClose,data,isEdit}) => {
    const [form,setForm] = useState(data || {
        image : null,
        cost : '',
        type : '',
        warranty : '',
        description : '',
        name : ''
    });
    const dispatch = useDispatch();
    const {loading} = useSelector(state=>state.sellerProducts)

    const handleChange = (e)=>{
        setForm(prev=>({...prev,[e.target.name] : e.target.value}));
    }
    const handleImageChange = (e)=>{
        if (e.target.files.length>0) {
      
            setForm(prev=>({...prev,image : e.target.files[0]}))
        }
        else {
            setForm(prev=>({...prev,image : null}));
        }
    }
    const handleSave = ()=>{
        const formData = new FormData();
        for(const [key,value] of Object.entries(form)) {
            formData.append(key,value);
        }
        if (isEdit) {
            console.log(`EDITING...`)
            dispatch(editSellerProduct(data._id,form));
        }
        else {
            console.log(`ADDING...`)
            dispatch(addSellerProduct(formData));
        }
        handleClose();


    }
  return (
    <Drawer open={isOpen} onClose={handleClose} anchor={"right"}>
    <div className='w-[500px] p-7 h-[100vh] overflow-y-auto'>
        <div className='flex items-center justify-between w-full'>
        <div className="text-xl font-[600]">{isEdit?`Edit #${data._id}`:'Add Product'}</div>
            <div className="" onClick={handleClose}>
              <MdClear size={24} />
            </div>
        </div>
        <div className='mt-6'>
            <div className='flex items-center gap-5'>
                <div className='w-[140px] flex items-center relative justify-center p-2 rounded-md text-flipkartBlue h-[140px] border-[2px] border-flipkartBlue'>
                    <input disabled={isEdit} type='file' accept='.jpg,.png,.svg,.webp' onChange={handleImageChange} className='opacity-0 absolute'/>
                    {!form.image?'Add Image':form.image.name}
                    {(typeof(form.image)==='string')&&<Image src={form.image} layout='fill' objectFit='cover' />}
                </div>
                <div className='w-[270px] space-y-4'>
                    <InputField value={form.name} name="name" onChange={handleChange}  label='Product Title'/>
                </div>
            </div>
            <div className='mt-5 space-y-6 w-full'>
                
            <InputField label='Price' value={form.cost} name="cost" onChange={handleChange}/>
                <InputField value={form.type} name="type" onChange={handleChange} label='Category'/>
           
                <InputField value={form.warranty} name="warranty" onChange={handleChange}  label='Warranty'/>
                <ProductTextArea value={form.description} name="description" onChange={handleChange} label='Description'/>
            </div>
            <div className='mt-8 flex justify-end'>
                <button disabled={loading} className='w-fit disabled:opacity-75 disabled:animate-pulse bg-flipkartBlue px-6 py-1 text-white font-semibold cursor-pointer' onClick={handleSave}>{loading?'Loading...':'Save'}</button>
            </div>
        </div>
    </div>
    </Drawer>
  )
}

export default ProductDrawer