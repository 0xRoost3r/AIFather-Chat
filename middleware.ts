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
  
  // Xử lý cho localhost development
  if (hostname.includes('localhost')) {
    // Lấy subdomain từ hostname (ví dụ: vonguyen.localhost:3001 -> vonguyen)
    const subdomain = hostname.split('.')[0];
    
    // Bỏ qua nếu không có subdomain hoặc là localhost
    if (!subdomain || subdomain === 'localhost') {
      return NextResponse.next();
    }
    
    console.log(`Middleware detected hostname: ${hostname}, subdomain: ${subdomain}, path: ${path}`);
    
    // Xử lý API routes
    if (path.startsWith('/api')) {
      // Nếu là API route và không đã có subdomain trong path
      if (!path.startsWith(`/api/${subdomain}`)) {
        // Thêm subdomain vào API path
        const newPath = path.replace('/api', `/api/${subdomain}`);
        url.pathname = newPath;
        
        console.log(`Rewriting API to: ${url.pathname}`);
        return NextResponse.rewrite(url);
      }
    } else {
      // Xử lý các routes khác (không phải API)
      const newPath = path === '/' ? `/${subdomain}` : `/${subdomain}${path}`;
      url.pathname = newPath;
      
      console.log(`Rewriting to: ${url.pathname}`);
      return NextResponse.rewrite(url);
    }
  }
  
  return NextResponse.next();
} 