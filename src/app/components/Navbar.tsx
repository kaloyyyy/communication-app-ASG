// app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import SignInButton from '@/app/components/SignInButton';
import SignOutButton from '@/app/components/SignOutButton';

const Navbar =  () => {
   const {data: session} = useSession();

   return (
      <nav className="bg-gray-800 p-4">
         <ul className="flex space-x-6">
            <li>
               <Link href="/" className="text-white hover:text-gray-300">
                  Home
               </Link>
            </li>
            <li>
               <Link href="/chat" className="text-white hover:text-gray-300">
                  Chat
               </Link>
            </li>
            <li>
               <Link href="/call" className="text-white hover:text-gray-300">
                  Call
               </Link>
            </li>
            <li>
               <Link href="/email" className="text-white hover:text-gray-300">
                  Email
               </Link>
            </li>
            <li>
               <Link href="/sms" className="text-white hover:text-gray-300">
                  SMS
               </Link>
            </li>
            <li>
               {session ? <SignOutButton/> : <SignInButton/>}
            </li>
         </ul>
      </nav>
   );
};

export default Navbar;
