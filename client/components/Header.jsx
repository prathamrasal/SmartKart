import React, { useEffect } from "react";
import Image from "next/image";
import WhiteLogo from "../public/assets/whitelogo.svg";
import {BsFillPersonFill} from 'react-icons/bs';
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import {MdShoppingCart} from 'react-icons/md';
import {useDispatch} from 'react-redux';
import { fetchAllCartItems } from "../store/cart/actions";
import {useRouter} from 'next/router';
import { checkAuth } from "../store/auth/actions";
import {FaUserAlt} from 'react-icons/fa';
import { ConnectButton } from "web3uikit"
import {useMoralis,useWeb3Contract} from 'react-moralis';


const Header = () => {
  const {isLoggedin,user} = useSelector(state=>state.auth);
  const {items,loading} = useSelector(state=>state.cart);
  const {chainId,account,isWeb3Enabled} = useMoralis();
  const dispatch = useDispatch();
  const router = useRouter();
  useEffect(()=>{
    if (isLoggedin) {
      console.log('fetching cart..')
    dispatch(fetchAllCartItems()); 
    }
    
    console.log(isLoggedin);
  }, [isLoggedin])

  useEffect(()=>{
    dispatch(checkAuth());
  }, [])

  useEffect(()=>{
    console.log('CONNECTED!');
  }, [isWeb3Enabled])
  
  return (
    <div className="py-3 px-32 bg-flipkartBlue">
      <div className="flex items-center justify-between">
        <div className="flex gap-10 items-center">
          <div onClick={()=>router.push('/')} className="w-[140px] cursor-pointer">
            <Image src={WhiteLogo} alt="Logo" />
          </div>
          {/* <div className="w-[400px] ml-8 relative flex items-center justify-center">
            <input
              className="w-full py-[6px] rounded-sm bg-bgPrimary-600 px-3 text-textPrimary outline-none  placeholder:text-sm"
              placeholder="Search for items"
            />
            <div className="absolute right-3 ">
              <FiSearch className="text-gray-500" size={20} />
            </div>
          </div> */}
          {!isLoggedin&&<div className="px-10 py-[6px] rounded-sm font-semibold cursor-pointer bg-bgPrimary-600 text-flipkartBlue" onClick={()=>router.push('/auth')}>Login</div>}
       
          {isLoggedin&&user.role==='seller'&&<div className="text-white font-[500] cursor-pointer hover:underline" onClick={()=>router.push(`/seller/${user._id}`)}>Switch to Seller</div>}
        </div>
        <div className="flex items-center gap-8 text-white">
          
          <div onClick={()=>router.push('/cart')} className="flex items-center gap-1 cursor-pointer">
            <div className="relative"><MdShoppingCart size={25}/><div className="text-xs absolute bg-flipkartYellow rounded-full text-black w-[15px] h-[15px] flex items-center justify-center -top-1 -right-1">{items?.length || 0}</div></div>
            <div className="font-[500]">Cart</div>
            </div>
          {isLoggedin&&<div onClick={()=>router.push('/account/user')} className="flex items-center gap-2 cursor-pointer">
            <div className="relative"><FaUserAlt size={18}/></div>
            <div className="font-[500]">{user?.username || user?.email}</div>
          </div>}
         {isLoggedin&&<ConnectButton moralisAuth={false}/>}
        </div>
      </div>
    </div>
  );
};

export default Header;
