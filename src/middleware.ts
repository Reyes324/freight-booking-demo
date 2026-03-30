import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const mode = process.env.NEXT_PUBLIC_APP_MODE;
  const { pathname } = request.nextUrl;

  // 本地开发不限制
  if (!mode || mode === 'dev') {
    return NextResponse.next();
  }

  // 后台运营模式：只允许 /admin/*，其他重定向到 /admin/orders
  if (mode === 'admin') {
    if (!pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/orders', request.url));
    }
  }

  // 企业下单模式：禁止访问 /admin/*，返回 404
  if (mode === 'customer') {
    if (pathname.startsWith('/admin')) {
      return NextResponse.rewrite(new URL('/not-found', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有路径，排除静态资源和 API
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.).*)',
  ],
};
