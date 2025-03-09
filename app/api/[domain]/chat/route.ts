import { NextRequest, NextResponse } from 'next/server';
import { streamText, tool } from 'ai';
import { createXai } from '@ai-sdk/xai';
import { z } from 'zod';
import site from '@/constant';
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
    let systemPrompt = `You are ${subdomain} AI, an expert in web3 and domain management.`;
    
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
        }),
        
        // Add new tool for subdomain creation
        agentClone: tool({
          description: 'Create a new subdomain for the user',
          parameters: z.object({
            username: z.string().describe('Username to create subdomain for'),
            purpose: z.string().describe('Purpose of the agent clone'),
          }),
          execute: async ({ username, purpose }) => {
            try {
              // Remove special characters and spaces from username
              const sanitizedUsername = username
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '');

              // Construct the subdomain URL
              const subdomainUrl = `${sanitizedUsername}.${site.host}`;

              // Here you would typically:
              // 1. Check if subdomain is available
              // 2. Create DNS record
              // 3. Set up the new agent configuration
              // For now, we'll just return the information

              return {
                success: true,
                subdomain: subdomainUrl,
                message: `Agent clone created successfully at ${subdomainUrl}`,
                purpose: purpose,
                originalAgent: subdomain,
                createdAt: new Date().toISOString()
              };
            } catch (error) {
              console.error('Error creating subdomain:', error);
              return {
                success: false,
                error: 'Failed to create subdomain',
                message: error instanceof Error ? error.message : 'Unknown error'
              };
            }
          },
        })
      }
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