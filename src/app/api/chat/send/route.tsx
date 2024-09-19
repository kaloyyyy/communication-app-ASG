import { NextResponse } from 'next/server';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioApiUrl = `https://conversations.twilio.com/v1/Conversations`;

export async function POST(request) {
   const { conversationSid, sender, message, mediaSid,media } = await request.json();

   const messageData = {
      Author: sender,
      Body: message,
   };
   await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
   if (media) {
      console.log("send api media", media);
      console.log("send api mediassss", media.mediaResult.sid);

      messageData.MediaSid = media.mediaResult.sid
   }
   console.log(messageData)
   try {
      const response = await fetch(`${ twilioApiUrl}/${conversationSid}/Messages`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
         },
         body: new URLSearchParams(messageData).toString(),
      });

      if (!response.ok) {
         const errorBody = await response.text();
         throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      const sentMessage = await response.json();
      console.log('Sent message:', sentMessage);
      console.log('Sent rss:', response);
      return NextResponse.json({ success: true, msg: sentMessage });
   } catch (error) {
      console.error('Error while sending message:', error);
      return NextResponse.json({ success: false, error: error.message });
   }
}

