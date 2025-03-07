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

export async function POST(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    // Log toàn bộ request để debug
    console.log('API route params:', params);
    console.log('API route headers:', Object.fromEntries(request.headers.entries()));
    
    // Lấy subdomain từ params
    const subdomain = params.domain;
    
    console.log(`API route handling request for subdomain: ${subdomain}`);
    
    // Lấy dữ liệu từ request body
    const body = await request.json();
    console.log('Request body:', body);
    
    const { message } = body;
    
    console.log(`Message received: "${message}"`);
    
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
    console.error('Detailed error in chat API:', error);
    // Log stack trace nếu có
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    );
  }
} 