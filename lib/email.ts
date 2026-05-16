import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is missing. Email skipped.");
    return;
  }

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "China Logistics <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}