import { NextRequest, NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

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
    // Lấy subdomain từ params
    const subdomain = params.domain;
    
    console.log(`API route handling request for subdomain: ${subdomain}`);
    
    // Lấy dữ liệu từ request body
    const { messages } = await request.json();
    
    // Tùy chỉnh prompt dựa trên subdomain
    let systemPrompt = '';
    
    switch (subdomain) {
      case 'gen9':
        systemPrompt = 'Bạn là Gen9 AI, một trợ lý thông minh với khả năng xử lý ngôn ngữ tự nhiên tiên tiến.';
        break;
      case 'gen8':
        systemPrompt = 'Bạn là Gen8 AI, một trợ lý thông minh được phát triển để giúp đỡ người dùng.';
        break;
      default:
        systemPrompt = `Bạn là ${subdomain} AI, một trợ lý thông minh được tùy chỉnh cho người dùng.`;
    }
    
    // Thêm system message vào đầu nếu chưa có
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    // Sử dụng Google Generative AI để tạo phản hồi
    const result = await streamText({
      model: google('gemini-2.0-flash'),
      messages: messagesWithSystem
    });

    return result.toDataStreamResponse();
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