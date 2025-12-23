import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/tasks', '/universities', '/tests', '/activities', '/honors', '/essays', '/recommendations', '/quiz-results', '/settings'];

// Auth routes (login, signup, etc.)
const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Routes that should NOT have i18n (no locale prefix)
const nonLocaleRoutes = [
  '/dashboard', '/tasks', '/universities', '/tests', '/activities',
  '/honors', '/essays', '/recommendations', '/quiz-results', '/settings',
  '/login', '/signup', '/forgot-password', '/reset-password',
  '/admin', '/quiz', '/careers', '/10resources', '/collegetv',
  '/privacy', '/terms', '/results'
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // Static files
  ) {
    return NextResponse.next();
  }

  // Check if this is a non-locale route (should not have i18n prefix)
  const isNonLocaleRoute = nonLocaleRoutes.some(route => pathname.startsWith(route));

  // Only apply i18n middleware for locale routes (landing page, career-quiz under locale)
  const response = isNonLocaleRoute ? NextResponse.next() : intlMiddleware(request);

  // Extract pathname without locale for auth checks
  const pathnameWithoutLocale = pathname.replace(/^\/(en|uz|ru)/, '') || '/';

  // Check if this route needs auth checking
  const isProtectedRoute = protectedRoutes.some(route => pathnameWithoutLocale.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathnameWithoutLocale.startsWith(route));

  // Skip auth check for non-protected, non-auth routes
  if (!isProtectedRoute && !isAuthRoute) {
    return response;
  }

  // Get current locale from URL
  const localeMatch = pathname.match(/^\/(en|uz|ru)/);
  const locale = localeMatch ? localeMatch[1] : defaultLocale;

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error && isProtectedRoute) {
      const redirectUrl = new URL(`/login`, request.url);
      redirectUrl.searchParams.set('redirect', pathnameWithoutLocale);
      return NextResponse.redirect(redirectUrl);
    }

    if (isProtectedRoute && !user) {
      const redirectUrl = new URL(`/login`, request.url);
      redirectUrl.searchParams.set('redirect', pathnameWithoutLocale);
      return NextResponse.redirect(redirectUrl);
    }

    if (isAuthRoute && user) {
      return NextResponse.redirect(new URL(`/dashboard`, request.url));
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)',
  ],
};
