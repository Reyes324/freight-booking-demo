import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查登录状态（通过 Cookie）
  const authCookie = request.cookies.get('auth');
  const isLoggedIn = authCookie?.value === 'true';

  // 未登录访问后台管理系统 → 跳转到后台登录页
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 已登录访问后台登录页 → 跳转到后台首页
  if (pathname === '/admin/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/orders', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有路径，排除静态资源和 API
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.).*)',
  ],
};
