import { NextResponse } from 'next/server';
import fetch from 'node-fetch'; // Ensure node-fetch is installed
import FormData from 'form-data'; // Ensure form-data is installed

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID;

export async function POST(req: Request) {
   console.log("upload api")
   try {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      const chat_sid = formData.get('chatSid')
      if (!file) {
         return NextResponse.json({ success: false, message: 'No file uploaded' });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Prepare the media file for Twilio Media Service
      const form = new FormData();
      form.append('file', buffer, {
         filename: file.name,
         contentType: file.type,
      });

      // Send the media to Twilio's Media Content Service (MCS)
      const response = await fetch(
         `https://mcs.us1.twilio.com/v1/Services/${serviceSid}/Media`,
         {
            method: 'POST',
            headers: {
               Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
            },
            body: form,
         }
      );

      const result = await response.json();

      if (!response.ok) {
         throw new Error(`Twilio Media upload failed: ${result.message}`);
      }
      const mediaSid = result.sid
      const mediaUrl = result.links.content; // The uploaded media URL
      console.log(result)

      const reqRes = await fetch(
         `https://mcs.us1.twilio.com/v1/Services/${serviceSid}/Media/${mediaSid}`,
         {
            method: 'GET',
            headers: {
               Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
            }
         }
      )
      console.log("reqres", reqRes)
      return NextResponse.json({
         success: true,
         url: mediaUrl,
         mediaResult: result
      });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ success: false, error: error.message });
   }
}
