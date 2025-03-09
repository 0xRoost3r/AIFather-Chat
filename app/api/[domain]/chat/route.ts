import { NextRequest, NextResponse } from 'next/server';
import { streamText, tool } from 'ai';
import { createXai } from '@ai-sdk/xai';
import { z } from 'zod';
export const maxDuration = 60;
export const runtime = 'edge';

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
        systemPrompt = 'You are Gen9 AI, .';
        break;
      case 'gen8':
        systemPrompt = 'You are Gen8 AI, .';
        break;
      default:
        systemPrompt = `You are ${subdomain} AI, .`;
    }

    systemPrompt += `
You are an expert in web3. Your task is to provide comprehensive advice and guidance for generating a ERC20 token in ThirdWeb. Follow these rules:
1. For tokens (ERC-20):
  - If the 'symbol' is missing, use the 'name' as the symbol.
  - Provide a detailed template including 'name', 'symbol'.
    `
    
    // Thêm system message vào đầu nếu chưa có
    const messagesWithSystem = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];
    
    // Sử dụng Google Generative AI để tạo phản hồi
    const result = await streamText({
      model: xai('grok-2-latest'),
      messages: messagesWithSystem,
      tools: {
        tokenTemplate: tool({
          description: 'Get a template for ERC20 token',
          parameters: z.object({
            name: z.string().describe('The name of the token'),
            symbol: z.string().describe('The symbol of the token'),
          }),
          execute: async ({ name, symbol }) => {
            return {
              name,
              symbol,
            };
          },
        })}
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