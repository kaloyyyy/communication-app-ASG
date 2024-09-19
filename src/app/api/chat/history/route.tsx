import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID;
const client = twilio(accountSid, authToken);

export async function GET(request: Request) {
   const { searchParams } = new URL(request.url);
   const conversationSid = searchParams.get('conversationSid');

   try {
      const messages = await client.conversations.conversations(conversationSid).messages.list();
      return NextResponse.json({ success: true, messages });
   } catch (error) {
      return NextResponse.json({ success: false, error: error.message });
   }
}
