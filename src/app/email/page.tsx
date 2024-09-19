'use client';

import { useState } from 'react';

const SendEmailForm = () => {
   const [email, setEmail] = useState('');
   const [subject, setSubject] = useState('');
   const [message, setMessage] = useState('');
   const [attachment, setAttachment] = useState(null);
   const [status, setStatus] = useState('');

   const handleFileChange = (e) => {
      setAttachment(e.target.files[0]);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append('to', email);
      formData.append('subject', subject);
      formData.append('text', message);
      if (attachment) {
         formData.append('file', attachment);
      }

      const response = await fetch('/api/send-email', {
         method: 'POST',
         body: formData,
      });

      const data = await response.json();
      if (response.ok) {
         setStatus('Email sent successfully!');
      } else {
         setStatus(`Error: ${data.error}`);
      }
   };

   return (
      <div className="max-w-md mx-auto mt-10 p-4 border border-gray-300 rounded-lg shadow-md">
         <h2 className="text-2xl font-semibold mb-4">Send Email with Attachment</h2>
         <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700">Recipient Email</label>
               <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
               />
            </div>
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700">Subject</label>
               <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
               />
            </div>
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700">Message</label>
               <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
               />
            </div>
            <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700">Attachment</label>
               <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full"
               />
            </div>
            <button
               type="submit"
               className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
               Send Email
            </button>
         </form>
         {status && <p className="mt-4 text-center text-green-500">{status}</p>}
      </div>
   );
};

export default SendEmailForm;
