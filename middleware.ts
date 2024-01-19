import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set("userid", "alvinzhengq");

    return response
}