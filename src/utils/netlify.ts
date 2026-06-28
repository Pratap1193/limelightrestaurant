/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContactSettings } from '../types/database';

/**
 * Submits form data to Netlify Forms via standard URL-encoded AJAX.
 */
export async function submitToNetlify(formName: string, data: Record<string, any>) {
  try {
    const encodedData = Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');

    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `form-name=${encodeURIComponent(formName)}&${encodedData}`,
    });

    if (response.ok) {
      console.log(`[Netlify Forms] Successfully submitted "${formName}" to Netlify.`);
    } else {
      console.warn(`[Netlify Forms] Received status ${response.status} when submitting "${formName}".`);
    }
  } catch (error) {
    console.error(`[Netlify Forms] Error submitting "${formName}":`, error);
  }
}

/**
 * Triggers a click-to-chat WhatsApp link with a pre-filled, highly polished message.
 */
export function triggerWhatsAppMessage(
  type: 'reservation' | 'contact' | 'newsletter' | 'event-booking',
  data: Record<string, any>,
  contactSettings: ContactSettings
) {
  const adminWhatsAppNumber = contactSettings.whatsapp.replace(/[^0-9]/g, '');
  let message = '';

  if (type === 'reservation') {
    message = `✨ *NEW SPOTLIGHT RESERVATION* ✨\n\n` +
              `• *Guest Name:* ${data.name}\n` +
              `• *Mobile:* ${data.mobile}\n` +
              `• *Email:* ${data.email}\n` +
              `• *Guests:* ${data.guests} Pax\n` +
              `• *Date:* ${data.date}\n` +
              `• *Time:* ${data.time}\n` +
              `• *Occasion:* ${data.occasion}\n` +
              `• *Special Request:* ${data.request || 'None'}\n\n` +
              `Please confirm this slot in the Admin Panel or reply to confirm!`;
  } else if (type === 'contact') {
    message = `✉️ *NEW CONTACT INQUIRY* ✉️\n\n` +
              `• *From:* ${data.name}\n` +
              `• *Email:* ${data.email}\n` +
              `• *Mobile:* ${data.mobile}\n` +
              `• *Subject:* ${data.subject}\n` +
              `• *Message:* ${data.message}\n\n` +
              `Inquiry submitted via Limelight website contact portal.`;
  } else if (type === 'newsletter') {
    message = `📧 *NEW NEWSLETTER SUBSCRIBER* 📧\n\n` +
              `• *Email:* ${data.email}\n\n` +
              `Welcome this patron to the Limelight VIP database!`;
  } else if (type === 'event-booking') {
    message = `🎉 *EVENT BOOKING REGISTERED* 🎉\n\n` +
              `• *Event:* ${data.eventName}\n` +
              `• *Guest Name:* ${data.name}\n` +
              `• *Email:* ${data.email}\n` +
              `• *Mobile:* ${data.mobile}\n` +
              `• *Guests:* ${data.guests} Pax\n` +
              `• *Date:* ${data.date}\n\n` +
              `Please coordinate and secure VIP seating arrangements.`;
  }

  const encodedMsg = encodeURIComponent(message);
  const waUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodedMsg}`;
  
  // Open WhatsApp in a new tab safely
  window.open(waUrl, '_blank');
}

/**
 * Custom event emitter to display the mock email client UI.
 * This ensures the user can visually inspect the custom email templates immediately!
 */
export function displayMockEmailOverlay(emailType: string, recipient: string, subject: string, htmlContent: string) {
  const event = new CustomEvent('show-email-preview', {
    detail: { emailType, recipient, subject, htmlContent }
  });
  window.dispatchEvent(event);
}

/**
 * Triggers the automatic production-ready email workflow.
 * Sends data to Netlify serverless function or displays a custom local email overlay.
 */
export async function sendFormEmail(
  type: 'reservation' | 'contact' | 'newsletter' | 'event-booking',
  data: Record<string, any>,
  contactSettings: ContactSettings
) {
  // Generate beautiful custom responsive HTML email templates
  let customerSubject = '';
  let customerHtml = '';
  let adminSubject = '';
  let adminHtml = '';
  const adminEmail = contactSettings.email || 'manager@limelightrestaurant.com';

  const brandColor = '#FF1493'; // Deep pink accent
  const baseEmailStyle = `
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #222222;
    background-color: #fcfcfc;
    margin: 0;
    padding: 20px;
    line-height: 1.6;
  `;

  if (type === 'reservation') {
    customerSubject = `✨ Reservation Spotlight Secured - ${data.name}`;
    customerHtml = `
      <div style="${baseEmailStyle}">
        <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e1e1e1; background: white; border-top: 5px solid ${brandColor};">
          <div style="padding: 40px 30px; text-align: center; background-color: #050505; color: white;">
            <h1 style="margin: 0; font-size: 26px; letter-spacing: 3px; font-weight: 900; color: ${brandColor};">LIMELIGHT</h1>
            <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; tracking-widest: 2px; color: #888;">Luxury Dining & Cocktail Lounge</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Dear ${data.name},</p>
            <p>Your table reservation request has been registered in our scheduling system. Our hosting team is validating availability for your requested slot.</p>
            
            <div style="background-color: #fafafa; border: 1px solid #eee; padding: 25px; margin: 30px 0; border-left: 4px solid ${brandColor};">
              <h3 style="margin-top: 0; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; color: ${brandColor};">Reservation Particulars</h3>
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #666; width: 40%;">Guest Name:</td><td style="padding: 6px 0; font-weight: bold;">${data.name}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Mobile Number:</td><td style="padding: 6px 0; font-weight: bold;">${data.mobile}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Requested Date:</td><td style="padding: 6px 0; font-weight: bold; color: ${brandColor};">${data.date}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Time Slot:</td><td style="padding: 6px 0; font-weight: bold;">${data.time}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Guests Count:</td><td style="padding: 6px 0; font-weight: bold;">${data.guests} Guests</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Occasion:</td><td style="padding: 6px 0; font-weight: bold; text-transform: uppercase; font-size: 12px;">${data.occasion}</td></tr>
                <tr><td style="padding: 6px 0; color: #666; vertical-align: top;">Special Requests:</td><td style="padding: 6px 0; font-style: italic; color: #555;">${data.request || 'No special requests.'}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Current Status:</td><td style="padding: 6px 0;"><span style="background-color: #fff3cd; color: #856404; padding: 3px 8px; font-weight: bold; font-size: 11px; text-transform: uppercase; border-radius: 2px;">Pending Confirmation</span></td></tr>
              </table>
            </div>

            <p style="font-size: 13px; color: #666;"><strong>Please Note:</strong> Valet parking is fully complimentary for our reserved dining patrons. We request that you arrive 10 minutes prior to your scheduled time.</p>
            
            <div style="text-align: center; margin-top: 40px; padding-top: 25px; border-t: 1px solid #eee;">
              <p style="font-size: 12px; color: #999; margin-bottom: 5px;">If you need to change your reservation, contact our hotline immediately:</p>
              <a href="tel:${contactSettings.phone}" style="font-size: 16px; font-weight: bold; color: ${brandColor}; text-decoration: none;">${contactSettings.phone}</a>
            </div>
          </div>
          <div style="background-color: #fafafa; padding: 25px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee;">
            <p style="margin: 0 0 10px 0;">Limelight Restaurant, ${contactSettings.address}</p>
            <p style="margin: 0;">This email is automatically dispatched by Limelight Advanced Booking Engine.</p>
          </div>
        </div>
      </div>
    `;

    adminSubject = `⚠️ ACTION REQUIRED: New Reservation Pending - ${data.name}`;
    adminHtml = `
      <div style="${baseEmailStyle}">
        <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e1e1e1; background: white; border-top: 5px solid #ff1493;">
          <div style="padding: 30px; background-color: #ff1493; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">NEW TABLE REQUEST</h1>
            <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.9;">A guest is waiting for reservation approval</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 15px;">An incoming booking request has been locked. Please review the guest's details and approve/reject the slot inside your Admin Panel.</p>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin: 25px 0; background-color: #fafafa; border: 1px solid #eee; padding: 15px;">
              <tr style="border-b: 1px solid #eee;"><td style="padding: 10px; font-weight: bold; color: #666;">Guest:</td><td style="padding: 10px; font-weight: bold;">${data.name}</td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 10px; color: #666;">Contact:</td><td style="padding: 10px;"><a href="tel:${data.mobile}">${data.mobile}</a> | <a href="mailto:${data.email}">${data.email}</a></td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 10px; color: #666;">Date:</td><td style="padding: 10px; font-weight: bold; color: #ff1493;">${data.date}</td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 10px; color: #666;">Time Slot:</td><td style="padding: 10px; font-weight: bold;">${data.time}</td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 10px; color: #666;">Guests:</td><td style="padding: 10px; font-weight: bold;">${data.guests} pax</td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 10px; color: #666;">Occasion:</td><td style="padding: 10px; text-transform: uppercase; font-size: 11px; font-weight: bold;">${data.occasion}</td></tr>
              <tr><td style="padding: 10px; color: #666; vertical-align: top;">Notes:</td><td style="padding: 10px; font-style: italic;">${data.request || 'None'}</td></tr>
            </table>

            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 12px; color: #777; margin-bottom: 12px;">Approve or decline instantly by logging into Limelight Admin Dashboard.</p>
              <span style="display: inline-block; background-color: #000; color: #fff; padding: 12px 25px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; border-radius: 0px;">Open Admin Panel</span>
            </div>
          </div>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; font-size: 10px; color: #aaa;">
            Dispatched to Admin Bindings: ${adminEmail}
          </div>
        </div>
      </div>
    `;
  } else if (type === 'contact') {
    customerSubject = `✉️ Inquiry Received - Limelight Guest Support`;
    customerHtml = `
      <div style="${baseEmailStyle}">
        <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e1e1e1; background: white; border-top: 5px solid ${brandColor};">
          <div style="padding: 35px; text-align: center; background-color: #050505; color: white;">
            <h1 style="margin: 0; font-size: 22px; letter-spacing: 2px; font-weight: 900; color: ${brandColor};">LIMELIGHT</h1>
            <p style="margin: 3px 0 0 0; font-size: 10px; text-transform: uppercase; color: #888;">Guest Relations Desk</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Dear ${data.name},</p>
            <p>Thank you for reaching out to us. Your corporate inquiry or general request has been successfully registered by our guest relations team.</p>
            
            <div style="background-color: #fafafa; border: 1px solid #eee; padding: 20px; margin: 25px 0;">
              <h4 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; color: ${brandColor};">Your Submitted Inquiry Summary</h4>
              <p style="margin: 4px 0; font-size: 13px;"><strong>Subject:</strong> ${data.subject}</p>
              <p style="margin: 10px 0 0 0; font-size: 13px; color: #555; font-style: italic; line-height: 1.5;">"${data.message}"</p>
            </div>

            <p>One of our managers will get back to you at <strong>${data.email}</strong> or <strong>${data.mobile}</strong> within 12 to 24 business hours.</p>
            <p style="font-size: 13px; color: #666;">For urgent assistance regarding today's table reservations, kindly call our direct hotline: <strong>${contactSettings.phone}</strong>.</p>
          </div>
          <div style="background-color: #fafafa; padding: 25px; text-align: center; font-size: 11px; color: #888; border-top: 1px solid #eee;">
            <p style="margin: 0;">Limelight Restaurant • ${contactSettings.address}</p>
          </div>
        </div>
      </div>
    `;

    adminSubject = `✉️ New Inquiry: ${data.subject} - ${data.name}`;
    adminHtml = `
      <div style="${baseEmailStyle}">
        <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e1e1e1; background: white; border-top: 5px solid ${brandColor};">
          <div style="padding: 25px; background-color: #050505; color: white; text-align: center;">
            <h2 style="margin: 0; font-size: 18px; text-transform: uppercase; color: ${brandColor};">CONTACT FORM SUBMISSION</h2>
          </div>
          <div style="padding: 30px;">
            <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 25px;">
              <tr style="border-b: 1px solid #eee;"><td style="padding: 8px 0; color: #666; width: 30%;">Sender Name:</td><td style="padding: 8px 0; font-weight: bold;">${data.name}</td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Email ID:</td><td style="padding: 8px 0; font-weight: bold;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Mobile Phone:</td><td style="padding: 8px 0; font-weight: bold;"><a href="tel:${data.mobile}">${data.mobile}</a></td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 8px 0; color: #666;">Subject:</td><td style="padding: 8px 0; font-weight: bold; color: ${brandColor};">${data.subject}</td></tr>
            </table>

            <div style="background-color: #fafafa; border: 1px solid #eee; padding: 20px; border-left: 3px solid ${brandColor};">
              <h4 style="margin: 0 0 10px 0; text-transform: uppercase; font-size: 11px; color: #555;">Message Content</h4>
              <p style="margin: 0; font-size: 13px; line-height: 1.6; whitespace: pre-line;">${data.message}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  } else if (type === 'newsletter') {
    customerSubject = `🎁 Welcome to the Limelight VIP Circle - Special Discount Code Inside`;
    customerHtml = `
      <div style="${baseEmailStyle}">
        <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e1e1e1; background: white; border-top: 5px solid ${brandColor};">
          <div style="padding: 40px 30px; text-align: center; background-color: #050505; color: white;">
            <h1 style="margin: 0; font-size: 26px; letter-spacing: 3px; font-weight: 900; color: ${brandColor};">LIMELIGHT</h1>
            <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; color: #888;">Gourmet Newsletter subscription</p>
          </div>
          <div style="padding: 40px 30px; text-align: center;">
            <h2 style="font-size: 20px; color: #111; text-transform: uppercase; margin-top: 0;">You're in the Spotlight!</h2>
            <p style="font-size: 15px; color: #555;">Welcome to our exclusive mailing list. You will be the very first to receive chef journals, secret recipes, invitations to live acoustic evenings, and private dining promotions.</p>
            
            <div style="background-color: #ff1493/[0.05]; border: 2px dashed ${brandColor}; padding: 30px; margin: 35px 0; background-color: #fff9fc;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #666; display: block; margin-bottom: 10px;">Your Exclusive Welcome Voucher</span>
              <h2 style="margin: 0; font-size: 32px; font-weight: 900; color: ${brandColor}; letter-spacing: 1px;">WELCOME15</h2>
              <p style="margin: 10px 0 0 0; font-size: 13px; font-weight: bold; color: #333;">15% Off Your First Dining Bill</p>
              <p style="margin: 5px 0 0 0; font-size: 11px; color: #777;">Present this promo code to your server on arrival. Valid for tandoori platters and chef specials.</p>
            </div>

            <p style="font-size: 13px; color: #666;">Ready to dine with us? Experience the grand pink-themed culinary theater.</p>
            <div style="margin-top: 30px;">
              <span style="display: inline-block; background-color: ${brandColor}; color: white; padding: 14px 30px; font-weight: bold; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; text-decoration: none;">Book Table Instantly</span>
            </div>
          </div>
        </div>
      </div>
    `;

    adminSubject = `📧 Newsletter: New VIP subscriber added - ${data.email}`;
    adminHtml = `
      <div style="${baseEmailStyle}">
        <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e1e1e1; background: white; padding: 30px; border-top: 4px solid ${brandColor};">
          <h3 style="margin: 0 0 15px 0; text-transform: uppercase; color: ${brandColor};">New Subscriber Added</h3>
          <p style="font-size: 14px;"><strong>Email ID:</strong> ${data.email}</p>
          <p style="font-size: 12px; color: #777;">Subscriber has been added to the mailing database at ${new Date().toLocaleString()}. Welcome code WELCOME15 has been automatically sent.</p>
        </div>
      </div>
    `;
  } else if (type === 'event-booking') {
    customerSubject = `🎉 Spot Secured: ${data.eventName} reservation confirmed!`;
    customerHtml = `
      <div style="${baseEmailStyle}">
        <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e1e1e1; background: white; border-top: 5px solid ${brandColor};">
          <div style="padding: 40px 30px; text-align: center; background-color: #050505; color: white;">
            <h1 style="margin: 0; font-size: 24px; color: ${brandColor}; font-weight: 900; letter-spacing: 2px;">LIMELIGHT SOCIALS</h1>
            <p style="margin: 5px 0 0 0; font-size: 10px; text-transform: uppercase; color: #888;">VIP Event Registration Board</p>
          </div>
          <div style="padding: 40px 30px;">
            <p style="font-size: 16px; font-weight: bold; margin-top: 0;">Hi ${data.name},</p>
            <p>Your guest reservation for the spectacular event <strong>"${data.eventName}"</strong> has been successfully registered! Get ready for an evening of absolute visual drama and culinary ecstasy.</p>
            
            <div style="background-color: #fafafa; border: 1px solid #eee; padding: 25px; margin: 30px 0; border-left: 4px solid ${brandColor};">
              <h3 style="margin-top: 0; text-transform: uppercase; font-size: 13px; color: ${brandColor};">Your Event Particulars</h3>
              <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                <tr><td style="padding: 6px 0; color: #666; width: 40%;">Event Name:</td><td style="padding: 6px 0; font-weight: bold; color: ${brandColor};">${data.eventName}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Guest Name:</td><td style="padding: 6px 0; font-weight: bold;">${data.name}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Total Companions:</td><td style="padding: 6px 0; font-weight: bold;">${data.guests} Guests</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Scheduled Date:</td><td style="padding: 6px 0; font-weight: bold;">${data.date}</td></tr>
                <tr><td style="padding: 6px 0; color: #666;">Entry Access:</td><td style="padding: 6px 0;"><span style="background-color: #d4edda; color: #155724; padding: 3px 8px; font-weight: bold; font-size: 11px; text-transform: uppercase; border-radius: 2px;">VIP Registered</span></td></tr>
              </table>
            </div>

            <p style="font-size: 13px; color: #666;">Please display this email or confirm your name at the lounge door. Standard smart-casual dress codes apply for our weekly socials.</p>
          </div>
        </div>
      </div>
    `;

    adminSubject = `🎉 VIP Event Registration: ${data.eventName} - ${data.name}`;
    adminHtml = `
      <div style="${baseEmailStyle}">
        <div style="max-w: 600px; margin: 0 auto; border: 1px solid #e1e1e1; background: white; border-top: 5px solid ${brandColor};">
          <div style="padding: 25px; background-color: #050505; color: white; text-align: center;">
            <h3 style="margin: 0; text-transform: uppercase; color: ${brandColor}; font-weight: 900;">NEW EVENT GUEST LOCK</h3>
          </div>
          <div style="padding: 30px;">
            <p>A new patron has booked a slot for an upcoming calendar event:</p>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-top: 15px; background: #fafafa; padding: 15px; border: 1px solid #eee;">
              <tr style="border-b: 1px solid #eee;"><td style="padding: 8px; color: #666;">Patron:</td><td style="padding: 8px; font-weight: bold;">${data.name}</td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 8px; color: #666;">Event Title:</td><td style="padding: 8px; font-weight: bold; color: ${brandColor};">${data.eventName}</td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 8px; color: #666;">Guests:</td><td style="padding: 8px; font-weight: bold;">${data.guests} Pax</td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 8px; color: #666;">Date:</td><td style="padding: 8px; font-weight: bold;">${data.date}</td></tr>
              <tr style="border-b: 1px solid #eee;"><td style="padding: 8px; color: #666;">Email ID:</td><td style="padding: 8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
              <tr><td style="padding: 8px; color: #666;">Mobile:</td><td style="padding: 8px;"><a href="tel:${data.mobile}">${data.mobile}</a></td></tr>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  // Attempt to submit to Netlify serverless function
  let functionSuccess = false;
  try {
    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        data,
        customerSubject,
        customerHtml,
        adminSubject,
        adminHtml,
        adminEmail
      })
    });
    
    if (response.ok) {
      console.log('[Netlify Function] Email dispatch API call succeeded.');
      functionSuccess = true;
    } else {
      console.warn(`[Netlify Function] Email dispatch api returned code ${response.status}.`);
    }
  } catch (error) {
    console.warn('[Netlify Function] Could not contact Netlify Functions serverless endpoint (expected in local dev/non-Netlify hosting). Falling back to dynamic visual browser client overlay.');
  }

  // Display the gorgeous interactive mock email notification client so users can instantly inspect the HTML template and verify the confirmation copy
  displayMockEmailOverlay(
    type === 'reservation' ? 'Reservation Confirmation' :
    type === 'contact' ? 'Contact Form Desk' :
    type === 'newsletter' ? 'Welcome Newsletter' : 'Event VIP Guest Card',
    data.email,
    customerSubject,
    customerHtml
  );

  // Also display a second notification showing what the admin receives!
  setTimeout(() => {
    displayMockEmailOverlay(
      'Admin Notification Email',
      adminEmail,
      adminSubject,
      adminHtml
    );
  }, 1200);

  return functionSuccess;
}
