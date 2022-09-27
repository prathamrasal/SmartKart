import React, { useEffect, useState } from 'react'
import AccountLayout from '../../components/AccountLayout'
import {useMoralis} from 'react-moralis';
import {useWeb3Contract} from 'react-moralis'
import { verifyAuthentication } from '../../utils/verifyAuth';
import WarrantyABI from '../../constants/WarrantyNFTABI.json';
import { fetchSellerWarrantyAddresses } from '../../APIs/auth';
import { sellerAddress } from '../../constants/sellerAddresses';
import { CreditCard, Loading } from 'web3uikit';
import axios from 'axios';
import Image from 'next/image';
import NFTCard from '../../components/NFTCard';

export const getServerSideProps = async(ctx) => {
  const auth = verifyAuthentication(ctx.req);
  if (auth.state) {
    try {
        return {props : {user : auth.decodedData.user }};
    }catch(err) {
      console.log(err);
      return {notFound : true};
    }
  }
  return {
    redirect : {
      destination : '/auth'
    }
  }
};





const MyNFTs = ({user}) => {
  const [loading,setLoading] = useState(false);
  const {account,chainId,isWeb3Enabled} = useMoralis();
  const [warrantyContracts,setWarrantyContracts] = useState([]);
  const [message,setMessage] = useState('');

  useEffect(()=>{
    if (isWeb3Enabled) {
      setMessage(`Showing NFTs for the account ${account}`);
    }
    else {
      setMessage(`Please Connect your Wallet to Continue`);
    }
  }, [isWeb3Enabled]);


  useEffect(()=>{
    const run = async()=>{
    if (isWeb3Enabled) {
      setLoading(true);
      try {
        const result = await fetchSellerWarrantyAddresses(account);
        setWarrantyContracts(result.data.warrantyContracts);
      }catch(err) {
        console.log(err);
      }finally {
        setLoading(false);
      }
    }
  }

  run();
  }, [isWeb3Enabled])

  // const {runContractFunction : getCustomersTokens} = useWeb3Contract({
  //   abi : WarrantyABI,
  //   contractAddress : 
  // });
  return (
    <AccountLayout>
      <div className='p-5'>
      <div className='text-2xl font-semibold'>My NFTs</div>
      <p className='text-gray-600 mt-1 text-sm'>{message}</p>
      </div>
      {loading?  <Loading
    size={40}
    spinnerColor="#2E7DAF"
  />:warrantyContracts.length===0?<div>No NFT's were found with this wallet</div>:<div className=' grid mt-5 p-5 grid-cols-3'>
      {warrantyContracts.map(w=><NFTCard key={w} data={w}/>)}  
      </div>}


    </AccountLayout>
  )
}

export default MyNFTs