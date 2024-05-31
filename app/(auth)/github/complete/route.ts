import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request:NextRequest) {
    const code = request.nextUrl.searchParams.get('code');
    if(!code) {
        return notFound();
    }

    let accessTokenUrl = 'https://github.com/login/oauth/access_token';
    const accessTokenParams = new URLSearchParams({
        client_id : process.env.GITHUB_CLIENT_ID!
        , client_secret : process.env.GITHUB_CLIENT_SECRET!
        , code
    }).toString();

    accessTokenUrl = `${accessTokenUrl}?${accessTokenParams}`;

    const accessTokenResponse = await fetch(accessTokenUrl, {
        method : 'POST'
        , headers : {
            Accept : 'application/json'
        }
    });
    const {error, access_token} = await accessTokenResponse.json();

    if(error) {
        return new Response(null, {
            status: 400
        })
    }
    const userProfileResponse = await fetch('https://api.github.com/user', {
        headers : {
            "Authorization" : `Bearer ${access_token}`
        }, cache : 'no-cache'
    })

    const {id, avatar_url, login} = await userProfileResponse.json();
    const user = await db.user.findUnique({
        where : {
            github_id : id + ""
        }, select : { id : true }
    });

    if(user) {
        await sessionSave(user.id);
        return redirect('/profile');
    } else {
        const newUser = await db.user.create({
            data : {
                github_id : id + ""
                , avatar : avatar_url
                , username : login
            }, select : { id : true }
        });
    
        await sessionSave(newUser.id);
        return redirect('/profile');
    }
}

const sessionSave = async (id:number) => {
    return new Promise(async (resolve:any) => {
        const session = await getSession();
        session.id = id;
        await session.save();
        resolve();
    })
}