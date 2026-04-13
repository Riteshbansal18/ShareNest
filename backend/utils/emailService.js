const https = require('https');

const sendOTPEmail = async (email, otp, fullName, isReset = false) => {
  const subject = isReset ? 'Reset your ShareNest password' : 'Verify your ShareNest account';
  const heading = isReset ? `Hi ${fullName}, reset your password` : `Hi ${fullName} 👋`;
  const subtext = isReset
    ? 'Use the OTP below to reset your password. It expires in 10 minutes.'
    : 'Use the OTP below to verify your email address. It expires in 10 minutes.';
  const otpLabel = isReset ? 'Password Reset OTP' : 'Your OTP';

  const data = JSON.stringify({
    sender: { name: 'ShareNest', email: 'sonu192089@gmail.com' },
    to: [{ email }],
    subject,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1e40af; font-size: 28px; margin: 0;">ShareNest</h1>
          <p style="color: #64748b; margin: 4px 0 0;">Find your perfect home</p>
        </div>
        <div style="background: white; border-radius: 12px; padding: 32px;">
          <h2 style="color: #0f172a; margin: 0 0 8px;">${heading}</h2>
          <p style="color: #475569; margin: 0 0 24px;">${subtext}</p>
          <div style="background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="color: #64748b; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 2px;">${otpLabel}</p>
            <p style="color: #1e40af; font-size: 40px; font-weight: 900; letter-spacing: 12px; margin: 0;">${otp}</p>
          </div>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">If you didn't request this, ignore this email.</p>
        </div>
      </div>
    `
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          reject(new Error(`Brevo API error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

module.exports = { sendOTPEmail };
