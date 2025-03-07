import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { createXai } from '@ai-sdk/xai';

const xai = createXai({
  apiKey: process.env.XAI_API_KEY, // API key từ biến môi trường
  // Tùy chọn: nếu cần thay đổi URL mặc định hoặc thêm header
  // baseURL: 'https://api.x.ai/v1',
  // headers: { 'Custom-Header': 'value' },
});

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
      model: xai('grok-2-latest'),
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