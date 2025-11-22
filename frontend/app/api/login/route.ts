import { NextResponse } from 'next/server';



export async function POST(req: Request) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const response = NextResponse.json({ message: 'Login successful' });
    // Set cookie explicitly. On Vercel this response will be sent from the frontend origin.
    // Use SameSite/secure options appropriate for your environment.
    response.cookies.set('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
        maxAge: 7 * 24 * 60 * 60
    });

    return response;
}
