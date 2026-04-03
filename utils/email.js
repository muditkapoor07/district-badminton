const nodemailer = require("nodemailer");

let transporter = null;

if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

async function sendBookingConfirmation(toEmail, toName, { courtName, slotTime, date }) {
  if (!transporter) return; // silently skip if email not configured

  const formattedDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  await transporter.sendMail({
    from: `"District Badminton" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Booking Confirmed – ${courtName} on ${formattedDate}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;background:#0f172a;border-radius:12px;overflow:hidden;">
        <div style="background:#0891b2;padding:24px 28px;">
          <h1 style="color:#fff;margin:0;font-size:1.4rem;">🏸 Booking Confirmed!</h1>
        </div>
        <div style="padding:28px;color:#f1f5f9;">
          <p style="margin:0 0 20px;">Hi <strong>${toName}</strong>, your court is booked!</p>
          <div style="background:#1e293b;border-radius:8px;padding:18px 20px;margin-bottom:20px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="color:#94a3b8;padding:5px 0;width:90px;">Court</td><td style="color:#f1f5f9;font-weight:600;">${courtName}</td></tr>
              <tr><td style="color:#94a3b8;padding:5px 0;">Date</td><td style="color:#f1f5f9;font-weight:600;">${formattedDate}</td></tr>
              <tr><td style="color:#94a3b8;padding:5px 0;">Time</td><td style="color:#f1f5f9;font-weight:600;">${slotTime}</td></tr>
            </table>
          </div>
          <p style="color:#94a3b8;font-size:0.85rem;margin:0;">See you on the court! · District Badminton</p>
        </div>
      </div>`,
  });
}

module.exports = { sendBookingConfirmation };
