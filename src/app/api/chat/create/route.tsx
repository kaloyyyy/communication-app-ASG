import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID;
const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
   const { sender, receiver } = await request.json();

   try {
      // Check if the conversation exists
      const conversations = await client.conversations.conversations.list();
      let conversation = conversations.find(conv => conv.uniqueName === `${sender}-${receiver}` || conv.uniqueName === `${receiver}-${sender}`);

      if (!conversation) {
         // Create a new conversation if one doesn't exist
         conversation = await client.conversations.conversations.create({
            uniqueName: `${sender}-${receiver}`,
            friendlyName: `Chat between ${sender} and ${receiver}`,
         });

         // Add participants
         await client.conversations.conversations(conversation.sid).participants.create({ identity: sender });
         await client.conversations.conversations(conversation.sid).participants.create({ identity: receiver });
      }

      return NextResponse.json({ success: true, conversationSid: conversation.sid });
   } catch (error) {
      return NextResponse.json({ success: false, error: error.message });
   }
}
