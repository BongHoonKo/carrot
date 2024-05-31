"use client";

import Button from '@/components/button';
import Input from '@/components/input';

export default function Login() {
    const onClick = async () => {
        const res = await fetch('/api/users', {
            method : 'POST'
            , body : JSON.stringify({
                username : 'nico'
                , password : '1234'
            })
        });

        console.log(await res.json());
    }

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className='flex flex-col gap-2 *:font-medium'>
                <h1 className='text-2xl'>안녕하세요!</h1>
                <h2 className='text-xl'>Login with email and password.</h2>
            </div>
            
            <form className='flex flex-col gap-3'>
                <Input required type="email" placeholder='Email' errors={[]}/>
                <Input required type="password" placeholder='Password' errors={[]}/>
            </form>

            <span onClick={onClick}>
                <Button loading={false} text="Login"/>
            </span>
        </div>
    );
}