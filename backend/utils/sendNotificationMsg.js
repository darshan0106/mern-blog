const nodemailer = require("nodemailer");

const sendNotificatiomMsg = async (to, postId) => {
  try {
    //1. Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    //create the message
    const message = {
      to,
      subject: "New Post Created",
      html: ` <p>A new post has been created on our site dailyblog</p>
      <p>Click <a href="https://mern-blog-livid-sigma.vercel.app/posts/${postId}">here</a> to view the post.</p>
      `,
    };
    //send the email
    const info = await transporter.sendMail(message);
    return info;
  } catch (error) {
    throw new Error("Email sending failed");
  }
};

module.exports = sendNotificatiomMsg;
