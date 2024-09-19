import { NextResponse } from 'next/server';
import twilio from 'twilio';

export async function GET(request) {
   const { searchParams } = new URL(request.url);
   const recipient = searchParams.get('recipient');  // Get recipient from query string

   const accountSid = process.env.TWILIO_ACCOUNT_SID;
   const authToken = process.env.TWILIO_AUTH_TOKEN;
   const client = twilio(accountSid, authToken);

   try {
      // Fetch messages both sent to and from the recipient
      const outgoingMessages = await client.messages.list({
         to: recipient,  // Messages sent to the recipient
         limit: 20,
      });

      const incomingMessages = await client.messages.list({
         from: recipient,  // Messages sent from the recipient
         limit: 20,
      });

      // Combine and sort the messages by date
      const allMessages = [...outgoingMessages, ...incomingMessages].sort(
         (a, b) => new Date(a.dateSent) - new Date(b.dateSent)
      );

      return NextResponse.json({
         success: true,
         messages: allMessages.map(msg => ({
            from: msg.from,
            to: msg.to,
            body: msg.body,
            dateSent: msg.dateSent,
         })),
      });
   } catch (error) {
      return NextResponse.json({
         success: false,
         message: 'Failed to retrieve message history',
         error: error.message,
      });
   }
}
