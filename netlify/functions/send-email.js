/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Netlify Function handler for secure server-side email dispatch
exports.handler = async function (event, context) {
  // Only allow POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed. Must be a POST request.' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      type,
      data,
      customerSubject,
      customerHtml,
      adminSubject,
      adminHtml,
      adminEmail
    } = body;

    const senderEmail = process.env.SENDER_EMAIL || 'concierge@limelightrestaurant.com';
    const senderName = process.env.SENDER_NAME || 'Limelight Lounge';

    console.log(`[Email Dispatcher] Triggered for type: "${type}". Recipients: Customer (${data.email}), Admin (${adminEmail})`);

    // 1. INTEGRATION: RESEND API
    if (process.env.RESEND_API_KEY) {
      console.log('[Email Dispatcher] Resend API Key detected. Initializing Resend REST request...');
      
      const dispatchResend = async (to, subject, html) => {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: `${senderName} <${senderEmail}>`,
            to: [to],
            subject: subject,
            html: html
          })
        });
        return response.ok;
      };

      let customerSent = false;
      let adminSent = false;
      if (data.email) {
        customerSent = await dispatchResend(data.email, customerSubject, customerHtml);
      }
      if (adminEmail) {
        adminSent = await dispatchResend(adminEmail, adminSubject, adminHtml);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          method: 'resend',
          results: { customerSent, adminSent }
        })
      };
    }

    // 2. INTEGRATION: SENDGRID API
    if (process.env.SENDGRID_API_KEY) {
      console.log('[Email Dispatcher] SendGrid API Key detected. Initializing SendGrid REST request...');
      
      const dispatchSendGrid = async (to, subject, html) => {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            personalizations: [{ to: [{ email: to }] }],
            from: { email: senderEmail, name: senderName },
            subject: subject,
            content: [{ type: 'text/html', value: html }]
          })
        });
        return response.ok;
      };

      let customerSent = false;
      let adminSent = false;
      if (data.email) {
        customerSent = await dispatchSendGrid(data.email, customerSubject, customerHtml);
      }
      if (adminEmail) {
        adminSent = await dispatchSendGrid(adminEmail, adminSubject, adminHtml);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          method: 'sendgrid',
          results: { customerSent, adminSent }
        })
      };
    }

    // 3. INTEGRATION: BREVO (SENDINBLUE) API
    if (process.env.BREVO_API_KEY) {
      console.log('[Email Dispatcher] Brevo API Key detected. Initializing Brevo REST request...');

      const dispatchBrevo = async (to, subject, html) => {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
          method: 'POST',
          headers: {
            'api-key': process.env.BREVO_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: to }],
            subject: subject,
            htmlContent: html
          })
        });
        return response.ok;
      };

      let customerSent = false;
      let adminSent = false;
      if (data.email) {
        customerSent = await dispatchBrevo(data.email, customerSubject, customerHtml);
      }
      if (adminEmail) {
        adminSent = await dispatchBrevo(adminEmail, adminSubject, adminHtml);
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          method: 'brevo',
          results: { customerSent, adminSent }
        })
      };
    }

    // Fallback: Simulation
    console.log('[Email Dispatcher Simulation] No production keys configured in environment variables.');
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        method: 'simulation',
        message: 'Email dispatch simulated successfully. Please configure RESEND_API_KEY, SENDGRID_API_KEY, or BREVO_API_KEY in Netlify settings for real email delivery.',
        results: { customerSent: true, adminSent: true }
      })
    };

  } catch (error) {
    console.error('[Email Dispatcher Error] Failed to process email request:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error. Failed to send emails.', details: error.message }),
    };
  }
};
