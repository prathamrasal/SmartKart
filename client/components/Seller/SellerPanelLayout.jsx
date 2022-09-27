import React, { useEffect } from 'react'

import WhiteIcon from '../../public/assets/icon.svg';
import Image from 'next/image'

import {MdHome} from 'react-icons/md';
import {VscWorkspaceTrusted} from 'react-icons/vsc';
import {BsPeopleFill} from 'react-icons/bs';
import {CgLogOut} from 'react-icons/cg';
import {BsFillBellFill } from 'react-icons/bs';
import SideBarIcon from './SidebarIcon';
import { useRouter } from 'next/router';
import {GoPackage} from 'react-icons/go';   
import {useSelector, useDispatch} from 'react-redux'
import { checkAuth, logoutUser } from '../../store/auth/actions';
import {ConnectButton} from 'web3uikit';

const SellerPanelLayout = ({children}) => {
 const router = useRouter();
 const {user} = useSelector(state=>state.auth);
 const dispatch = useDispatch();
 console.log(user)
 useEffect(()=>{
    dispatch(checkAuth())
 }, [])
  return (
<div className='grid grid-cols-[0.05fr_0.95fr] h-[100vh] w-full '>
        <div className='h-full flex flex-col items-center py-4 w-full bg-flipkartBlue'>
            <div className='w-[50px]'><Image src={WhiteIcon}/></div>
            <div className='mt-8 space-y-5'>
                <SideBarIcon icon={<MdHome size="23" />} link={`/seller/${router.query.id}`} text="Home"/>
                <SideBarIcon icon={<GoPackage size="23" />} link={`/seller/${router.query.id}/inventory`} text="Inventory"/>
                <SideBarIcon icon={<BsPeopleFill size="21" />} link="/" text="All Customers"/>
                <SideBarIcon icon={<VscWorkspaceTrusted size="21" />} link={`/seller/${router.query.id}/verify`}text="Verification Center"/>
            </div>
            <div className='h-full flex items-end'>
            <SideBarIcon icon={<CgLogOut size={23} />} link='/' text="Go Back" onClick={()=>dispatch(logoutUser())}/>
            </div>
        </div>
        <div className='bg-bgPrimary-600'>
            <div className='w-full flex justify-between items-center px-12  bg-white py-4 shadow-sm'>
                <div className='flex items-center gap-2'>
                    <div className='text-xl font-semibold'>{user.businessName}</div>
                    {!user.isSellerVerified&&<div className='text-[0.6rem]   px-1 py-[3px] border-[1px] border-red-600 rounded-md text-red-600'>🔴 Not Verified</div>}
                    {user.isSellerVerified&&<div className='text-[0.6rem]   px-1 py-[3px] border-[1px] border-green-600 rounded-md text-green-600'>🟢  Verified</div>}
                </div>
                <div className='flex items-center gap-10'>
                    <div><BsFillBellFill className='text-gray-400' size={23}/></div>
                    <div className='flex items-center gap-2'>
                        <div className='w-[40px] h-[40px] bg-flipkartYellow rounded-full'></div>
                        <div className='text-xs'>
                            <div className='font-[500] text-sm'>{user.username}</div>
                            <div className='text-blue-500'>{user.role}</div>
                        </div>
                        <ConnectButton moralisAuth={false}/>
                    </div>
                </div>
            </div>
            <div className='p-4 h-[90vh] w-full'>
                <div className='bg-white rounded-sm h-full w-full'>
                    {/* Contents */}
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default SellerPanelLayout