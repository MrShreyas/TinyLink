import { NextResponse } from 'next/server';



export async function POST(req: Request) {
    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('auth_token', '', { httpOnly: true, secure: true, maxAge: 0 });

    return response;
}
