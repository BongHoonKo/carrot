import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key:string] : boolean
}

const publicOnlyUrls: Routes = {
    "/" : true
    , "/login" : true
    , "/sms" : true
    , "/create-account" : true
    , "/github/start" : true
    , "/github/complete" : true
}

export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname];
    if(!session.id) {
        if(!exists) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        if(exists) {
            return NextResponse.redirect(new URL("/profile", request.url));
        }
    }

    // if(request.nextUrl.pathname === "/profile") {
    //     return Response.redirect(new URL("/", request.url));
    // }
    
    // const pathname = request.nextUrl.pathname;
    // if(pathname === "/") {
    //     const response = NextResponse.next();
    //     response.cookies.set("middleware-cookie", 'hello');
    //     return response;
    // }
}

export const config = {
    // matcher: ["/", "/create-account", "/profile/:path*"]
    matcher : ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}