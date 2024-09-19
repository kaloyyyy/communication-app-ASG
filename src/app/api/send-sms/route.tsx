// app/api/send-sms/route.js

import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request: { json: () => PromiseLike<{ to: any; messageBody: any; }> | { to: any; messageBody: any; }; }) {
   const { to, messageBody } = await request.json();

   // Use environment variables for credentials
   const accountSid = process.env.TWILIO_ACCOUNT_SID;
   const authToken = process.env.TWILIO_AUTH_TOKEN;
   const client = twilio(accountSid, authToken);
   console.log(process.env.TWILIO_PHONE_NUMBER);
   try {
      // Send the message using Twilio API
      const message = await client.messages.create({
         body: messageBody,  // Use the message body from the request
         from: '+19513327251',  // Ensure you have this set in your environment variables
         to: to,
      });

      return NextResponse.json({
         success: true,
         message: 'Message sent!',
         sid: message.sid,
      });
   } catch (error:any) {
      return NextResponse.json({
         success: false,
         message: 'Failed to send message',
         error: error.message,
      });
   }
}
