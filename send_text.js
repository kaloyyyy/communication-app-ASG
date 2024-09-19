const sgMail = require('@sendgrid/mail')
console.log(process.env.SENDGRID_API_KEY);
sgMail.setApiKey('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')
const msg = {
   to: 'kaloyau16@gmail.com', // Change to your recipient
   from: 'austriapjc@gmail.com', // Change to your verified sender
   subject: 'Sending with SendGrid is Fun',
   text: 'and easy to do anywhere, even with Node.js',
   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
   .send(msg)
   .then(() => {
      console.log('Email sent')
   })
   .catch((error) => {
      console.error(error)
   })