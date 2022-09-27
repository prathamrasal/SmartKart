import React, { useEffect, useState } from 'react'
import { useWeb3Contract } from 'react-moralis';
import WarrantyABI from '../constants/WarrantyNFTABI.json'
import {Skeleton } from 'web3uikit'
import axios from 'axios'
import Image from 'next/image';
const NFTCard = ({data})=>{
    const [loading,setLoading] = useState(false);
    const [nftURI,setNftURI] = useState('');
    const [tokenData,setTokenData] = useState({});
    const {runContractFunction: fetchNFTURI} = useWeb3Contract({
      abi : WarrantyABI,
      functionName : "tokenURI",
      contractAddress : data.warrantyContract,
      params : {
        tokenId : data.tokenId
      }
    })
    useEffect(()=>{
      const handleSuccess = async(e)=>{
        setNftURI(e);
        try {
        const result = await axios.get(`https://ipfs.io/${e.replace("ipfs://","ipfs/")}`, {timeout : '5000'});
        setTokenData(result.data);
        setLoading(false);
        }catch(err) {
          console.log(err);
        }
      }
      const runFunction = async()=>{
      setLoading(true);
      const tokenURI = await fetchNFTURI({
        onSuccess : handleSuccess,
        onError : (e)=>console.log(e)
      })
    }
    runFunction();
    }, [])


    return (
      <div className='w-[350px] p-1 rounded-md min-h-[200px] border-[1px] solid border-gray-400'>
               {loading&&<><Skeleton theme="image" />
                <Skeleton theme="text" />
                <Skeleton theme="subtitle" width="30%" /></> }
                {!loading&&<div>
                  <div className='w-full relative h-[200px]'>
                    <Image src={tokenData.image} layout='fill' objectFit='cover'/>
                  </div>
                  <div className='mt-2 p-1'>
                    <div className='font-semibold'>{tokenData.name} <span className='font-normal'>(#{data?.orderId})</span> </div>
                    <div className='text-sm text-gray-600'><span className='font-semibold text-gray-600'>Token Id: </span> {data.tokenId}</div>
                  </div>
                  </div>}
      </div>
    )
  }



export default NFTCard