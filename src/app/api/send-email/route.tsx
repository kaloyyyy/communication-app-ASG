import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
sgMail.setApiKey('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')

export async function POST(req) {
   const formData = await req.formData();
   const to = formData.get('to');
   const subject = formData.get('subject');
   const text = formData.get('text');
   const file = formData.get('file');

   let attachments = [];
   if (file) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
         content: fileBuffer.toString('base64'),
         filename: file.name,
         type: file.type,
         disposition: 'attachment',
      });
   }
   console.log("to", to)
   const msg = {
      to: to, // Change to your recipient
      from: 'austriapjc@gmail.com', // Change to your verified sender
      replyTo: 'austriapjc@gmail.com',
      subject: subject,
      text: text,
      html: text,
      attachments,
   };
   console.log('Form Data:', { to, subject, text });
   console.log('Attachment:', file);

   try {
      await sgMail.send(msg);
      return NextResponse.json({ message: 'Email sent successfully!' });
   } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
