'use client'
import Link from "next/link";
import { questService } from "@/api/HandleGet";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useConnect, useDisconnect, useSignMessage, useSwitchChain } from "wagmi";
import { config } from "@/config";
import { getChainId, getChains, signMessage } from "wagmi/actions";
import { formatAddress } from "@/utils/formatAddress";
import { getBalance } from "@wagmi/core";
import { type GetBalanceParameters } from '@wagmi/core'
import { injected } from '@wagmi/connectors';

export default function Home() {
  const [mes,setMes] =useState<any>();
  const [nonce,setNonce] =useState<any>();
  const [res, setRes] = useState<any>(null); 
  const account = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const {chains,switchChain} = useSwitchChain();
  console.log('chain',chains);

  const [address,setAddress] =useState<any>(account?.address?.toString());
  if(account?.address?.toString() && account?.address?.toString()!=address) setAddress(account?.address?.toString());

  console.log("adress",address);
  const chain_id = getChainId(config);
  const chain_name = getChains(config);
  const { data:balance, isError, isLoading } = useBalance({
    address: address,
  })
  if(balance) console.log("balance",balance['value']);
  const { status, data, signMessageAsync } = useSignMessage({
    mutation: {
      onError: () => {disconnect();window.location.reload();},
    }
  });
  const getSignature = async () => {
    try {
      const res:any = await questService.getQuest();
      if (res) {
        console.log('>>> check', res);
        setMes(res.sign_msg);
        setNonce(res.nonce);
        await signMessageAsync({message:res.sign_msg });
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
        else {
          console.log('Can not post sign_in');
        }
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
    <div className=" h-screen overflow-auto">
      <div className="flex flex-col items-center justify-between p-24 space-y-10">
        <div className="w-full">
          <Link href="/page2" className="py-2 px-4 bg-slate-950 rounded-xl w-fit text-white font-bold">Go to page 2 </Link>
        </div>
        {/* <div className="bg-slate-950 rounded-3xl mb-10">
          <w3m-button />
        </div> */}
        <div className="w-full">
          {address&&balance&&
          <div className="flex flex-row space-x-4">
            <button className="py-3 px-6 rounded-2xl bg-slate-950 w-fit text-white flex flex-row">
              {balance&&<div className="font-bold">{(Math.round(Number(BigInt(balance['value']))*100)/10**20).toFixed(2)} &nbsp; {balance['symbol']} &nbsp;</div>} | &nbsp; <div className="text-slate-300">{formatAddress(address)}</div>
            </button>
            <button className="py-3 px-6 rounded-2xl bg-slate-900 opacity-70 w-fit text-white flex flex-row"
            onClick={() => {
              disconnect();
              window.location.reload();
            }}>
              Disconnect Wallet
            </button>
          </div>}
          {!address&&
            <button className="py-3 px-6 rounded-2xl bg-slate-950 w-fit text-white flex flex-row"
            onClick={()=>connect({connector:injected()})}>
              Connect Wallet
            </button>}
        </div>
        <div className="w-full flex flex-col space-y-4">
          <div className="text-xl font-bold">
            Switch chain to
          </div>
          <div className="flex flex-row space-x-10">
            {chains.map((chain) => (
              <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })}
              className={`px-6 py-4 rounded-xl ${chain.id==chain_id?"bg-slate-400 text-black opacity-80":"bg-slate-900 hover:scale-105 hover:bg-slate-700"} text-white shadow-xl `}>
                {chain.name}
              </button>
            ))}
          </div>
        </div>

        {address&&(
        <div className="text-xl font-bold w-full flex flex-col space-y-4"> 
          <div>
            Sign Message
          </div>
          <div className="w-full !bg-gray-100 rounded-lg p-6 shadow-md flex flex-col space-y-4">
            <div className="flex flex-row text-xl font-bold"> message: &nbsp;
              <div className="font-[400]">{mes} </div>
            </div>
            <div className="flex flex-row text-xl font-bold">nonce: &nbsp;
              <div className="font-[400]">{nonce} </div>
            </div>
          </div>
        </div>)}

        {res && (
        <div className="w-120 flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold w-full">Response Data</h2>
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
            <div className="flex justify-between mb-2 space-x-6">
              <span className="font-semibold">access_token:</span>
              <span className="break-all">{res.access_token}</span>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
