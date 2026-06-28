import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lazy initializer for Supabase client
let supabaseClient: any = null;
function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    console.warn("Supabase credentials are not fully configured in environment variables.");
    return null;
  }
  if (!supabaseClient) {
    supabaseClient = createClient(url, anonKey);
  }
  return supabaseClient;
}

// Lazy initializer for Nodemailer Transporter
function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP email credentials are not fully configured in environment variables.");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: parseInt(port || "587", 10),
    secure: port === "465", // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
}

// Configuration Check API Endpoint
app.get("/api/config-check", (req, res) => {
  res.json({
    supabaseConfigured: !!process.env.SUPABASE_URL && !!process.env.SUPABASE_ANON_KEY,
    smtpConfigured: !!process.env.SMTP_HOST && !!process.env.SMTP_USER && !!process.env.SMTP_PASS,
  });
});

// Secure server-side endpoint for handling table reservations
app.post("/api/reservations", async (req, res) => {
  const { name, email, phone, date, time, guests, notes } = req.body;

  // Basic validation
  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({
      success: false,
      message: "Please fill out all required fields: name, email, phone, date, time, and guests."
    });
  }

  const bookingTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short"
  });

  let dbSaved = false;
  let emailSent = false;
  let dbErrorDetail = null;
  let emailErrorDetail = null;

  // 1. Save booking in the Supabase database
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reservations")
        .insert([
          {
            name,
            email,
            phone,
            date,
            time,
            guests: parseInt(guests, 10) || 2,
            notes: notes || "",
            status: "pending",
            created_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) {
        console.error("Supabase insert error details:", error);
        dbErrorDetail = error.message;
      } else {
        dbSaved = true;
        console.log("Successfully saved reservation to Supabase:", data);
      }
    } catch (dbErr: any) {
      console.error("Supabase connection exception:", dbErr);
      dbErrorDetail = dbErr.message || String(dbErr);
    }
  } else {
    dbErrorDetail = "Supabase environment variables (SUPABASE_URL, SUPABASE_ANON_KEY) are not set.";
  }

  // 2. Send email notification to: it.rosh@royalorchidhotels.com
  const transporter = getMailTransporter();
  if (transporter) {
    try {
      const fromEmail = process.env.SMTP_FROM || `"Limelight Table Desk" <${process.env.SMTP_USER}>`;
      const mailOptions = {
        from: fromEmail,
        to: "it.rosh@royalorchidhotels.com",
        subject: `🔔 New Table Booking Request: ${name} (${guests} Guests)`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fce7f3; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); background-color: #ffffff;">
            <!-- Header Banner -->
            <div style="background: linear-gradient(135deg, #db2777, #be185d); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; font-family: Georgia, serif;">Limelight Bistro & Lounge</h1>
              <p style="color: #fbcfe8; margin: 8px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 500;">New Reservation Request Received</p>
            </div>
            
            <!-- Main Content Container -->
            <div style="padding: 32px 24px; color: #404040; line-height: 1.6;">
              <p style="margin-top: 0; font-size: 15px; color: #525252;">A new online table reservation inquiry has been submitted by a guest. Please check the details below:</p>
              
              <!-- Details Grid -->
              <table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 14px;">
                <tbody>
                  <tr style="border-bottom: 1px solid #f5f5f5;">
                    <td style="padding: 12px 8px; font-weight: 600; color: #171717; width: 35%;">Guest Name</td>
                    <td style="padding: 12px 8px; color: #404040;">${name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f5f5f5;">
                    <td style="padding: 12px 8px; font-weight: 600; color: #171717;">Contact Phone</td>
                    <td style="padding: 12px 8px; color: #404040;"><a href="tel:${phone}" style="color: #db2777; text-decoration: none; font-weight: 500;">${phone}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f5f5f5;">
                    <td style="padding: 12px 8px; font-weight: 600; color: #171717;">Email Address</td>
                    <td style="padding: 12px 8px; color: #404040;"><a href="mailto:${email}" style="color: #db2777; text-decoration: none;">${email}</a></td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f5f5f5;">
                    <td style="padding: 12px 8px; font-weight: 600; color: #171717;">Dining Date</td>
                    <td style="padding: 12px 8px; color: #171717; font-weight: 600;">${date}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f5f5f5;">
                    <td style="padding: 12px 8px; font-weight: 600; color: #171717;">Dining Time</td>
                    <td style="padding: 12px 8px; color: #171717; font-weight: 600;">${time}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f5f5f5;">
                    <td style="padding: 12px 8px; font-weight: 600; color: #171717;">No. of Guests</td>
                    <td style="padding: 12px 8px; color: #404040; font-weight: 600;">${guests} Guests</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f5f5f5;">
                    <td style="padding: 12px 8px; font-weight: 600; color: #171717;">Special Request</td>
                    <td style="padding: 12px 8px; color: #525252; font-style: ${notes ? "normal" : "italic"};">${notes ? notes : "No special requests specified."}</td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 8px; font-weight: 600; color: #171717;">Booking Time</td>
                    <td style="padding: 12px 8px; color: #737373; font-size: 12px;">${bookingTime} (IST)</td>
                  </tr>
                </tbody>
              </table>

              <!-- Decorative Prompt -->
              <div style="background-color: #fff5f7; border-left: 4px solid #db2777; padding: 16px; border-radius: 8px; margin-top: 24px;">
                <p style="margin: 0; font-size: 13px; color: #be185d; font-weight: 500;">
                  Please verify this request in the Limelight Administrator Portal and reach out to the guest to confirm availability.
                </p>
              </div>
            </div>

            <!-- Footer Section -->
            <div style="background-color: #fafafa; border-top: 1px solid #f0f0f0; padding: 20px; text-align: center; font-size: 11px; color: #a3a3a3;">
              <p style="margin: 0;">This email was sent automatically from the Limelight Bistro & Lounge Booking Engine.</p>
              <p style="margin: 4px 0 0 0;">© 2026 Limelight Haridwar. All rights reserved.</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      emailSent = true;
      console.log("Email notification successfully sent to it.rosh@royalorchidhotels.com");
    } catch (mailErr: any) {
      console.error("Nodemailer send exception:", mailErr);
      emailErrorDetail = mailErr.message || String(mailErr);
    }
  } else {
    emailErrorDetail = "SMTP transport environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS) are not set.";
  }

  // 3. Formulate response based on requirements:
  // "If email sending fails, still save the booking in the database and show an appropriate message."
  if (dbSaved && emailSent) {
    return res.status(200).json({
      success: true,
      dbSaved: true,
      emailSent: true,
      message: "Your table reservation is secured and a notification email has been dispatched to our staff!"
    });
  } else if (dbSaved && !emailSent) {
    return res.status(200).json({
      success: true,
      dbSaved: true,
      emailSent: false,
      warning: "Database saved, but email notification failed.",
      errorDetail: emailErrorDetail,
      message: "Your table reservation is secured in our database, but there was a minor system issue sending the confirmation email. Our staff will check your booking manually."
    });
  } else if (!dbSaved && emailSent) {
    return res.status(200).json({
      success: true,
      dbSaved: false,
      emailSent: true,
      warning: "Email notification sent, but failed to save in the database.",
      errorDetail: dbErrorDetail,
      message: "We have successfully emailed your reservation request to our staff, though there was a temporary issue saving it to our backend database. Our staff will contact you directly."
    });
  } else {
    // Both failed (or neither occurred)
    return res.status(500).json({
      success: false,
      dbSaved: false,
      emailSent: false,
      errorDetail: `DB: ${dbErrorDetail} | Email: ${emailErrorDetail}`,
      message: "We encountered a temporary server error processing your reservation. Please try again or contact us directly by phone."
    });
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
