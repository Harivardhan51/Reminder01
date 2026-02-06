// C:\Users\HP\reminder\src\lib\email.js
import nodemailer from 'nodemailer';

// Create transporter with proper Gmail configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    }
  });
};

export async function sendReminderEmail(reminder, minutesBefore) {
  try {
    const transporter = createTransporter();
    const eventTime = new Date(reminder.dateTime);
    
    // Recipient email - send to GMAIL_USER or specify another
    const recipientEmail = process.env.GMAIL_USER;
    
    const emailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background-color: #f4f4f4; 
            padding: 20px; 
            margin: 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 16px; 
            overflow: hidden; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.15); 
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: bold;
          }
          .header p { 
            margin: 10px 0 0; 
            opacity: 0.9; 
            font-size: 16px;
          }
          .content { 
            padding: 30px; 
          }
          .alert-box { 
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 2px solid #ffc107; 
            border-radius: 12px; 
            padding: 20px; 
            margin-bottom: 25px;
            text-align: center;
          }
          .alert-box.urgent { 
            background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
            border-color: #dc3545;
            animation: pulse 2s infinite;
          }
          .alert-box h3 {
            margin: 0 0 5px 0;
            font-size: 20px;
          }
          .event-title {
            background: linear-gradient(135deg, #e8f4fd 0%, #d4edff 100%);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            border-left: 5px solid #667eea;
          }
          .event-title h2 {
            margin: 0;
            color: #333;
            font-size: 24px;
          }
          .detail-row { 
            display: flex; 
            padding: 15px 0; 
            border-bottom: 1px solid #eee; 
            align-items: center;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .detail-icon {
            font-size: 24px;
            margin-right: 15px;
            width: 40px;
            text-align: center;
          }
          .detail-label { 
            font-weight: 600; 
            color: #666; 
            width: 100px; 
          }
          .detail-value { 
            color: #333; 
            flex: 1;
            font-size: 16px;
          }
          .meeting-box { 
            background: #e8f4fd; 
            border-radius: 12px; 
            padding: 20px; 
            margin-top: 20px; 
          }
          .meeting-box.phone { 
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            border-left: 5px solid #2196f3; 
          }
          .meeting-box.google_meet { 
            background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
            border-left: 5px solid #9c27b0; 
          }
          .meeting-box.location { 
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
            border-left: 5px solid #4caf50; 
          }
          .meeting-box h4 {
            margin: 0 0 15px 0;
            font-size: 18px;
          }
          .btn { 
            display: inline-block; 
            padding: 14px 28px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important; 
            text-decoration: none; 
            border-radius: 8px; 
            margin-top: 15px;
            font-weight: bold;
            font-size: 16px;
          }
          .btn:hover {
            opacity: 0.9;
          }
          .btn.meet {
            background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
          }
          .footer { 
            background: #f8f9fa; 
            padding: 25px; 
            text-align: center; 
            color: #666; 
            font-size: 13px;
            border-top: 1px solid #eee;
          }
          .countdown {
            font-size: 36px;
            font-weight: bold;
            color: ${minutesBefore === 15 ? '#dc3545' : '#667eea'};
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${minutesBefore === 15 ? '🚨 URGENT REMINDER' : '⏰ EVENT REMINDER'}</h1>
            <p>Your scheduled event is coming up!</p>
          </div>
          
          <div class="content">
            <div class="alert-box ${minutesBefore === 15 ? 'urgent' : ''}">
              <div class="countdown">${minutesBefore === 60 ? '1 HOUR' : '15 MINUTES'}</div>
              <h3>${minutesBefore === 15 ? '⚠️ Starting Very Soon!' : '📅 Time to Prepare!'}</h3>
              <p style="margin: 5px 0 0; color: #666;">Don't miss your upcoming event</p>
            </div>
            
            <div class="event-title">
              <h2>📌 ${reminder.title}</h2>
              ${reminder.subject ? `<p style="margin: 10px 0 0; color: #666;">${reminder.subject}</p>` : ''}
            </div>
            
            <div class="detail-row">
              <span class="detail-icon">📅</span>
              <span class="detail-label">Date:</span>
              <span class="detail-value">${eventTime.toLocaleDateString('en-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                timeZone: 'Asia/Kolkata'
              })}</span>
            </div>
            
            <div class="detail-row">
              <span class="detail-icon">⏰</span>
              <span class="detail-label">Time:</span>
              <span class="detail-value" style="font-weight: bold; color: #667eea; font-size: 18px;">${eventTime.toLocaleTimeString('en-IN', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Kolkata'
              })}</span>
            </div>
            
            ${reminder.meetingDetails ? `
            <div class="meeting-box ${reminder.meetingDetails.type || ''}">
              <h4>
                ${reminder.meetingDetails.type === 'phone' ? '📞 Phone Call Details' : 
                  reminder.meetingDetails.type === 'google_meet' ? '🎥 Google Meet Details' : 
                  '📍 Location Details'}
              </h4>
              
              ${reminder.meetingDetails.phoneNumber ? `
                <p style="margin: 0; font-size: 18px;">
                  <strong>Phone Number:</strong><br>
                  <span style="font-size: 24px; color: #2196f3; font-weight: bold;">${reminder.meetingDetails.phoneNumber}</span>
                </p>
                <a href="tel:${reminder.meetingDetails.phoneNumber}" class="btn">📞 Call Now</a>
              ` : ''}
              
              ${reminder.meetingDetails.meetLink ? `
                <p style="margin: 0;">
                  <strong>Meeting Link:</strong><br>
                  <a href="${reminder.meetingDetails.meetLink}" style="color: #9c27b0; word-break: break-all;">${reminder.meetingDetails.meetLink}</a>
                </p>
                <a href="${reminder.meetingDetails.meetLink}" class="btn meet">🎥 Join Meeting Now</a>
              ` : ''}
              
              ${reminder.meetingDetails.address ? `
                <p style="margin: 0; font-size: 16px;">
                  <strong>Address:</strong><br>
                  <span style="color: #4caf50;">${reminder.meetingDetails.address}</span>
                </p>
                <a href="https://www.google.com/maps/search/${encodeURIComponent(reminder.meetingDetails.address)}" class="btn" style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);">📍 Open in Maps</a>
              ` : ''}
            </div>
            ` : ''}
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px 0;">
              <strong>⏰ Event Management System</strong>
            </p>
            <p style="margin: 0; color: #999;">
              This is an automated reminder. Please do not reply to this email.
            </p>
            <p style="margin: 10px 0 0; color: #999;">
              © ${new Date().getFullYear()} Reminder App
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"🔔 Event Reminder" <${process.env.GMAIL_USER}>`,
      to: recipientEmail,
      subject: `${minutesBefore === 15 ? '🚨 URGENT: ' : '⏰ '}${reminder.title} - ${minutesBefore === 60 ? '1 Hour' : '15 Minutes'} Left!`,
      html: emailContent,
    };

    console.log(`📧 Attempting to send email to: ${recipientEmail}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully for "${reminder.title}" (${minutesBefore}min before)`);
    console.log(`📨 Message ID: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send reminder email:', error.message);
    console.error('Error details:', error);
    return { success: false, error: error.message };
  }
}

export async function checkAndSendReminders(reminders) {
  const now = new Date();
  const results = [];

  console.log(`🔍 Checking ${reminders.length} reminders at ${now.toLocaleTimeString()}`);

  for (const reminder of reminders) {
    if (reminder.deleted || reminder.completed) {
      console.log(`⏭️ Skipping deleted/completed reminder: ${reminder.title}`);
      continue;
    }

    const eventTime = new Date(reminder.dateTime);
    const diffMs = eventTime - now;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));


    console.log(`📋 "${reminder.title}" - Event in ${diffMinutes} minutes`);

    // Initialize alertsTriggered if not exists
    if (!reminder.alertsTriggered) {
      reminder.alertsTriggered = [];
    }

    // Check for 1 hour (60 minutes) reminder - trigger between 55-65 minutes
    // 1 hour reminder (safe window)
if (
  diffMinutes <= 60 &&
  diffMinutes > 50 &&
  !reminder.alertsTriggered.includes(60)
) {

      console.log(`⏰ Sending 1-hour reminder for: ${reminder.title}`);
      const result = await sendReminderEmail(reminder, 60);
      if (result.success) {
        reminder.alertsTriggered.push(60);
        await reminder.save();
        results.push({ reminder: reminder.title, type: '1-hour', success: true });
        console.log(`✅ 1-hour reminder sent and saved for: ${reminder.title}`);
      } else {
        results.push({ reminder: reminder.title, type: '1-hour', success: false, error: result.error });
      }
    }

    // Check for 15 minutes reminder - trigger between 10-20 minutes
   // 15 minute reminder (safe window)
if (
  diffMinutes <= 15 &&
  diffMinutes > 5 &&
  !reminder.alertsTriggered.includes(15)
) {

      console.log(`🚨 Sending 15-minute reminder for: ${reminder.title}`);
      const result = await sendReminderEmail(reminder, 15);
      if (result.success) {
        reminder.alertsTriggered.push(15);
        await reminder.save();
        results.push({ reminder: reminder.title, type: '15-min', success: true });
        console.log(`✅ 15-minute reminder sent and saved for: ${reminder.title}`);
      } else {
        results.push({ reminder: reminder.title, type: '15-min', success: false, error: result.error });
      }
    }
  }

  return results;
}

// Test email function
export async function sendTestEmail() {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"🔔 Test Email" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: '✅ Test Email - Reminder System Working!',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f0f0f0;">
          <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
            <h1 style="color: #4CAF50;">✅ Test Successful!</h1>
            <p>Your email reminder system is configured correctly.</p>
            <p>Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">This is a test email from your Reminder App.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Test email failed:', error);
    return { success: false, error: error.message };
  }
}