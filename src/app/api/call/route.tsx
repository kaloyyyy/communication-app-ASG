// app/api/create-call/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID; // Store in .env.local
const authToken = process.env.TWILIO_AUTH_TOKEN; // Store in .env.local
const client = twilio(accountSid, authToken);

export async function POST(request) {
   try {
      const { to } = await request.json();
      const from = "+19513327251";
      const call = await client.calls.create({
         from,
         to,
         url: 'http://demo.twilio.com/docs/voice.xml', // You can replace this with your own TwiML URL
      });

      return NextResponse.json({ success: true, callSid: call.sid });
   } catch (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
   }
}
