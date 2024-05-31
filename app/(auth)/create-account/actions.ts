"use server";
import { z } from 'zod';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';

const checkUsername = (username:string) => 
        !username.includes('potato');

const checkPassword = ({ password, confirm_password } : { password:string, confirm_password:string }) => 
        password === confirm_password;

// const checkUniqueUsername = async (username:string) => {
//     const user = await db.user.findUnique({
//         where : {
//             username,
//         }, select : {
//             id : true
//         }
//     });

//     return !Boolean(user);
// }

// const checkUniqueEmail = async (email:string) => {
//     const user = await db.user.findUnique({
//         where : {
//             email,
//         },
//         select : {
//             id : true
//         }
//     });

//     return !Boolean(user);
// }

// 여기에 선언되면 기본이 required => 선택으로 바꾸고 싶으면 .optional() 
// refine(username => 첫 arg가 true 이면 문제 없음, false이면 두번째 arg에 있는 문구를 error로 출력, 'error msg');
const formSchema = z.object({
    username : z.string({
        invalid_type_error : 'Username 타입을 확인하세여'
        , required_error : 'Username 어디갔음?'
    }).min(5, "너무 짧다").max(10, "너무 길다").toLowerCase().trim()
    //.transform(username => `❤️${username}❤️`) // 제출이 될때 무조건 해당 text로 변환
    .refine(username => checkUsername(username), "potato는 유효하지 않습니다.")
    // .refine(checkUniqueUsername, "This username is already taken.")

    , email : z.string().email().trim().toLowerCase()//.refine(checkUniqueEmail, "Thie email is alreay used.")

    , password : z.string().min(PASSWORD_MIN_LENGTH)
    //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
    , confirm_password : z.string().min(PASSWORD_MIN_LENGTH)
}).superRefine(async (data, ctx) => {
    const user = await db.user.findUnique({
        where : {
            username : data.username
        }, select : { id : true }
    });

    if(user) {
        ctx.addIssue({
            code : 'custom'
            , message : 'This username is alraedy used.'
            , path : ['username']
            , fatal : true
        });
        return z.NEVER;

        // fatal : true 및 return z.NEVER;를 설정하면 이 뒤에 나오는 refine은 실행 X
    }
}).superRefine(async ({email}, ctx) => {
    const user = await db.user.findUnique({
        where : {
            email
        }, select : { id : true }
    });

    if(user) {
        ctx.addIssue({
            code : 'custom'
            , message : 'This email is alraedy used.'
            , path : ['email']
            , fatal : true
        });
        return z.NEVER;

        // fatal : true 및 return z.NEVER;를 설정하면 이 뒤에 나오는 refine은 실행 X
    }
}).refine(checkPassword, {
    message : '비밀번호가 서로 일치하지 않습니다.'
    , path: ["confirm_password"]
}); // object 자체에 refine 설정해서 에러를 뱉으면, fieldErrors가 아닌 formErrors로 빠져서 특정 필드에 할당 할 수 없음..
    // 그래서 두번째 인자를 Object로 만들고 message 및 path를 설정하면 됨

export async function createAccount(prevState:any, formData:FormData) {
    const data = {
        username : formData.get('username')
        , email : formData.get('email')
        , password : formData.get('password')
        , confirm_password : formData.get('confirm_password')
    };

    const result = await formSchema.safeParseAsync(data);
    console.log('Parse Result ==> ', result);
    if(!result.success) {
        console.log('Error ==> ', result.error.flatten());
        return result.error.flatten();
    } else {
        console.log('Result Data ==> ', result.data);
        // Check if username already exist
        // Check if the email is already used
        // hash password
        // save the user to db
        // log the user in
        // redirect home
        const hashedPassword = await bcrypt.hash(result.data.password, 12);
        console.log('hashedPassword ==> ', hashedPassword);
{}
        const user = await db.user.create({
            data : {
                username : result.data.username
                , email : result.data.email
                , password : hashedPassword
            },
            select : {
                id : true
            }
        });

        console.log("Created User ==> ", user);

        const session = await getSession();

        //@ts-ignore
        session.id = user.id;
        await session.save();

        redirect('/profile');
    }
    
    /* Schema를 parse하면 Error를 throw해서 try-catch문으로 에러를 잡아야함 */
    // try {
    //     formSchema.parse(data);
    // } catch(error) {
    //     console.error(error);
    // }
}