// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = 'AC93112554b9afa6e773ff4fbe4b6d0684';
const authToken = '9839ad558b43c863679822337e6e325d';
const client = twilio(accountSid, authToken);

async function createCall() {
   const call = await client.calls.create({
      from: "+19513327251",
      to: "+639152486588",
      url: "http://demo.twilio.com/docs/voice.xml",
   });

   console.log(call.sid);
}

createCall();