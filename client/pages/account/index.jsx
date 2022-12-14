import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import AccountSidebar from '../../components/AccountSidebar';

import { verifyAuthentication } from '../../utils/verifyAuth';


export const getServerSideProps = (ctx) => {
    const auth = verifyAuthentication(ctx.req);
    if (auth.state) {
      return {props : {}};
    }
    return {
      redirect : {
        destination : '/auth'
      }
    }
  };

const Account = () => {
    const [screenWidth,setScreenWidth] = useState(100);
    const router = useRouter();
    useEffect(()=>{
        setScreenWidth(window.innerWidth);
    }, [])
    useEffect(()=>{
        if (screenWidth>=1024) {
            router.push('/account/user');
        }
    }, [screenWidth])


    return <AccountSidebar/>
}


export default Account