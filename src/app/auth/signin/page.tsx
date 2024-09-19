'use client';
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const result = await signIn("credentials", {
         redirect: false,
         username,
         password,
      });

      if (!result?.error) {
         router.push("/");
      } else {
         alert("Login failed");
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
         <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               <input
                  type="text"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
               />
               <input
                  type="password"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
               />
               <button
                  type="submit"
                  className="bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600"
               >
                  Sign In
               </button>
            </form>
         </div>
      </div>
   );
}
