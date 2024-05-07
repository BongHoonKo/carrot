"use client";

import Button from '@/components/button';
import Input from '@/components/input';
import { useFormState } from 'react-dom';
import { handleSMSLogin } from './actions';

const initialState = {
    token : false,
    error : undefined
}

export default function SMSLogin() {
    const [state, action] = useFormState(handleSMSLogin, initialState);

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className='flex flex-col gap-2 *:font-medium'>
                <h1 className='text-2xl'>SMS Login!</h1>
                <h2 className='text-xl'>Verify your phone number</h2>
            </div>
            
            <form className='flex flex-col gap-3' action={action}>
                { state.token ? 
                    <Input 
                        required 
                        name="token" 
                        type="number" 
                        placeholder='Verification Code' 
                        errors={state.error?.formErrors || []}
                        min={100000} 
                        max={999999} />
                    : 
                    <Input 
                        required 
                        name="phone" 
                        type="text" 
                        placeholder='Phone Number' 
                        errors={state.error?.formErrors || []} />
                }
                <Button text={state.token ? 'Verify Token' : 'Send Verification SMS'} />
            </form>
        </div>
    );
}