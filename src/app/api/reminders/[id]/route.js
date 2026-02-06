// C:\Users\HP\reminder\src\app\api\reminders\[id]\route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Reminder from '@/models/Reminder';

// GET single reminder by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    console.log(`GET /api/reminders/${id}`);

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid reminder ID' },
        { status: 400 }
      );
    }

    const reminder = await Reminder.findOne({
      _id: id,
      deleted: { $ne: true }
    });

    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(reminder);
  } catch (error) {
    console.error('GET reminder by ID error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reminder' },
      { status: 500 }
    );
  }
}

// PUT update reminder by ID
export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    const body = await request.json();

    console.log(`PUT /api/reminders/${id}`, body);

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid reminder ID' },
        { status: 400 }
      );
    }

    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: id, deleted: { $ne: true } },
      {
        title: body.title,
        subject: body.subject || '',
        dateTime: new Date(body.dateTime),
        meetingDetails: body.meetingDetails || {},
        completed: body.completed || false
      },
      { new: true, runValidators: true }
    );

    if (!updatedReminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    console.log('✅ Reminder updated:', updatedReminder._id);
    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error('PUT reminder error:', error);
    return NextResponse.json(
      { error: 'Failed to update reminder' },
      { status: 500 }
    );
  }
}

// SOFT DELETE reminder by ID
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = await params;
    console.log(`DELETE /api/reminders/${id}`);

    if (!id || id === 'undefined') {
      return NextResponse.json(
        { error: 'Invalid reminder ID' },
        { status: 400 }
      );
    }

    const reminder = await Reminder.findById(id);

    if (!reminder) {
      return NextResponse.json(
        { error: 'Reminder not found' },
        { status: 404 }
      );
    }

    if (reminder.deleted) {
      return NextResponse.json({
        success: true,
        alreadyArchived: true,
        message: 'Reminder already archived',
      });
    }

    reminder.deleted = true;
    await reminder.save();

    console.log('✅ Reminder archived:', id);
    return NextResponse.json({
      success: true,
      message: 'Reminder archived successfully',
      reminderId: id,
      archivedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('DELETE reminder error:', error);
    return NextResponse.json(
      { error: 'Failed to archive reminder' },
      { status: 500 }
    );
  }
}