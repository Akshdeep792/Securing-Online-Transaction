require('dotenv').config();
const nodemailer=require('nodemailer');
const fs=require('fs');
const handlebars = require("handlebars");
const path = require("path")
var inlineBase64 = require('nodemailer-plugin-inline-base64');

const readHTMLFile = function(path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function(err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };

  const sendEmail = (img_64 , user_email , amount , account_no , secret_session_token ) => {
    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SENDER_EMAIL,
          pass: process.env.SENDER_PASSWORD
        }
      });
    readHTMLFile(
      __dirname + "/verify-embedded.html",
      function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
          amount: amount,
          account_no : account_no,
          email_session_token : secret_session_token
         };
        var htmlToSend = template(replacements);
        var mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: user_email,
          subject: "Verify your online payment",
          attachments: [
            {   // encoded string as an attachment
              filename: 'transactor_image.jpg',
              content: img_64.split("base64,")[1],
              encoding: 'base64',
              cid: 'imagename'
            }
          ],
          html: htmlToSend
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            callback(error);
          } else {
            console.log("Email Sent : " + info.response);
          }
        });
      }
    );
  };

  module.exports =sendEmail;