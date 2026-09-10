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
    throw new Error("SMTP environment variables are incomplete.");
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
    subject: `New WebService Enquiry — ${enquiry.websiteType}`,
    text: [
      "New Website Enquiry",
      "",
      `Name: ${enquiry.name}`,
      `Email: ${enquiry.email}`,
      `Phone: ${enquiry.phone}`,
      `Website type: ${enquiry.websiteType}`,
      `Budget: ${enquiry.budget}`,
      "",
      "Project requirements:",
      enquiry.requirements,
      "",
      `Submitted at: ${new Date().toISOString()}`,
    ].join("\n"),
  });
}
