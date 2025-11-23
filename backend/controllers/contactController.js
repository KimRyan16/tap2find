import transporter from "../services/emailService.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address" });
    }

    const to = "perjescykean35@gmail.com";
    const mailOptions = {
      from: `Tap2Find Contact <perjescykean35@gmail.com>`,
      to,
      subject: `[CONTACT] ${subject}`,
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;color:#111827;">
          <h2 style="margin:0 0 8px;">New Contact Message</h2>
          <p style="margin:0 0 16px;color:#374151;">You received a new message from the Tap2Find contact form.</p>
          <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p style="white-space:pre-wrap;"><strong>Message:</strong><br/>${String(message).replace(/\n/g,'<br/>')}</p>
          </div>
          <p style="margin-top:16px;font-size:12px;color:#6b7280;">This email was sent automatically by Tap2Find.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("❌ Contact send error:", error);
    return res.status(500).json({ success: false, message: "Failed to send message" });
  }
};
