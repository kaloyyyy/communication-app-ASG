'use client';

import { useState } from 'react';
import { Device } from '@twilio/voice-sdk';

export default function Dialer() {
   const [toNumber, setToNumber] = useState('');
   const [device, setDevice] = useState(null);
   const [loading, setLoading] = useState(false);
   const [callStatus, setCallStatus] = useState('');

   // Fetch a Twilio access token from your API
   const getTwilioToken = async () => {
      const response = await fetch('/api/token');
      const data = await response.json();
      return data.token;
   };

   const setupDevice = async () => {
      if (!device) {
         const token = await getTwilioToken();
         const newDevice = new Device(token);
         newDevice.on('ready', () => setCallStatus('Device ready to make calls'));
         newDevice.on('error', (error) => setCallStatus(`Error: ${error.message}`));
         setDevice(newDevice);
      }
   };

   const handleCall = async (e) => {
      e.preventDefault();
      setLoading(true);
      await setupDevice();

      if (device) {
         const connection = device.connect({ params: { To: toNumber } });
         connection.on('accept', () => setCallStatus('Call in progress...'));
         connection.on('disconnect', () => setCallStatus('Call ended.'));
      }

      setLoading(false);
   };

   return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
         <h1 className="text-2xl font-bold mb-6">Web Dialer</h1>

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

         {callStatus && (
            <p className="mt-4 text-green-500">{callStatus}</p>
         )}
      </div>
   );
}
