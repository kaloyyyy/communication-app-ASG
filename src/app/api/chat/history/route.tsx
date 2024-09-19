import { NextResponse } from 'next/server';
import twilio from 'twilio';
import sqlite3 from 'better-sqlite3';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID;
const client = twilio(accountSid, authToken);

// Connect to SQLite database
const db = sqlite3('db/identifier.sqlite');

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const conversationSid = searchParams.get('conversationSid');

   try {
      // Fetch messages from Twilio
      const messages = await client.conversations.conversations(conversationSid).messages.list();
      console.log('Fetched messages from Twilio:', messages);

      // Function to fetch file details from SQLite DB for a message SID
      const fetchFileDetails = (messageSid: string) => {
         const fileStmt = db.prepare('SELECT file_name, file_url FROM files WHERE chat_sid = ?');
         const result = fileStmt.all(messageSid);  // Use .all() to get all results
         console.log(`Fetched file details for message SID ${messageSid}:`, result);
         return result;
      };

      // Process messages to include file details if present
      const messagesWithFiles = messages.map(msg => {
         const files = fetchFileDetails(msg.sid) || [];  // Default to empty array if undefined
         console.log(`Files for message SID ${msg.sid}:`, files);

         return {
            author: msg.author,
            body: msg.body,
            dateSent: msg.dateSent,
            files: Array.isArray(files) ? files.map(file => ({
               url: file.file_url,
               filename: file.file_name,
               contentType: "haha"
            })) : [],  // Ensure media is always an array
         };
      });
      console.log(NextResponse.json({
         success: true,
         messages: messagesWithFiles,
      }))
      return NextResponse.json({
         success: true,
         messages: messagesWithFiles,
      });
   } catch (error) {
      console.error('Error fetching chat history:', error);  // Enhanced error logging
      return NextResponse.json({
         success: false,
         error: error.message,
      });
   }
}
