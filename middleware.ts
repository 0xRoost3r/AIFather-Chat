import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
    '/api/:path*',
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const path = url.pathname;
  
  // Xác định domain chính
  const mainDomain = 'lapnghiepvoi1trieudong.com';
  
  // Lấy các phần của domain
  const domainParts = hostname.split('.');
  
  // Xác định xem có phải là subdomain không
  let isSubdomain = false;
  let subdomain = 'gen8'; // Subdomain mặc định
  
  if (hostname.includes('localhost')) {
    // Xử lý cho môi trường development
    if (domainParts.length > 1 && domainParts[0] !== 'localhost') {
      isSubdomain = true;
      subdomain = domainParts[0];
    }
  } else if (hostname.includes(mainDomain)) {
    // Xử lý cho môi trường production
    if (domainParts.length > 2) {
      isSubdomain = true;
      subdomain = domainParts[0];
    }
  }
  
  console.log(`Middleware: hostname=${hostname}, subdomain=${subdomain}, path=${path}, isSubdomain=${isSubdomain}`);
  
  // Thêm thông tin subdomain vào header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-subdomain', subdomain);
  
  // Xử lý API routes
  if (path.startsWith('/api')) {
    // Nếu là API route và không có [domain] trong path
    if (path === '/api/chat') {
      // Rewrite đến API route với subdomain
      url.pathname = `/api/${subdomain}/chat`;
      console.log(`Rewriting API to: ${url.pathname}`);
      return NextResponse.rewrite(url);
    }
  } else {
    // Xử lý các routes khác (không phải API)
    // Không thay đổi URL path, chỉ truyền subdomain qua header
  }
  
  // Trả về response với header chứa thông tin subdomain
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
} 