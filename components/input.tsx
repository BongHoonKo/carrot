import { InputHTMLAttributes } from "react";

interface InputProps {
    // type : string;
    // placeholder : string;
    // required : boolean;
    // ==> InputHTMLAttribute<HTMLInputElement>를 선언해서 지워줄수 있음
    name : string;
    errors? : string[];
}

export default function Input({ name, errors = [], ...rest } 
    : InputProps & InputHTMLAttributes<HTMLInputElement>) {
        console.log('rest ==> ', rest);
    return (
        <div className='flex flex-col gap-2'>
            <input name={name} className='bg-transparent rounded-md w-full h-10 focus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400' 
                {...rest} />
            { errors.map((error, idx) => (
                <span key={idx} className='text-red-500 font-medium'>{error}</span>
            )) }
        </div>
    );
}