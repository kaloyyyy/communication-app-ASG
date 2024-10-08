// app/dialer/page.js
'use client';

import { useState } from 'react';

export default function Dialer() {
   const [toNumber, setToNumber] = useState('');
   const [loading, setLoading] = useState(false);
   const [callSid, setCallSid] = useState(null);
   const [error, setError] = useState(null);

   const handleCall = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      try {
         const response = await fetch('/api/call', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               from: '+19513327251', // The Twilio number you're using
               to: toNumber,
            }),
         });

         const data = await response.json();

         if (data.success) {
            setCallSid(data.callSid);
            setError(null);
         } else {
            setError(data.error);
         }
      } catch (err) {
         setError('Failed to make the call. Please try again.');
      }

      setLoading(false);
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
         <h1 className="text-2xl font-bold mb-6">Dialer</h1>

         <form onSubmit={handleCall} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
               Phone Number
            </label>
            <input
               type="text"
               id="phone"
               value={toNumber}
               onChange={(e) => setToNumber(e.target.value)}
               className="w-full p-2 border border-gray-300 rounded mb-4"
               placeholder="+639XXXXXXXXX"
               required
            />
            <button
               type="submit"
               className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600"
               disabled={loading}
            >
               {loading ? 'Calling...' : 'Call'}
            </button>
         </form>

         {callSid && (
            <p className="mt-4 text-green-500">Call initiated! SID: {callSid}</p>
         )}

         {error && (
            <p className="mt-4 text-red-500">Error: {error}</p>
         )}
      </div>
   );
}
