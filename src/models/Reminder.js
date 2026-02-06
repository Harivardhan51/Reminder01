// C:\Users\HP\reminder\src\models\Reminder.js
import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, default: '' },
  dateTime: { type: Date, required: true },
  meetingDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  completed: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false },
  alertsTriggered: { type: [Number], default: [] }, // Stores which alerts have been sent (60, 15)
  userEmail: { type: String, default: '' }, // Optional: for multi-user support
}, { timestamps: true });

// Index for efficient querying
reminderSchema.index({ dateTime: 1, deleted: 1, completed: 1 });

export default mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);