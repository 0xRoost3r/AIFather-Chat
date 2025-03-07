import { NextRequest, NextResponse } from 'next/server';
import { getMessageHistory } from '../../../utils/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    const subdomain = params.domain;
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '50');
    
    const messages = await getMessageHistory(subdomain, limit);
    
    return NextResponse.json({ 
      messages,
      subdomain,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    );
  }
} 