import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要认证的路由
const protectedRoutes = ['/posts', '/tags', '/comments', '/users'];
const authRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 获取token
  const token = request.cookies.get('token')?.value;
  
  // 检查是否是受保护的路由
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // 检查是否是认证相关路由
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // 根路径重定向到登录页
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // 如果访问受保护路由但没有token，重定向到登录页
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // 如果已登录用户访问登录页，重定向到dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/posts', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};