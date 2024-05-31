"use server";

import { z } from "zod";
import validator from 'validator';
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from 'crypto';
import getSession from "@/lib/session";
import twilio from 'twilio';

const phoneSchema = z.string().trim()
                    .refine(phone => validator.isMobilePhone(phone, 'ko-KR'), 'Wrong Phone Format');

const tokenSchema = z.coerce.number().min(100000).max(999999)
                    .refine(tokenExists, 'This token does not exist');

async function tokenExists(token:number) {
    const exists = await db.sMSToken.findUnique({
        where : {
            token : token.toString()
        }, select : {
            id : true
        }
    });

    return Boolean(exists);
}

interface ActionState {
    token : boolean
}

async function createToken() {
    const token = crypto.randomInt(100000, 999999).toString();
    const exists = await db.sMSToken.findUnique({
        where : {
            token,
        }, select : { id: true }
    });

    if(exists) {
        return createToken();
    } else return token;
}

export async function handleSMSLogin(prevState : ActionState, formData : FormData) {
    const phone = formData.get('phone');
    const token = formData.get('token');

    if(!prevState.token) {
        const result = phoneSchema.safeParse(phone);
        if(!result.success) {
            console.log('Error ==> ', result.error.flatten());
            return { token : false, error : result.error.flatten() }
        } else {
            // 해당 Phone number를 가지고 있는 User의 sMSToken 전부 제거
            await db.sMSToken.deleteMany({
                where : {
                    user : {
                        phone : result.data
                    }
                }
            });

            const token = await createToken();
            await db.sMSToken.create({
                data : {
                    token,
                    user : {
                        // 해당 Phone 넘버를 가지고 있는 유저가 있다면 sMSToken에 연결
                        // 만약 없다면 새 user 생성 후 연결
                        connectOrCreate : {
                            where : {
                                phone : result.data
                            },
                            create : {
                                username : crypto.randomBytes(10).toString('hex')
                                , phone : result.data
                            }
                        }
                    }
                }
            })

            const client = twilio(
                'AC88fa5fb9a8e1a792ed62b064b2808121',
                '2c41dd70e07f136bcf1f6ca569cbd8f4'
            );
            await client.messages.create({
                body : `Your Karrot verification code is ${token}`
                , from : process.env.TWILIO_PHONE_NUMBER!
                , to : '+821033039838'
            });

            return { token : true, }
        }
    } else {
        const result = await tokenSchema.safeParseAsync(token);
        if(!result.success) {
            return { token : true, error : result.error.flatten() }
        } else {
            const token = await db.sMSToken.findUnique({
                where : {
                    token : result.data.toString()
                }, select : { 
                    id : true 
                    , userId : true
                }
            });

            //if(token) {
                const session = await getSession();
                session.id = token?.userId;

                await session.save();
                await db.sMSToken.delete({
                    where : {
                        id : token?.id
                    }
                })
            // }
            redirect('/profile');
        }
    }
}