import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, adminRoutes } from '@/config/routes.config';

function getRoleFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const base64Url = payload;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    
    if (parsed.roles && Array.isArray(parsed.roles) && parsed.roles.length > 0) {
      return parsed.roles[0];
    }
    return null;
  } catch (e) {
    console.error('Failed to parse token in middleware/proxy:', e);
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { nextUrl } = request;

  // Check if the user is logged in by verifying the existence of a token in cookies
  // Adjust 'accessToken' to whatever cookie name you will use to store the token
  const token = request.cookies.get('accessToken')?.value;
  const isLoggedIn = !!token;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  
  // Public routes might have dynamic parameters (like /products/[id]), 
  // so we check if the path starts with a public route or matches exactly.
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/') return nextUrl.pathname === '/';
    return nextUrl.pathname.startsWith(route);
  });

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.some(route => nextUrl.pathname.startsWith(route));

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Redirect admin users accessing public routes (like Homepage) or auth routes
  if (isLoggedIn) {
    const role = token ? getRoleFromToken(token) : null;
    if (role === 'ADMIN') {
      if (nextUrl.pathname === '/' || isAuthRoute) {
        return NextResponse.redirect(new URL('/admin', nextUrl));
      }
    }
  }

  // If trying to access an auth route (login/register) while already logged in
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  // If not logged in and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute) {
    // Save the original URL to redirect back after login
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  // If logged in and trying to access an admin route
  if (isAdminRoute && isLoggedIn) {
    const role = token ? getRoleFromToken(token) : null;
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
  }

  return NextResponse.next();
}

// Optionally, configure the matcher to apply proxy only to specific paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
