// app/page.tsx
'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
   const { data: session, status } = useSession();
   const router = useRouter();

   useEffect(() => {
      if (status === "unauthenticated") {
         router.push("/auth/signin");
      }
   }, [status, router]);

   if (status === "loading") {
      return <p>Loading...</p>;  // Or a loading spinner if you prefer
   }

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
         <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Protected Page</h1>
            <p className="text-lg">Welcome, <span className="font-bold">{session?.user?.name}</span>!</p>
         </div>
      </div>
   );
}
