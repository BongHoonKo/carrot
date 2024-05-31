"use server";
import { redirect } from 'next/navigation';
import { z } from 'zod';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import getSession from '@/lib/session';

const checkEmailExist = async (email:string) => {
    const user = await db.user.findUnique({
        where : {
            email,
        }
    });

    return Boolean(user);
}

const formSchema = z.object({
    email : z.string().email().toLowerCase()
            .refine(checkEmailExist, "An account with this email does not exist.")
    , password : z.string({ required_error : 'Password is required' })
                // .min(PASSWORD_MIN_LENGTH)
                // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
});

export async function handleLogin(prevState : any, formData: FormData) {
    console.log(prevState);
    const data = {
        email : formData.get('email')
        , password : formData.get('password')
    };
    await new Promise(resolve => setTimeout(resolve, 1000));
    // console.log('data ==> ', formData.get('email'), formData.get('password'));

    const result = await formSchema.safeParseAsync(data);
    if(!result.success) {
        console.log('Login result ==> ', result.error.flatten());
        return result.error.flatten();
    } else {
        console.log('result data ==> ', result.data);
        // Find a user with the email
        // if the user is found, check password hash
        // log the user in
        // redirect "/profile"

        const user = await db.user.findUnique({
            where : {
                email : result.data.email
            }, select : { id : true, password : true }
        });

        const ok = await bcrypt.compare(result.data.password, user!.password ?? "");
        console.log('ok ==> ', ok);
        if(ok) {
            const session = await getSession();
            session.id = user!.id;
            await session.save();
            redirect('/profile');
        } else {
            return {
                fieldErrors : {
                    password : ['Wrong Password.']
                    , email : []
                }
            }
        }
    }
    // return { 
    //     errors : ['Wrong Passsword', 'password too short']
    // }
    // redirect('/');
}