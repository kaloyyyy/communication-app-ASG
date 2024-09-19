import { NextResponse } from 'next/server';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

export async function GET() {
   const AccessToken = twilio.jwt.AccessToken;
   const VoiceGrant = AccessToken.VoiceGrant;

   // Twilio API keys
   const apiKeySid = 'SK91f14fc91cd3c071be985cf91a705543';
   const apiKeySecret = 'DFxQR3euKSENrNTt8kGG9pMKkjYfcVYK';
   const outgoingApplicationSid = 'APb2553a923eab50b81a3be81bddaa92cd'; // Create a TwiML App in Twilio

   // Create an access token
   const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, { ttl: 3600 });

   // Create a Voice grant
   const voiceGrant = new VoiceGrant({
      outgoingApplicationSid,
   });

   // Attach the grant to the token
   token.addGrant(voiceGrant);
   token.identity = 'user'; // Set this dynamically for your users

   return NextResponse.json({ token: token.toJwt() });
}
