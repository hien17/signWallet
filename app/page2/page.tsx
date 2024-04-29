import Link from 'next/link';
import React from 'react'

async function getPosts() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const posts = await res.json()
  return posts;
}
 
export default async function page2 () {
  const recentPosts = await getPosts();
  return (
    <div className='h-screen w-full overflow-auto '>
      <div className='flex flex-col justify-between p-24 space-y-10'>
        <Link href="/" className='py-2 px-4 bg-slate-950 rounded-xl w-fit text-white font-bold'> Return homepage </Link>
        <div className='text-4xl '>
          Page 2
        </div>
        <div className='text-xl'>
            Get data from <a className='text-blue-500 font-bold' href='https://api.github.com/repos/vercel/next.js' target="_blank"> https://api.github.com/repos/vercel/next.js </a> by fetch() of next.js
        </div>
        {recentPosts&&(
          <div className='flex flex-col space-y-4'>
            <div className='text-xl'>
                Owner:
            </div>
            <div className='w-fit block break-all'>
              {JSON.stringify(recentPosts['owner'])}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
