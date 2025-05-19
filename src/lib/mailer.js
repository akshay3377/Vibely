import nodemailer from "nodemailer";

export const sendEmailNotification = async ({ to, from , subject, text, html }) => {

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  };

  try {
    const response = await transport.sendMail(mailOptions);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
