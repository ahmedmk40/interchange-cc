import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    // Test the database connection
    const result = await query('SELECT NOW() as now');
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connection successful',
      timestamp: result.rows[0].now,
      database: 'Neon PostgreSQL'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
