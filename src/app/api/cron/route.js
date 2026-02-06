// C:\Users\HP\reminder\src\app\api\cron\route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { checkAndSendReminders } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// This endpoint can be called by external cron services
export async function GET(request) {
  try {
    // Optional: Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // If CRON_SECRET is set, verify it (optional security)
      console.log('⚠️ Cron request without valid secret, proceeding anyway...');
    }

    await connectDB();
    
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    const reminders = await Reminder.find({ 
      deleted: { $ne: true },
      completed: { $ne: true },
      dateTime: { 
        $gt: now,
        $lte: twoHoursFromNow
      }
    });
    
    console.log(`🔍 CRON: Found ${reminders.length} upcoming reminders`);
    
    const results = await checkAndSendReminders(reminders);
const successCount = results.filter(r => r.success).length;

    
    console.log(`✅ CRON completed: ${results.length} emails sent`);
    
    return NextResponse.json({ 
      success: true,
      message: 'Cron job executed successfully',
      checked: reminders.length,
      emailsSent: results.length,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Cron error:', error);
    return NextResponse.json(
      { error: 'Cron job failed', details: error.message },
      { status: 500 }
    );
  }
}