'use client'
import Image from "next/image";
import axios from 'axios';
import { questService } from "@/api/HandleGet";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { config } from "@/config";
import { getChainId, signMessage } from "wagmi/actions";


export default function Home() {
  const [mes,setMes] =useState<any>();
  const [nonce,setNonce] =useState<any>();
  const [res, setRes] = useState<any>(null); 
  const account = useAccount();

  const [address,setAddress] =useState<any>(account?.address?.toString());
  if(account?.address?.toString() && account?.address?.toString()!=address) setAddress(account?.address?.toString());

  console.log("adress",address);
  const chain_id = getChainId(config);
  
  const{data,signMessageAsync} = useSignMessage();
  const getSignature = async () => {
    try {
      const res:any = await questService.getQuest();
      if (res) {
        console.log(res);
        setMes(res.sign_msg);
        setNonce(res.nonce);
        signMessageAsync({message:res.sign_msg });
      }
      else 
          console.log('Can not get signature');
    }
    catch (error) {
      console.log('Can not get signature');
    }
  }
  const postSignIn = async (as:
    {signature:String,nonce:Number,public_address:String,chain_id:Number}) => {
      try {
        const res:any = await questService.postQuest({signature:data,nonce:nonce,public_address:address,chain_id:chain_id});
        setRes(res);
        if (res) {
          console.log(res);
        }
        else 
            console.log('Can not post sign_in');
      }
      catch (error) {
        console.log('Can not post sign_in (error)');
      }
  }
  console.log("Day la data",data);
  useEffect(() => {
    if(address) getSignature();
  },[address]);
  useEffect(() => {
    if(data) postSignIn({signature:data.toString(),nonce:nonce,public_address:address.toString(),chain_id:chain_id})
  },[data]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-slate-950 rounded-3xl mb-10">
        <w3m-button />
      </div>
      <div className="flex lfex-row text-xl font-bold mb-10"> Message: &nbsp;
        <div className="font-[400]">{mes} </div>
      </div>
      <div className="flex lfex-row text-xl font-bold mb-10">Nonce: &nbsp;
      <div className="font-[400]">{nonce} </div>
      </div>
          {res && (
      <div className="w-120 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Response Data</h2>
        <div className="bg-gray-100 rounded-lg p-6 shadow-md">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">signature:</span>
            <span className="break-all">{res.signature}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">public_address:</span>
            <span className="break-all">{res.public_address}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">device_id:</span>
            <span className="break-all">{res.device_id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">xrip:</span>
            <span className="break-all">{res.xrip}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">nonce:</span>
            <span className="break-all">{res.nonce}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">access_token:</span>
            <span className="break-all">{res.access_token}</span>
          </div>
        </div>
      </div>
    )}
    </main>
  );
}
