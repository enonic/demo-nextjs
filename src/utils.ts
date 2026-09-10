import { NextResponse } from 'next/server';
import type { LocaleMapping } from '@enonic/nextjs-adapter';
import { decryptParams, getLocaleMappingByProjectId } from '@enonic/nextjs-adapter';

export type XpParams = Record<string, string> & { xpProject?: string };

export type BlobResult = { ok: true; params: XpParams } | { ok: false; response: NextResponse };

export function validateBlob(blob: string | null): BlobResult {
    const secret = process.env.ENONIC_API_TOKEN;

    if (!blob || !secret) {
        return { ok: false, response: NextResponse.json({ message: 'Invalid request' }, { status: 401 }) };
    }

    // Decryption success proves the request came from XP (it knows the secret)
    const params = decryptParams(blob, secret);
    if (!params) {
        return { ok: false, response: NextResponse.json({ message: 'Invalid secret' }, { status: 401 }) };
    }

    return { ok: true, params };
}

export function validatePath(path: string | string[] | null): NextResponse | null {
    // If the slug doesn't exist prevent preview mode from being enabled
    if (path === null || path === undefined) {
        return NextResponse.json({message: 'Invalid path'}, {
            status: 400,
        });
    }
    return null;
}

export function resolveProjectMapping(projectId?: string | null): LocaleMapping | undefined {
    return getLocaleMappingByProjectId(projectId ?? undefined, false);
}
