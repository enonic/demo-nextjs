import {NextResponse, NextRequest} from 'next/server';
import {decryptParams} from '@enonic/nextjs-adapter';

const MAPPINGS = [
    {
        sources: ['/.*'],
        target: '/${_path}',
    },
];

export function GET(request: NextRequest) {
    const {searchParams} = request.nextUrl;
    const xpBlob = searchParams.get('xp');
    const secret = process.env.ENONIC_API_TOKEN;

    if (!xpBlob || !secret) {
        return NextResponse.json({message: 'Invalid request'}, {status: 401});
    }

    // Decryption success proves the request came from XP (it knows the secret)
    const params = decryptParams(xpBlob, secret);
    if (!params) {
        return NextResponse.json({message: 'Invalid secret'}, {status: 401});
    }

    return NextResponse.json({mappings: MAPPINGS});
}
