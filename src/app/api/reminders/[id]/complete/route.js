// C:\Users\HP\reminder\src\app\api\reminders\[id]\complete\route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    console.log(`PATCH /api/reminders/${id}/complete called`);

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid reminder ID' },
        { status: 400 }
      );
    }
    
    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: id, deleted: { $ne: true } },
      { completed: true },
      { new: true }
    );
    
    if (!updatedReminder) {
      console.error(`Reminder ${id} not found for completion or is deleted`);
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Reminder marked as completed:', updatedReminder._id);
    return NextResponse.json({ 
      success: true,
      reminder: updatedReminder
    });
  } catch (error) {
    console.error('PATCH complete error:', error);
    return NextResponse.json(
      { error: 'Failed to complete reminder' },
      { status: 500 }
    );
  }
}