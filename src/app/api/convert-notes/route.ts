import { NextResponse } from 'next/server';
import { summarizeText } from '@/app/api/summarization/summary';

export async function POST(request: Request) {
  try {
    const { notes } = await request.json();
    
    if (!notes || typeof notes !== 'string') {
      return NextResponse.json(
        { error: 'Notes are required' },
        { status: 400 }
      );
    }
    
    // Use the summarizeText function
    const summary = await summarizeText(notes);
    
    return NextResponse.json({
      success: true,
      summary
    });
    
  } catch (error) {
    console.error('Error creating summary:', error);
    return NextResponse.json(
      { error: 'Failed to create summary' },
      { status: 500 }
    );
  }
}