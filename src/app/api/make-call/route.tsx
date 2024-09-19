// app/api/make-call/route.js

import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(request) {
   const { to } = await request.json();

   const accountSid = process.env.TWILIO_ACCOUNT_SID;
   const authToken = process.env.TWILIO_AUTH_TOKEN;
   const from = process.env.TWILIO_PHONE_NUMBER;
   const client = twilio(accountSid, authToken);

   try {
      const call = await client.calls.create({
         url: 'http://demo.twilio.com/docs/voice.xml', // URL to TwiML instructions
         to: to,
         from: from,
      });

      return NextResponse.json({
         success: true,
         message: 'Call initiated!',
         callSid: call.sid,
      });
   } catch (error) {
      return NextResponse.json({
         success: false,
         message: 'Failed to make call',
         error: error.message,
      });
   }
}
