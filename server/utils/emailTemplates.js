export const welcomeEmailTemplate = (name = "there") => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Welcome to Sunset Daydreams!</h2>
    <p>Hi ${name},</p>
    <p>Thanks for creating an account with Sunset Daydreams.</p>
    <p>You can now track your orders, save account details, and shop our latest drops.</p>
    <a 
      href="${process.env.CLIENT_URL}"
      style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px;"
    >
      Start Shopping
    </a>
    <p style="margin-top:24px;">Thanks,<br/>Sunset Daydreams</p>
  </div>
`;

