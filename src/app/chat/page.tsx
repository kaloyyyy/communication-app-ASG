'use client';
import {useEffect, useState} from 'react';
import {useSession} from 'next-auth/react';

export default function Chat() {
   const {data: session} = useSession();
   const [receiver, setReceiver] = useState('');
   const [message, setMessage] = useState('');
   const [messages, setMessages] = useState([]);
   const [conversationSid, setConversationSid] = useState('');
   const [file, setFile] = useState<File | null>(null);

   // Create or get conversation between two users
   const createConversation = async () => {
      const res = await fetch('/api/chat/create', {
         method: 'POST',
         headers: {'Content-Type': 'application/json'},
         body: JSON.stringify({
            sender: session?.user?.name,
            receiver,
         }),
      });

      const data = await res.json();
      if (data.success) {
         setConversationSid(data.conversationSid);
         fetchMessages(data.conversationSid);
      } else {
         alert('Error creating conversation: ' + data.error);
      }
   };

   // Fetch messages from the conversation
   const fetchMessages = async (conversationSid: string) => {
      const res = await fetch(`/api/chat/history?conversationSid=${conversationSid}`);
      const data = await res.json();
      setMessages(data.messages);
      console.log(data.messages)
   };

   // Send a message with or without a file
   const sendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log("file", file)
      if (file) {
         const formData = new FormData();
         formData.append('file', file);
         console.log("upload to public")

         formData.append('convoSid', conversationSid)
         const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            // No need to add headers, Fetch will automatically set the correct Content-Type.
         });

         if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            const fileUrl = uploadData.url;
            const mediaSid = uploadData.mediaSid;
            const media = uploadData
            // Now send the message with the uploaded file URL
            const res = await fetch('/api/chat/send', {
               method: 'POST',
               headers: {'Content-Type': 'application/json'},
               body: JSON.stringify({
                  conversationSid,
                  sender: session?.user?.name,
                  message,
                  fileUrl,
                  mediaSid,
                  media// Pass the file URL to Twilio Conversations API
               }),
            });
            const sentMess = await res.json()
            console.log("artartasasrasrtasrtasrtartarstartarstsr res",sentMess.chatSid)
            formData.append("chatSid",sentMess.chatSid)
            try {
               const resP = await fetch('/api/publicUpload', {
                  method: 'POST',
                  body: formData,
               });
               const data = await resP.json();
               if (resP.ok) {
                  setMessage(`File uploaded to uploads successfully: ${data.filePath}`);
               } else {
                  setMessage(`Error: ${data.error}`);
               }
            } catch (error) {
               setMessage('Upload failed');
            }

            if (res.ok) {
               setMessage('');
               setFile(null);
               fetchMessages(conversationSid);
            }

         } else {
            alert('Error uploading file');
         }
      } else {
         // Handle message without a file
         console.log("NO FILEcvzxczxzxcvxcv")
         const res = await fetch('/api/chat/send', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
               conversationSid,
               sender: session?.user?.name,
               message,
            }),
         });

         if (res.ok) {
            setMessage('');
            fetchMessages(conversationSid);
         }
      }
   };

   useEffect(() => {
      if (receiver && session) {
         createConversation();
      }
   }, [receiver, session]);

   return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
         <div className="bg-white shadow-md rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 p-4 text-center border-b">Twilio Chat App</h1>
            {session ? (
               <>
                  <div className="flex items-center p-4 border-b">
                     <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Chat with (user1, user2, user3)"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                     />
                  </div>

                  <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
                     <ul className="space-y-4">
                        {messages.map((msg, index) => (
                           <li
                              key={index}
                              className={`flex ${
                                 msg.author === session?.user?.name ? 'justify-end' : 'justify-start'
                              }`}
                           >
                              <div
                                 className={`p-3 rounded-lg max-w-xs ${
                                    msg.author === session?.user?.name
                                       ? 'bg-blue-500 text-white'
                                       : 'bg-gray-200 text-gray-900'
                                 }`}
                              >
                                 <strong>{msg.author === session?.user?.name ? 'You' : msg.author}:</strong>
                                 <p>{msg.body}</p>
                                 {msg.files[0] && (
                                    <div className="mt-2">
                                       {msg.files[0].contentType.startsWith('haha') ? (
                                          <img src={msg.files[0].url} alt={msg.files[0].filename} className="max-w-xs"/>
                                       ) : (
                                          <a
                                             href={msg.files[0].url}
                                             download
                                             className="text-blue-200 hover:underline"
                                          >
                                             {msg.files[0].filename}
                                          </a>
                                       )}
                                    </div>
                                 )}
                              </div>
                           </li>
                        ))}
                     </ul>
                  </div>

                  <form
                     onSubmit={sendMessage}
                     className="flex items-center gap-2 p-4 border-t"
                  >
                     <input
                        type="text"
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message"
                        required
                     />
                     <input
                        type="file"
                        className="p-2 border border-gray-300 rounded-lg"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                     />
                     <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
                     >
                        Send
                     </button>
                  </form>
               </>
            ) : (
               <p className="text-center text-gray-600 p-6">Please sign in to chat.</p>
            )}
         </div>
      </div>
   );
}
