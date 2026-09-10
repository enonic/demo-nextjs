import { NextRequest, NextResponse } from 'next/server';
import { getRequestLocaleInfo, decryptParams, PROJECT_ID_HEADER, JSESSIONID_HEADER } from '@enonic/nextjs-adapter';

const DRAFT_COOKIE = '__prerender_bypass';

type LocaleInfo = ReturnType<typeof getRequestLocaleInfo>;

export function proxy(request: NextRequest): NextResponse {
    const { pathname } = request.nextUrl;

    addCookiesToHeaders(request);

    const params = decryptXpParams(request);
    if (params) {
        addParamsToHeaders(request, params);
    }

    const localeInfo = getRequestLocaleInfo({ contentPath: pathname, headers: request.headers });

    // Public URLs carry no prefix for the default locale
    const canonicalUrl = withoutDefaultLocale(request, localeInfo);
    if (canonicalUrl) {
        console.debug(`Proxy at '${pathname}': redirecting to '${canonicalUrl.pathname}'`);
        return NextResponse.redirect(canonicalUrl, 308);
    }

    if (params && !request.cookies.has(DRAFT_COOKIE)) {
        return redirectToDraftMode(request);
    }

    // Route internally to /[locale]/... and drop the xp param
    const url = request.nextUrl.clone();
    url.searchParams.delete('xp');
    addLocalePrefix(url, localeInfo);

    if (url.href === request.nextUrl.href) {
        console.debug(`Proxy at '${pathname}': passing through`);
        return NextResponse.next({request});
    }

    console.debug(`Proxy at '${pathname}': rewriting to '${url.pathname}'`);
    return NextResponse.rewrite(url, { request });
}

function decryptXpParams(request: NextRequest): Record<string, string> | null {
    const xpBlob = request.nextUrl.searchParams.get('xp');
    const secret = process.env.ENONIC_API_TOKEN;
    if (!xpBlob || !secret) {
        return null;
    }

    const params = decryptParams(xpBlob, secret);
    if (!params) {
        console.debug(`Proxy at '${request.nextUrl.pathname}': failed to decrypt blob, treating as a direct request`);
    }
    return params;
}

function redirectToDraftMode(request: NextRequest): NextResponse {
    // No draft-mode cookie yet: /api/preview sets it and redirects back with the blob
    const draftUrl = request.nextUrl.clone();
    draftUrl.pathname = '/api/preview';
    draftUrl.searchParams.set('path', request.nextUrl.pathname);

    console.debug(`Proxy at '${request.nextUrl.pathname}': no draft cookie, redirecting to '${draftUrl.pathname}'`);
    return NextResponse.redirect(draftUrl);
}

function addCookiesToHeaders(request: NextRequest) {
    const jsessionid = request.cookies.get('JSESSIONID')?.value;
    if (jsessionid) {
        request.headers.set(JSESSIONID_HEADER, jsessionid);
    }
}

function addParamsToHeaders(request: NextRequest, params: Record<string, string>) {
    if (params.xpProject) {
        request.headers.set(PROJECT_ID_HEADER, params.xpProject);
    }
}

function withoutDefaultLocale(request: NextRequest, { defaultLocale }: LocaleInfo): NextRequest['nextUrl'] | null {
    const [, firstSegment, ...rest] = request.nextUrl.pathname.split('/');
    if (!defaultLocale || firstSegment !== defaultLocale) {
        return null;
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${rest.join('/')}`;
    return url;
}

function addLocalePrefix(url: NextRequest['nextUrl'], { locale, locales }: LocaleInfo): void {
    const firstSegment = url.pathname.split('/')[1];
    if (locales.includes(firstSegment) || !locale) {
        return;
    }

    // No trailing slash for the site root: with trailingSlash=false Next would 308 "/en/" to "/en", and that redirect carries no CORS headers
    url.pathname = `/${locale}${url.pathname}`.replace(/\/$/, '');
}

export const config = {
    // NB: should contain all files and folders in the /public folder
    matcher: ["/((?!robots.txt|sitemap.xml|manifest.json|api/|images/|fonts/|_next/webpack-hmr|_next/static|_next/image|assets|favicon.ico|sw.js).*)",],
};
