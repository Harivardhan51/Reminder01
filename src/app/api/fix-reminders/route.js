// Create a file: C:\Users\HP\reminder\src\app\api\fix-reminders\route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

export async function GET() {
  try {
    await connectDB();
    
    // Fix all reminders missing deleted/completed fields
    const result = await Reminder.updateMany(
      {
        $or: [
          { deleted: { $exists: false } },
          { completed: { $exists: false } }
        ]
      },
      {
        $set: {
          deleted: false,
          completed: false
        }
      }
    );
    
    console.log('Fixed reminders:', result);
    
    // Get all reminders to verify
    const allReminders = await Reminder.find({});
    
    return NextResponse.json({
      message: 'Fixed reminders',
      modified: result.modifiedCount,
      total: allReminders.length,
      reminders: allReminders.map(r => ({
        id: r._id,
        title: r.title,
        deleted: r.deleted,
        completed: r.completed,
        dateTime: r.dateTime
      }))
    });
  } catch (error) {
    console.error('Fix error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}