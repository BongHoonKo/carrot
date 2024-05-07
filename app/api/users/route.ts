import { NextRequest } from 'next/server';

export async function GET(request:NextRequest) {
    console.log(request);
    return Response.json({ 
        ok : true
    });
}

export async function POST(request:NextRequest) {
    // Cookie 얻는방법 : request.cookies.get("");
    const data = await request.json();
    console.log(data);
    return Response.json(data);
}