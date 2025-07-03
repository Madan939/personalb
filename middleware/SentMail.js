const nodemailer=require('nodemailer');
const sentMail=(option)=>{
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 587,
        auth: {
          user:"3f31552c98e847",
          pass: "43e3606444ae74"
        }
      });
      const mailOption={
        from:option.from,
        to:option.to,
        subject:option.subject,
        html:option.html
      };
      transport.sendMail(mailOption, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}
module.exports=sentMail;