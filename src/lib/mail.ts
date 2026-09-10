import nodemailer from "nodemailer";

export async function sendEnquiryNotification(enquiry: {
  name: string;
  email: string;
  phone: string;
  websiteType: string;
  budget: string;
  requirements: string;
}) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const recipient = process.env.NOTIFICATION_EMAIL;

  if (!host || !user || !password || !recipient) {
    console.warn("Email notification skipped: SMTP environment variables are incomplete.");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to: recipient,
    replyTo: enquiry.email,
    subject: `New WebService enquiry from ${enquiry.name}`,
    text: [
      "You received a new website enquiry.",
      "",
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone}`,
      `Website type: ${enquiry.websiteType}`,
      `Budget: ${enquiry.budget}`,
      "",
      "Project requirements:",
      enquiry.requirements,
    ].join("\n"),
  });
}
