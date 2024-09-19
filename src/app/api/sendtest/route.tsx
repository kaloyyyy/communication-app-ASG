import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID;
const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
   const { conversationSid, sender, message, fileUrl } = await request.json();

   try {
      const file = await fetch("https://v.fastcdn.co/u/ed1a9b17/52533501-0-logo.svg");
      const fileBlob = await file.blob();

// Prepare the media message options
      const sendMediaOptions = {
         contentType: file.headers.get("Content-Type"), // Extract content type from the response
         filename: "twilio-logo.svg", // The name of the file to be sent
         media: fileBlob // The file itself as a Blob
      };

// Send the message with media attached
      await client.conversation
         .prepareMessage() // Prepare the message
         .setBody(message) // Optionally, set the message body
         .addMedia(sendMediaOptions) // Add the media options
         .build() // Finalize the message construction
         .send(); // Send the message

      return NextResponse.json({ success: true, msg: messageData, url: false, fileUrl });
   } catch (error) {
      return NextResponse.json({ success: false, error: error.message });
   }
}
