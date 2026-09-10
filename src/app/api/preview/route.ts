import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';
import { validatePath, validateBlob } from '../../../utils';

export function HEAD(req: NextRequest) {
    return processRequest(req);
}

export function GET(req: NextRequest) {
    return processRequest(req);
}

export async function processRequest(request: NextRequest): Promise<NextResponse> {
    const {searchParams} = request.nextUrl;
    const xpBlob = searchParams.get('xp');
    const path = searchParams.get('path') || '/';

    const blob = validateBlob(xpBlob);
    if (!blob.ok) {
        return blob.response;
    }

    const pathResponse = validatePath(path);
    if (pathResponse !== null) {
        return pathResponse;
    }

    // Enable Next.js draft mode (sets __prerender_bypass cookie)
    (await draftMode()).enable();

    // Redirect back to the content page, preserving the encrypted blob
    // so the middleware can decrypt it on the second pass.
    const redirectUrl = new URL(path, request.nextUrl.origin);
    if (xpBlob) {
        redirectUrl.searchParams.set('xp', xpBlob);
    }

    const response = NextResponse.redirect(redirectUrl);

    console.info(`Preview route at [${path}], set cookie and redirecting to [${redirectUrl.pathname}]...`);

    return response;
}
