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
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

// Utility to escape HTML characters to prevent email styling breakage/injection
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

// 1. Client Inquiry Endpoint
app.post('/api/client-inquiry', async (req, res) => {
    try {
        const { name, email, company, budget, projectType, timeline, details } = req.body;

        if (!name || !email) {
            return res.status(400).json({ success: false, error: 'Name and Email are required fields.' });
        }

        const subject = `New High-Ticket Client Project Brief Received: ${name}`;
        
        // Plain text fallback
        const bodyText = 
`=========================================
DHIA STUDIO — INBOUND BUSINESS LEAD
=========================================

CLIENT INFORMATION:
- Prospect Name: ${name}
- Corporate Email: ${email}
- Brand/Company: ${company || 'N/A'}

PROJECT PARAMETERS:
- Requested Capabilities: ${projectType || 'N/A'}
- Allocated Capital/Budget: ${budget || 'N/A'}
- Required Timeframe/Deadline: ${timeline || 'N/A'}

STRATEGIC INTAKE SUMMARY:
"${details || 'N/A'}"

=========================================
ACTION REQUIRED: Evaluate project parameters, verify portfolio availability, and generate a customized contract response within 24 business hours.`;

        // Premium HTML styling matching the dark luxury brand theme of Dhia Studio
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeCompany = escapeHtml(company || 'N/A');
        const safeProjectType = escapeHtml(projectType || 'N/A');
        const safeBudget = escapeHtml(budget || 'N/A');
        const safeTimeline = escapeHtml(timeline || 'N/A');
        const safeDetails = escapeHtml(details || 'N/A').replace(/\n/g, '<br>');

        const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dhia Studio - Inbound Business Lead</title>
</head>
<body style="margin: 0; padding: 0; background-color: #031427; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #cbc3d7; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #031427; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #102034; border: 1px solid rgba(208, 188, 255, 0.15); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.4);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b1c30 0%, #102034 100%); padding: 35px 40px; border-bottom: 2px solid #a078ff;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: bold; color: #4cd7f6; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Dhia Studio</div>
                    <h1 style="margin: 0; font-size: 24px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px;">New Inbound Business Lead</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Section: Client Info -->
              <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #d0bcff; letter-spacing: 1.5px; border-bottom: 1px solid rgba(208, 188, 255, 0.1); padding-bottom: 8px; margin-top: 0; margin-bottom: 20px;">Client Information</h2>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7; width: 35%;"><strong>Name</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #ffffff;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7;"><strong>Email</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #4cd7f6;"><a href="mailto:${safeEmail}" style="color: #4cd7f6; text-decoration: none;">${safeEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7;"><strong>Brand / Company</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #ffffff;">${safeCompany}</td>
                </tr>
              </table>

              <!-- Section: Project Parameters -->
              <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #d0bcff; letter-spacing: 1.5px; border-bottom: 1px solid rgba(208, 188, 255, 0.1); padding-bottom: 8px; margin-top: 0; margin-bottom: 20px;">Project Parameters</h2>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; background-color: #0b1c30; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7; width: 35%;"><strong>Capabilities</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #ffffff; font-weight: 600;">${safeProjectType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7;"><strong>Estimated Budget</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #4cd7f6; font-weight: bold;">${safeBudget}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7;"><strong>Timeline</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #ffffff;">${safeTimeline}</td>
                </tr>
              </table>

              <!-- Section: Strategic Summary -->
              <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #d0bcff; letter-spacing: 1.5px; border-bottom: 1px solid rgba(208, 188, 255, 0.1); padding-bottom: 8px; margin-top: 0; margin-bottom: 20px;">Strategic Intake Summary</h2>
              <div style="background-color: rgba(16, 32, 52, 0.6); border-left: 4px solid #4cd7f6; border-radius: 4px; padding: 20px; margin-bottom: 30px; font-style: italic; line-height: 1.6; color: #d3e4fe; font-size: 15px;">
                "${safeDetails}"
              </div>

              <!-- Action Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #3f465c 0%, #102034 100%); border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: bold; color: #ffb4ab; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Action Required</div>
                    <p style="margin: 0; font-size: 13px; color: #d3e4fe; line-height: 1.5;">Evaluate project parameters, verify portfolio availability, and generate a customized contract response within 24 business hours.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0b1c30; padding: 25px; font-size: 12px; color: #5c6c84; border-top: 1px solid rgba(208, 188, 255, 0.05);">
              © 2024 Dhia Studio. Cinematic Production Excellence.<br>
              This is an automated inbound lead notification.
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
        const recipient = process.env.RECIPIENT_EMAIL || 'dhiastudio.agency@gmail.com';
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
            console.log(`[Email Sent] Client Inquiry from ${name} (<${email}>) successfully sent to ${recipient}`);
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
                    from_name: 'Dhia Studio Website',
                    'Client Name': name,
                    'Client Email': email,
                    'Brand / Company': company || 'N/A',
                    'Requested Capabilities': projectType || 'N/A',
                    'Allocated Budget': budget || 'N/A',
                    'Required Timeline': timeline || 'N/A',
                    'Strategic Brief Details': details || 'N/A'
                })
            });
            const result = await response.json();
            if (result.success) {
                console.log(`[Web3Forms Forwarded] Client Inquiry from ${name} successfully sent to dhiastudio.agency@gmail.com`);
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

// 2. Editor Application Endpoint
app.post('/api/editor-application', async (req, res) => {
    try {
        const { name, email, portfolio, role, software, about } = req.body;

        if (!name || !email || !portfolio) {
            return res.status(400).json({ success: false, error: 'Name, Email, and Portfolio are required fields.' });
        }

        const subject = `New Roster Application: ${name} — ${role}`;
        
        // Plain text fallback
        const bodyText = 
`=========================================
DHIA STUDIO — TALENT ACQUISITION FUNNEL
=========================================

APPLICANT PROFILE:
- Talent Name: ${name}
- Contact Email: ${email}
- Designated Core Competency: ${role || 'N/A'}

TECHNICAL STACK & MASTERY:
- Confirmed Software Mastery: ${software || 'N/A'}

CREATIVE EVIDENCE:
- Secure Portfolio Link: ${portfolio}

ABOUT THE APPLICANT:
"${about || 'N/A'}"

=========================================
ACTION REQUIRED: Review the portfolio hyperlink, verify software proficiencies match active project queues, and tag the applicant inside the master agency production roster if approved.`;

        // Premium HTML styling matching the dark luxury brand theme of Dhia Studio
        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeRole = escapeHtml(role || 'N/A');
        const safeSoftware = escapeHtml(software || 'N/A');
        const safePortfolio = escapeHtml(portfolio);
        const safeAbout = escapeHtml(about || 'N/A').replace(/\n/g, '<br>');

        const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dhia Studio - Talent Acquisition Funnel</title>
</head>
<body style="margin: 0; padding: 0; background-color: #031427; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #cbc3d7; -webkit-font-smoothing: antialiased;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #031427; padding: 40px 20px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #102034; border: 1px solid rgba(208, 188, 255, 0.15); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 40px rgba(0,0,0,0.4);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0b1c30 0%, #102034 100%); padding: 35px 40px; border-bottom: 2px solid #4cd7f6;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: bold; color: #d0bcff; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Dhia Studio</div>
                    <h1 style="margin: 0; font-size: 24px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px;">New Talent Roster Application</h1>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px;">
              
              <!-- Section: Applicant Profile -->
              <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4cd7f6; letter-spacing: 1.5px; border-bottom: 1px solid rgba(208, 188, 255, 0.1); padding-bottom: 8px; margin-top: 0; margin-bottom: 20px;">Applicant Profile</h2>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7; width: 35%;"><strong>Talent Name</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #ffffff;">${safeName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7;"><strong>Contact Email</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #4cd7f6;"><a href="mailto:${safeEmail}" style="color: #4cd7f6; text-decoration: none;">${safeEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7;"><strong>Creative Role</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #d0bcff; font-weight: 600;">${safeRole}</td>
                </tr>
              </table>

              <!-- Section: Technical Stack -->
              <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4cd7f6; letter-spacing: 1.5px; border-bottom: 1px solid rgba(208, 188, 255, 0.1); padding-bottom: 8px; margin-top: 0; margin-bottom: 20px;">Technical Stack & Mastery</h2>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px; background-color: #0b1c30; border-radius: 12px; padding: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-size: 15px; color: #cbc3d7; width: 35%;"><strong>Software</strong></td>
                  <td style="padding: 8px 0; font-size: 15px; color: #ffffff;">${safeSoftware}</td>
                </tr>
              </table>

              <!-- Section: Creative Evidence -->
              <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4cd7f6; letter-spacing: 1.5px; border-bottom: 1px solid rgba(208, 188, 255, 0.1); padding-bottom: 8px; margin-top: 0; margin-bottom: 20px;">Creative Evidence</h2>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td>
                    <p style="margin: 0 0 15px 0; font-size: 14px; color: #cbc3d7; line-height: 1.5;">Click below to view the secure talent portfolio and recent editing work:</p>
                    <a href="${safePortfolio}" target="_blank" style="display: inline-block; background-color: #4cd7f6; color: #001f26; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 8px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(76, 215, 246, 0.25);">View Portfolio Link</a>
                  </td>
                </tr>
              </table>

              <!-- Section: About -->
              <h2 style="font-size: 14px; font-weight: bold; text-transform: uppercase; color: #4cd7f6; letter-spacing: 1.5px; border-bottom: 1px solid rgba(208, 188, 255, 0.1); padding-bottom: 8px; margin-top: 0; margin-bottom: 20px;">About the Applicant</h2>
              <div style="background-color: rgba(16, 32, 52, 0.6); border-left: 4px solid #d0bcff; border-radius: 4px; padding: 20px; margin-bottom: 30px; font-style: italic; line-height: 1.6; color: #d3e4fe; font-size: 15px;">
                "${safeAbout}"
              </div>

              <!-- Action Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background: linear-gradient(135deg, #3f465c 0%, #102034 100%); border-radius: 12px; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-weight: bold; color: #ffb4ab; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">Action Required</div>
                    <p style="margin: 0; font-size: 13px; color: #d3e4fe; line-height: 1.5;">Review the portfolio hyperlink, verify software proficiencies match active project queues, and tag the applicant inside the master agency production roster if approved.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #0b1c30; padding: 25px; font-size: 12px; color: #5c6c84; border-top: 1px solid rgba(208, 188, 255, 0.05);">
              © 2024 Dhia Studio. Talent Acquisition & Creative Direction.<br>
              This is an automated application notification.
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
        const recipient = process.env.RECIPIENT_EMAIL || 'dhiastudio.agency@gmail.com';
        const web3formsKey = process.env.WEB3FORMS_ACCESS_KEY;

        if (transporter) {
            await transporter.sendMail({
                from: `Dhia Studio Talent <${process.env.SMTP_USER}>`,
                to: recipient,
                replyTo: email,
                subject: subject,
                text: bodyText,
                html: bodyHtml
            });
            console.log(`[Email Sent] Editor Application from ${name} (<${email}>) successfully sent to ${recipient}`);
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
                    from_name: 'Dhia Studio Website',
                    'Talent Name': name,
                    'Talent Email': email,
                    'Creative Role': role || 'N/A',
                    'Software Mastery': software || 'N/A',
                    'Portfolio URL': portfolio,
                    'About the Applicant': about || 'N/A'
                })
            });
            const result = await response.json();
            if (result.success) {
                console.log(`[Web3Forms Forwarded] Editor Application from ${name} successfully sent to dhiastudio.agency@gmail.com`);
                return res.json({ success: true, mode: 'live' });
            } else {
                throw new Error(result.message || 'Web3Forms submission failed');
            }
        } else {
            console.log('\n=========================================');
            console.log('🚨 SIMULATION MODE: SMTP credentials not set in .env');
            console.log('Editor Application Details:');
            console.log(bodyText);
            console.log('=========================================\n');
            return res.json({ 
                success: true, 
                mode: 'simulation', 
                message: 'Application received successfully! (Simulation Mode: SMTP/Web3Forms credentials not configured in .env)' 
            });
        }
    } catch (error) {
        console.error('Error handling editor application:', error);
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
    console.log(`👉 Open http://localhost:${PORT} in your browser to test.`);
    console.log(`=========================================\n`);
});
