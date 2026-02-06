// C:\Users\HP\reminder\src\app\layout.js
import './globals.css'

export const metadata = {
  title: 'Reminder App',
  description: 'Personal reminders with email alerts',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}