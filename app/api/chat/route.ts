import { NextRequest, NextResponse } from 'next/server';

// Xử lý OPTIONS request cho CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-subdomain',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // Lấy subdomain từ header
    const subdomain = request.headers.get('x-subdomain') || 'gen8';
    
    // Lấy dữ liệu từ request body
    const body = await request.json();
    const { message } = body;
    
    console.log(`API received message from subdomain ${subdomain}: ${message}`);
    
    // Xử lý phản hồi dựa trên subdomain
    let response: string;
    
    switch (subdomain) {
      case 'gen9':
        response = `[Gen9] Phản hồi cho tin nhắn: "${message}"`;
        break;
      case 'gen8':
        response = `[Gen8] Phản hồi cho tin nhắn: "${message}"`;
        break;
      default:
        response = `[${subdomain}] Phản hồi cho tin nhắn: "${message}"`;
    }
    
    return NextResponse.json({ 
      response,
      subdomain,
      success: true 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    );
  }
} 