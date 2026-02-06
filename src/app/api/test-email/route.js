// C:\Users\HP\reminder\src\app\api\test-email\route.js
import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/email';

export async function GET() {
  try {
    console.log('📧 Sending test email...');
    console.log('GMAIL_USER:', process.env.GMAIL_USER);
    
    const result = await sendTestEmail();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        messageId: result.messageId,
        sentTo: process.env.GMAIL_USER
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}