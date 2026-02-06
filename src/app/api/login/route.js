import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    
    // Simple hardcoded login for personal use
    if (username === 'admin' && password === 'password') {
      return NextResponse.json({ 
        id: 1, 
        username: 'admin',
        name: 'Admin User'
      });
    }
    
    return NextResponse.json({ 
      error: 'Invalid credentials' 
    }, { 
      status: 401 
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ 
      error: 'Login failed' 
    }, { 
      status: 500 
    });
  }
}
