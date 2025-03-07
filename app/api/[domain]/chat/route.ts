import { NextRequest, NextResponse } from 'next/server';
import { 
  handleGen8Chat, 
  handleGen9Chat, 
  handleVoNguyenChat, 
  handleGAAChat 
} from '../../utils/chatHandlers';

export async function POST(
  request: NextRequest,
  { params }: { params: { domain: string } }
) {
  try {
    const subdomain = params.domain;
    const { message } = await request.json();
    
    let response: string;
    
    // Sử dụng handler tương ứng với subdomain
    switch (subdomain) {
      case 'gen8':
        response = await handleGen8Chat(message);
        break;
      case 'gen9':
        response = await handleGen9Chat(message);
        break;
      case 'vonguyen':
        response = await handleVoNguyenChat(message);
        break;
      case 'gaa':
        response = await handleGAAChat(message);
        break;
      default:
        response = `Default AI: Tôi đã nhận được tin nhắn "${message}" của bạn.`;
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