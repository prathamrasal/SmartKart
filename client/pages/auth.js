import React, { useEffect, useState } from 'react'
import FlipkartIcon from '../public/assets/icon.svg';
import WhiteLogo from '../public/assets/whitelogo.svg';
import Image from 'next/image'
import {FiUnlock} from 'react-icons/fi';
import InputField from '../components/InputField';
import SelectInput from '../components/SelectRole';
import { useDispatch } from 'react-redux';
import { loginUser, signUpUser } from '../store/auth/actions';
import {useRouter} from 'next/router';
import { checkAuthAPI } from '../APIs/auth';
import { verifyAuthentication } from '../utils/verifyAuth';
import {useSelector} from 'react-redux';
import { useNotification } from 'web3uikit';

export const getServerSideProps = (ctx) => {
  const auth = verifyAuthentication(ctx.req);
  if (auth.state) {
    return {
      redirect : {
        destination : '/'
      }
    }
  }
  return {
    props: {},
  };
};

const initalState = {
  username : '',
  email : '',
  password : '',
  confirmPassword : '',
  businessName : '',
  role : 'customer',
  phone : '',
}

const Auth = ({props}) => {
  const dispatchNotification = useNotification();
    const [isLogin,setIsLogin] = useState(true);
    const {loading} = useSelector(state=>state.auth);
    const [form,setForm] = useState(initalState)
    const router = useRouter();
    const [error,setError] = useState('');
    const dispatch = useDispatch();
    const handleChange = (e)=>{
      setError(false);
        setForm(prev=>({...prev,[e.target.name] : e.target.value}));
    }
    const handleSubmit = (e)=>{
      setError(false);
      e.preventDefault();
        console.log(form);

        if (isLogin) {
          if (!form.email) return setError('Enter a valid Email');
          if (!form.password) return setError('Enter a valid password');
        }
        else {
          if (form.role==='seller') {
          if (!form.businessName) return setError('Enter a valid Business Name');
          }
          if (!form.confirmPassword) return setError('Enter a valid Confirm Password');
          if (!form.password) return setError('Enter a valid password');
          if (!form.email) return setError('Enter a valid Email');
          if (!form.role) return setError('Enter a valid Role');
          if (!form.phone) return setError('Enter a valid Phone Number');
          if (!form.username) return setError('Enter a valid Full Name');
          if (form.password!==form.confirmPassword) return setError('Passwords dont match')
        }
       
        if(isLogin) {
            dispatch(loginUser({email : form.email,password : form.password}, router,setError));
        }
        else {
            dispatch(signUpUser(form,setError, dispatchNotification, setIsLogin));
        }
    }
    useEffect(()=>{
      setError(false);
      setForm(initalState)
    },[isLogin])
  return (
    <div className='w-full h-[100vh]  px-12 flex items-center'>
        <div>
        <div className='text-3xl flex items-center gap-4 font-[500] text-textPrimary'>
        <FiUnlock size={36} className={`${error?'text-red-600':'text-flipkartBlue'}`} />
        <div className={`${error?'text-red-600':''}`}>{error?'Error':isLogin?'Login':'Sign Up'}</div>
        </div>
        <div className={`mt-3 ${error?'text-red-600':'text-gray-400'} `}>{!error?'Get your orders, Reccomendations & wishlist items':error}</div>

        <form className={`${isLogin?'w-[380px]':'w-[450px]'} transition-all mt-6  space-y-4`}>
            {!isLogin&& <InputField value={form.username} onChange={handleChange} name='username' label={'Full Name'} placeholder='Enter your Full Name' />}
            <InputField type="email" value={form.email} onChange={handleChange} name='email' label={'Email'} placeholder='Enter your Email' />
            {!isLogin&& <InputField value={form.phone} onChange={handleChange} name='phone' label={'Phone Number'} placeholder='Enter your phone Number' />}
            <div className='flex items-center gap-2'>
            {!isLogin&& <SelectInput value={form.role} name='role' onChange={handleChange} label={'Role'} placeholder='Enter your phone Number' />}
            {!isLogin&&form.role==='seller'&& <InputField value={form.businessName} onChange={handleChange} name='businessName' label={'Business Name'} placeholder='Business Name'/>}
            </div>
           <div className='flex items-center gap-2'>
           <InputField onChange={handleChange} value={form.password} type="password" name='password' label={'Password'} placeholder='Enter your Password'/>
           {!isLogin&&<InputField onChange={handleChange} value={form.confirmPassword} name='confirmPassword' label={'Confirm Password'} placeholder='Enter your Password'/>}

            </div>


            <div className='pt-2 cursor-pointer'>
            <button disabled={loading}  className='bg-white w-fit px-8 disabled:opacity-75 py-2 rounded-md' onClick={handleSubmit}>{loading?'Loading..':isLogin?'Login':'Sign Up'}</button>
            </div>
        </form>
        <div className='mt-7 text-textPrimary'>Don't have a account? <span className='ml-1 font-semibold cursor-pointer' onClick={()=>setIsLogin(prev=>!prev)}>{isLogin?'Sign Up':'Login'}</span></div>
        </div>
    </div>
  )
}

export default Auth