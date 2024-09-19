const axios = require('axios');

const username = 'AC93112554b9afa6e773ff4fbe4b6d0684';
const password = '9839ad558b43c863679822337e6e325d';
const url = 'https://mcs.us1.twilio.com/v1/Services';

// Create the base64 encoded string for basic auth
const auth = Buffer.from(`${username}:${password}`).toString('base64');

// Make the GET request
axios.get(url, {
   headers: {
      'Authorization': `Basic ${auth}`
   }
})
   .then(response => {
      console.log('Response data:', response.data);
   })
   .catch(error => {
      console.error('Error occurred:', error);
   });
