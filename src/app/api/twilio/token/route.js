// app/api/twilio/token/route.js

import { NextResponse } from 'next/server';
import twilio from 'twilio';

const AccessToken = twilio.jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

export async function POST(request) {
   try {
      const { username } = await request.json();

      if (!username) {
         console.error('Username is missing in the request body');
         return NextResponse.json({ error: 'Username is required' }, { status: 400 });
      }

      console.log('Generating token for username:', username);

      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioApiKey = process.env.TWILIO_API_KEY;
      const twilioApiSecret = process.env.TWILIO_API_SECRET;
      const serviceSid = process.env.TWILIO_SERVICE_SID;

      if (!twilioAccountSid || !twilioApiKey || !twilioApiSecret || !serviceSid) {
         console.error('Missing Twilio environment variables');
         return NextResponse.json({ error: 'Missing Twilio credentials' }, { status: 500 });
      }

      const token = new AccessToken(twilioAccountSid, twilioApiKey, twilioApiSecret);
      token.identity = username;

      const chatGrant = new ChatGrant({
         serviceSid,
      });
      token.addGrant(chatGrant);

      const jwtToken = token.toJwt();
      console.log('Generated JWT Token:', jwtToken);

      return NextResponse.json({ token: jwtToken });
   } catch (error) {
      console.error('Error generating token:', error);
      return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
   }
}
