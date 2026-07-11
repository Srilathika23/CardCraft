const nodemailer = require('nodemailer');

/**
 * @desc    Send digital business card / email signature via email
 * @route   POST /api/auth/email-card
 * @access  Public
 */
const emailCard = async (req, res) => {
  try {
    const {
      recipientEmail,
      senderName,
      senderTitle = '',
      senderCompany = '',
      senderPhone = '',
      senderEmail = '',
      senderWebsite = '',
      cardId = '',
      socialLinks = {},
      message = ''
    } = req.body;

    if (!recipientEmail || !senderName) {
      return res.status(400).json({ message: 'Recipient email and sender name are required.' });
    }

    // Build social links HTML if provided
    let socialLinksHtml = '';
    if (socialLinks.linkedin) {
      socialLinksHtml += `<a href="${socialLinks.linkedin}" style="display:inline-block; margin-right:8px; color:#C9A84C; text-decoration:none; font-weight:600; font-size:13px;">LinkedIn</a>`;
    }
    if (socialLinks.twitter) {
      socialLinksHtml += `<a href="${socialLinks.twitter}" style="display:inline-block; margin-right:8px; color:#C9A84C; text-decoration:none; font-weight:600; font-size:13px;">X</a>`;
    }
    if (socialLinks.github) {
      socialLinksHtml += `<a href="${socialLinks.github}" style="display:inline-block; color:#C9A84C; text-decoration:none; font-weight:600; font-size:13px;">GitHub</a>`;
    }

    // Rendered HTML Email Signature representing the Burgundy-Ivory palette
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Digital Business Card - ${senderName}</title>
      </head>
      <body style="margin:0; padding:0; background-color:#FAF7F2; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#1C1410;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; margin:20px auto; background-color:#FAF7F2; border-collapse:collapse;">
          <!-- Header/Intro -->
          <tr>
            <td style="padding:40px 30px 20px 30px; text-align:center;">
              <span style="background-color:#E2D9D0; color:#6B1A2A; font-size:12px; font-weight:bold; letter-spacing:2px; text-transform:uppercase; padding:6px 16px; border-radius:50px; display:inline-block; margin-bottom:16px; font-family:sans-serif;">SoftRate Digital Card</span>
              <h2 style="margin:0; color:#6B1A2A; font-size:24px; font-weight:700; line-height:1.3;">Hello, ${senderName} has sent you a connection request.</h2>
            </td>
          </tr>

          <!-- Message (If any) -->
          ${message ? `
          <tr>
            <td style="padding:0 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F2EDE6; border-left:4px solid #6B1A2A; border-radius:4px; border-collapse:collapse;">
                <tr>
                  <td style="padding:20px; font-style:italic; color:#7A6860; font-size:15px; line-height:1.6;">
                    "${message}"
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ` : ''}

          <!-- The Signature Canvas -->
          <tr>
            <td style="padding:0 30px 40px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; border:1px solid #E2D9D0; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(28,20,16,0.04); border-collapse:collapse;">
                
                <!-- Main Header Signature Panel (Burgundy Background) -->
                <tr>
                  <td style="background-color:#6B1A2A; padding:24px 30px; color:#FAF7F2;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                      <tr>
                        <td>
                          <h3 style="margin:0; font-size:20px; font-weight:700; color:#FAF7F2; letter-spacing:0.5px;">${senderName}</h3>
                          ${senderTitle ? `<div style="font-size:14px; color:#B85C6E; margin-top:4px; font-weight:500;">${senderTitle}</div>` : ''}
                          ${senderCompany ? `<div style="font-size:13px; color:#FAF7F2; opacity:0.8; margin-top:2px;">${senderCompany}</div>` : ''}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Details Panel (White/Paper Background) -->
                <tr>
                  <td style="padding:30px; background-color:#ffffff;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
                      
                      <!-- Contact Rows -->
                      ${senderPhone ? `
                      <tr>
                        <td style="padding-bottom:12px; font-size:14px; color:#1C1410;">
                          <strong style="color:#7A6860; width:60px; display:inline-block;">Phone:</strong>
                          <a href="tel:${senderPhone}" style="color:#6B1A2A; text-decoration:none; font-weight:500;">${senderPhone}</a>
                        </td>
                      </tr>
                      ` : ''}

                      ${senderEmail ? `
                      <tr>
                        <td style="padding-bottom:12px; font-size:14px; color:#1C1410;">
                          <strong style="color:#7A6860; width:60px; display:inline-block;">Email:</strong>
                          <a href="mailto:${senderEmail}" style="color:#6B1A2A; text-decoration:none; font-weight:500;">${senderEmail}</a>
                        </td>
                      </tr>
                      ` : ''}

                      ${senderWebsite ? `
                      <tr>
                        <td style="padding-bottom:12px; font-size:14px; color:#1C1410;">
                          <strong style="color:#7A6860; width:60px; display:inline-block;">Website:</strong>
                          <a href="${senderWebsite.startsWith('http') ? senderWebsite : 'https://' + senderWebsite}" target="_blank" style="color:#6B1A2A; text-decoration:none; font-weight:500;">${senderWebsite}</a>
                        </td>
                      </tr>
                      ` : ''}

                      <!-- Social Links -->
                      ${socialLinksHtml ? `
                      <tr>
                        <td style="padding:12px 0 16px 0; border-top:1px solid #E2D9D0; margin-top:12px;">
                          ${socialLinksHtml}
                        </td>
                      </tr>
                      ` : ''}

                      <!-- Card QR Link/Button -->
                      <tr>
                        <td style="padding-top:20px; text-align:center;">
                          <a href="http://localhost:3000/cards/${cardId || 'preview'}" target="_blank" style="background-color:#C9A84C; color:#1C1410; font-size:14px; font-weight:bold; text-decoration:none; padding:12px 24px; border-radius:8px; display:inline-block; letter-spacing:0.5px; box-shadow:0 2px 6px rgba(201,168,76,0.25);">
                            View Full Business Card
                          </a>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer/Brand -->
          <tr>
            <td style="padding:0 30px 40px 30px; text-align:center; font-size:12px; color:#7A6860; border-top:1px solid #E2D9D0; padding-top:20px;">
              Sent via <a href="http://localhost:3000" style="color:#6B1A2A; text-decoration:none; font-weight:600;">SoftRate</a>. Create your own premium digital business card.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    let transporter;
    let etherealUrl = null;

    // Check if custom SMTP is defined in env (port, host, user, pass)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      await transporter.sendMail({
        from: `"${senderName} via SoftRate" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        subject: `${senderName} shared a digital business card with you`,
        html: emailHtml,
      });

      console.log(`Email successfully sent using SMTP to ${recipientEmail}`);
    } else {
      // Create a test account on ethereal.email dynamically
      console.log("Custom SMTP not configured. Creating Ethereal Test Account...");
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"${senderName} via SoftRate" <no-reply@softrate.com>`,
        to: recipientEmail,
        subject: `${senderName} shared a digital business card with you`,
        html: emailHtml,
      });

      etherealUrl = nodemailer.getTestMessageUrl(info);
      console.log(`Email sent to Ethereal sandbox: ${etherealUrl}`);
    }

    res.status(200).json({
      success: true,
      message: 'Email successfully sent!',
      previewUrl: etherealUrl, // Returns ethereal link to front-end for verification
    });

  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({
      message: 'Failed to send card email.',
      error: error.message
    });
  }
};

module.exports = {
  emailCard,
};
