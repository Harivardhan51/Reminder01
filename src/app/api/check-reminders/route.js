// C:\Users\HP\reminder\src\app\api\check-reminders\route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { checkAndSendReminders } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    
    const now = new Date();
    
    // Get reminders within next 2 hours
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    console.log('🔍 Checking reminders...');
    console.log('Current time:', now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    
    const reminders = await Reminder.find({ 
      deleted: { $ne: true },
      completed: { $ne: true },
      dateTime: { 
        $gt: now,
        $lte: twoHoursFromNow
      }
    });
    
    console.log(`📋 Found ${reminders.length} upcoming reminders`);
    
    if (reminders.length === 0) {
      return NextResponse.json({ 
        success: true,
        message: 'No upcoming reminders to check',
        checked: 0,
        emailsSent: 0,
        timestamp: now.toISOString()
      });
    }
    
    const results = await checkAndSendReminders(reminders);
    
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;
    
    console.log(`✅ Check complete: ${successCount} emails sent, ${failedCount} failed`);
    
    return NextResponse.json({ 
      success: true,
      checked: reminders.length,
      emailsSent: successCount,
      emailsFailed: failedCount,
      results,
      timestamp: now.toISOString()
    });
  } catch (error) {
    console.error('❌ Check reminders error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check reminders', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}