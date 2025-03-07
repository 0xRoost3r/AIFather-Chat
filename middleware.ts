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
    // Ví dụ: gen8.lapnghiepvoi1trieudong.com -> ['gen8', 'lapnghiepvoi1trieudong', 'com']
    if (domainParts.length > 2) {
      isSubdomain = true;
      subdomain = domainParts[0];
    }
  }
  
  console.log(`Middleware: hostname=${hostname}, subdomain=${subdomain}, path=${path}, isSubdomain=${isSubdomain}`);
  
  // Thêm thông tin subdomain vào header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-subdomain', subdomain);
  
  // Trả về response với header chứa thông tin subdomain
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
} 