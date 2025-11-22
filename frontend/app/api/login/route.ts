import { NextResponse } from 'next/server';



export default async function POST(req: Request) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set('auth_token', token, { httpOnly: true, secure: true });

    return response;
}
