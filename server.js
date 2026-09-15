require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from this directory
app.use(express.static(__dirname));

// Utility to create a nodemailer transporter
function getTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return null;
    }
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

// Utility to escape HTML characters
function escapeHtml(text) {
    if (!text) return '';
    return text
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 1. Client Inquiry / Paid Trial Endpoint
app.post('/api/client-inquiry', async (req, res) => {
    try {
        const { name, email, company, video_link, projectType, volume, message, details } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, error: 'Name and Email are required fields.' });
        }

        const projectDetails = message || details || 'N/A';
        const subject = `New Paid Trial Request from ${name} — Dhia Studio`;
        
        // Plain text fallback
        const bodyText = 
`=========================================
DHIA STUDIO — NEW CLIENT INQUIRY / PAID TRIAL
=========================================

CLIENT DETAILS:
- Name: ${name}
- Email: ${email}
- Channel / Company: ${company || 'N/A'}
- Recent Video Link: ${video_link || 'N/A'}

PROJECT REQUIREMENTS:
- Type of Editing Needed: ${projectType || 'N/A'}
- Approximate Monthly Volume: ${volume || 'N/A'}

PROJECT BRIEF / MESSAGE:
"${projectDetails}"

=========================================
ACTION REQUIRED: Review the content link, assess editing direction, and respond with a paid trial offer within 24 hours.`;

        // Premium HTML styling matching the dark luxury brand theme of Dhia Studio
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeCompany = escapeHtml(company || 'N/A');
        const safeVideoLink = escapeHtml(video_link || 'N/A');
        const safeProjectType = escapeHtml(projectType || 'N/A');
        const safeVolume = escapeHtml(volume || 'N/A');
        const safeDetails = escapeHtml(projectDetails).replace(/\n/g, '<br>');

        const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dhia Studio - Inbound Project Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #050507; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #a1a1aa; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050507; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #0c0c12; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f0f18 0%, #161624 100%); padding: 35px 40px; border-bottom: 2px solid #8B5CF6;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: bold; color: #06B6D4; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;">Dhia Studio</div>
                    <h1 style="margin: 0; font-size: 22px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px;">New Paid Trial Inquiry</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 35px 40px;">
              
              <!-- Section: Client Info -->
              <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #8B5CF6; letter-spacing: 1.5px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; margin-top: 0; margin-bottom: 16px;">Client Information</h2>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa; width: 35%;"><strong>Name</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #ffffff;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;"><strong>Email</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #06B6D4;"><a href="mailto:${safeEmail}" style="color: #06B6D4; text-decoration: none;">${safeEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;"><strong>Channel / Brand</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #ffffff;">${safeCompany}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;"><strong>Content Link</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #8B5CF6;"><a href="${safeVideoLink}" target="_blank" style="color: #8B5CF6; text-decoration: underline;">${safeVideoLink}</a></td>
                </tr>
              </table>

              <!-- Section: Scope -->
              <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #8B5CF6; letter-spacing: 1.5px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; margin-top: 0; margin-bottom: 16px;">Editing Requirements</h2>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px; background-color: #12121c; border-radius: 10px; padding: 15px;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa; width: 35%;"><strong>Editing Needed</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #ffffff; font-weight: 600;">${safeProjectType}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #a1a1aa;"><strong>Monthly Volume</strong></td>
                  <td style="padding: 6px 0; font-size: 14px; color: #06B6D4; font-weight: bold;">${safeVolume}</td>
                </tr>
              </table>

              <!-- Section: Details -->
              <h2 style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #8B5CF6; letter-spacing: 1.5px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; margin-top: 0; margin-bottom: 16px;">Message & Goals</h2>
              <div style="background-color: rgba(255, 255, 255, 0.02); border-left: 3px solid #06B6D4; border-radius: 4px; padding: 15px; margin-bottom: 25px; line-height: 1.6; color: #d4d4d8; font-size: 14px;">
                ${safeDetails}
              </div>

              <!-- Action Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.25); border-radius: 10px; padding: 15px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: bold; color: #8B5CF6; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">Action Required</div>
                    <p style="margin: 0; font-size: 13px; color: #e4e4e7; line-height: 1.5;">Review the content link, determine editing direction, and respond directly from <strong style="color: #06B6D4;">dhia@dhiaeddine.studio</strong> within 24 hours.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #08080d; padding: 20px; font-size: 12px; color: #71717a; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              Dhia Studio — Founder-led video editing by Dhia Eddine.<br>
              <a href="https://dhiaeddine.studio" style="color: #a1a1aa; text-decoration: none;">dhiaeddine.studio</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

        const transporter = getTransporter();
        const recipient = process.env.RECIPIENT_EMAIL || 'dhia@dhiaeddine.studio';
        const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;

        if (transporter) {
            await transporter.sendMail({
                from: `Dhia Studio Inbound <${process.env.SMTP_USER}>`,
                to: recipient,
                replyTo: email,
                subject: subject,
                text: bodyText,
                html: bodyHtml
            });
            console.log(`[Email Sent] Inquiry from ${name} (<${email}>) successfully sent to ${recipient}`);
            return res.json({ success: true, mode: 'live' });
        } else if (web3formsKey) {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: web3formsKey,
                    subject: subject,
                    from_name: 'Dhia Studio Portfolio',
                    'Client Name': name,
                    'Client Email': email,
                    'Channel / Company': company || 'N/A',
                    'Link to Content': video_link || 'N/A',
                    'Editing Needed': projectType || 'N/A',
                    'Monthly Volume': volume || 'N/A',
                    'Message Details': projectDetails
                })
            });
            const result = await response.json();
            if (result.success) {
                console.log(`[Web3Forms Forwarded] Inquiry from ${name} successfully forwarded.`);
                return res.json({ success: true, mode: 'live' });
            } else {
                throw new Error(result.message || 'Web3Forms submission failed');
            }
        } else {
            console.log('\n=========================================');
            console.log('🚨 SIMULATION MODE: SMTP credentials not set in .env');
            console.log('Client Inquiry Details:');
            console.log(bodyText);
            console.log('=========================================\n');
            return res.json({ 
                success: true, 
                mode: 'simulation', 
                message: 'Form received successfully! (Simulation Mode: SMTP/Web3Forms credentials not configured in .env)' 
            });
        }
    } catch (error) {
        console.error('Error handling client inquiry:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// Fallback to serve index.html for undefined requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start listening
app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`🎬 DHIA STUDIO server running at http://localhost:${PORT}`);
    console.log(`👉 Open http://localhost:${PORT} in your browser.`);
    console.log(`=========================================\n`);
});
