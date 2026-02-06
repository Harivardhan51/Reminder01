// C:\Users\HP\reminder\src\app\api\reminders\route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

// GET all ACTIVE reminders
export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    
    const reminders = await Reminder
      .find({
        deleted: { $ne: true },
        completed: { $ne: true },
        dateTime: { $gte: now }
      })
      .sort({ dateTime: 1 });

    console.log('GET /api/reminders - Active events:', reminders.length);

    return NextResponse.json(reminders);
  } catch (error) {
    console.error('GET reminders error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST create new reminder
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    console.log('POST /api/reminders', body);

    if (!body.title || !body.dateTime) {
      return NextResponse.json(
        { error: 'Title and dateTime are required' },
        { status: 400 }
      );
    }

    const newReminder = await Reminder.create({
      title: body.title,
      subject: body.subject || '',
      dateTime: new Date(body.dateTime),
      meetingDetails: body.meetingDetails || {},
      completed: false,
      deleted: false,
      alertsTriggered: []
    });

    console.log('✅ Reminder created:', newReminder._id);

    return NextResponse.json(newReminder, { status: 201 });
  } catch (error) {
    console.error('POST reminder error:', error);
    return NextResponse.json(
      { error: 'Failed to create reminder' },
      { status: 500 }
    );
  }
}