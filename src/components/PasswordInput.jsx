import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ className = '', containerClassName = '', children, ...props }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={`relative ${containerClassName}`}>
            <input
                type={showPassword ? 'text' : 'password'}
                className={`${className} pr-12`}
                autoComplete="off"
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[50%] -translate-y-1/2 text-slate-400 hover:text-primary dark:hover:text-blue-400 transition-colors focus:outline-none p-1 z-10 bg-transparent flex items-center justify-center cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            {children}
        </div>
    );
}
