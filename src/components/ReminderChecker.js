// C:\Users\HP\reminder\src\components\ReminderChecker.js
'use client';

import { useEffect, useRef } from 'react';

export default function ReminderChecker() {
  const intervalRef = useRef(null);

  useEffect(() => {
    // Function to check reminders
    const checkReminders = async () => {
      try {
        console.log('🔄 Checking for reminders to send...');
        const response = await fetch('/api/check-reminders');
        const data = await response.json();
        
        if (data.emailsSent > 0) {
          console.log(`📧 Sent ${data.emailsSent} reminder emails`);
        }
      } catch (error) {
        console.error('Failed to check reminders:', error);
      }
    };

    // Check immediately on mount
    checkReminders();

    // Check every 1 minute (60000 ms)
    intervalRef.current = setInterval(checkReminders, 60000);

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}