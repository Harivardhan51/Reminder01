// C:\Users\HP\reminder\src\app\api\admin\reminders\route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

// GET all reminders including deleted ones (for admin)
export async function GET() {
  try {
    await connectDB();
    
    const reminders = await Reminder.find().sort({ createdAt: -1 });
    console.log('GET /api/admin/reminders - Found', reminders.length, 'total reminders');
    return NextResponse.json(reminders);
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch all reminders' },
      { status: 500 }
    );
  }
}

// Restore deleted reminder
export async function PATCH(request) {
  try {
    await connectDB();
    
    const { id } = await request.json();
    console.log(`PATCH /api/admin/reminders restore called for ID: ${id}`);
    
    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid reminder ID' },
        { status: 400 }
      );
    }
    
    const restoredReminder = await Reminder.findByIdAndUpdate(
      id,
      { deleted: false },
      { new: true }
    );
    
    if (!restoredReminder) {
      console.error(`Reminder ${id} not found for restore`);
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Reminder restored from archive:', restoredReminder._id);
    return NextResponse.json({ 
      success: true,
      message: 'Reminder restored successfully',
      reminder: restoredReminder
    });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { error: 'Failed to restore reminder' },
      { status: 500 }
    );
  }
}