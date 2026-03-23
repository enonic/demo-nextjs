import {NextRequest, NextResponse} from 'next/server';
import {draftMode} from 'next/headers';
import {validatePath} from '../../../utils';
import {decryptParams} from '@enonic/nextjs-adapter';

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
    const secret = process.env.ENONIC_API_TOKEN;

    if (!xpBlob || !secret) {
        return NextResponse.json({message: 'Invalid request'}, {status: 401});
    }

    // Decryption success proves the request came from XP (it knows the secret)
    const params = decryptParams(xpBlob, secret);
    if (!params) {
        return NextResponse.json({message: 'Invalid secret'}, {status: 401});
    }

    let response = validatePath(path);
    if (response !== null) {
        return response;
    }

    // Enable Next.js draft mode (sets __prerender_bypass cookie)
    (await draftMode()).enable();

    // Redirect back to the content page, preserving the encrypted blob
    // so the middleware can decrypt it on the second pass.
    const redirectUrl = new URL(path, request.nextUrl.origin);
    redirectUrl.searchParams.set('xp', xpBlob);

    response = NextResponse.redirect(redirectUrl);

    console.info(`Preview route at [${path}], set cookie and redirecting to [${redirectUrl.pathname}]...`);

    // Override __prerender_bypass with SameSite=None; Secure so the cookie works
    // inside cross-origin iframes (Content Studio runs on a different origin).
    /*    const cookieStore = await cookies();
        const bypassValue = cookieStore.get('__prerender_bypass')?.value;
        if (bypassValue) {
            response.cookies.set('__prerender_bypass', bypassValue, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                path: '/',
            });
        }*/

    return response;
}
