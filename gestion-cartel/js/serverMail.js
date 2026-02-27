import nodemailer from "nodemailer";

export async function sendMail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    host: "mailhog",
    port: 1025,
    secure: false,
  });

  return transporter.sendMail({
    from: '"Cártel Coches España" <sistema@cartelcoches.es>',
    to: to,
    subject: subject,
    text: text,
  });
}
