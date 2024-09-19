'use client';
import { useState, useEffect } from 'react';

export default function SmsChat() {
   const [to, setTo] = useState('');
   const [messageBody, setMessageBody] = useState('');
   const [status, setStatus] = useState('');
   const [messages, setMessages] = useState([]);

   // Fetch message history from the API
   const fetchMessages = async (recipient: string) => {
      if (!recipient) return;
      setStatus('Fetching messages...');
      const res = await fetch(`/api/message-history?recipient=${recipient}`);
      const data = await res.json();

      if (data.success) {
         setMessages(data.messages);
         setStatus('');
      } else {
         setStatus(`Failed to fetch messages: ${data.error}`);
      }
   };

   // Send SMS via the API
   const sendSms = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();

      const res = await fetch('/api/send-sms', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ to, messageBody }),
      });

      const data = await res.json();
      if (data.success) {
         setStatus('Message sent successfully!');
         setMessageBody('');  // Clear the message input
         fetchMessages(to);  // Refresh the message history after sending
      } else {
         setStatus(`Failed to send message: ${data.error}`);
      }
   };

   // Fetch message history when the "to" field changes
   useEffect(() => {
      if (to) {
         fetchMessages(to);
      }
   }, [to]);

   return (
      <div className="sms-chat-app max-w-lg mx-auto p-4">
         <h1 className="text-center text-xl font-bold mb-4">SMS Chat</h1>

         <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
            {/* Form to send a message */}
            <form onSubmit={sendSms} className="mb-4 flex flex-col">
               <input
                  className="p-2 border rounded mb-2"
                  type="text"
                  placeholder="Recipient phone number"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  required
               />
               <input
                  className="p-2 border rounded mb-2"
                  type="text"
                  placeholder="Your message"
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  required
               />
               <button
                  type="submit"
                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition"
               >
                  Send SMS
               </button>
            </form>

            {status && <p className="text-sm text-gray-600 mb-2">{status}</p>}
         </div>

         {/* Display message history */}
         <div className="message-history bg-white p-4 rounded-md shadow-md h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-2">Message History</h2>
            <ul className="space-y-4">
               {messages.map((msg, index) => (
                  <li
                     key={index}
                     className={`flex ${
                        msg.from === to ? 'justify-end' : 'justify-start'
                     }`}
                  >
                     <div
                        className={`${
                           msg.from === to
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-300 text-black'
                        } p-3 rounded-lg max-w-xs`}
                     >
                        <p>{msg.body}</p>
                        <small className="text-xs block text-right">
                           {new Date(msg.dateSent).toLocaleString()}
                        </small>
                     </div>
                  </li>
               ))}
            </ul>
         </div>
      </div>
   );
}
