import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShieldCheck, Sun, Moon } from 'lucide-react';
import useTheme from './hooks/useTheme';
import PasswordInput from './components/PasswordInput';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + '/api/auth/login', { username, password });

            if (response.data.role !== 'MASTER_ADMIN') {
                toast.error('Not authorized as Master Admin');
                return;
            }

            localStorage.setItem('adminToken', response.data.token);
            localStorage.setItem('adminUser', JSON.stringify(response.data));

            toast.success('Login Successful');
            navigate('/sub-admins');
        } catch (error) {
            toast.dismiss();
            toast.error(error.response?.data?.message || 'Login Failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-200 dark:from-indigo-900 dark:via-purple-900 dark:to-slate-900 relative overflow-hidden transition-colors duration-500">

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 p-3 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-full shadow-lg border border-white/60 dark:border-slate-700 hover:scale-110 transition-transform text-indigo-600 dark:text-slate-200 z-50"
            >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>

            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 dark:bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 dark:opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 dark:bg-indigo-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 dark:opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-50 dark:opacity-30 animate-blob animation-delay-4000"></div>

            <div className="bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_#0000001a] dark:shadow-2xl w-full max-w-md relative z-10 mx-4 border border-white/60 dark:border-white/10 transition-colors duration-500">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                        <ShieldCheck className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white text-center tracking-tight transition-colors">Master Admin</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm transition-colors">Sign in to control the system</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white/50 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all peer"
                            placeholder="Username"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                        />
                        <label className="absolute left-4 -top-2.5 text-sm text-indigo-600 dark:text-purple-300 bg-white/80 dark:bg-[#151f38] px-2 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 dark:peer-placeholder-shown:text-slate-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-indigo-600 dark:peer-focus:text-purple-300 peer-focus:bg-white dark:peer-focus:bg-[#151f38] rounded pointer-events-none backdrop-blur-sm">
                            Username
                        </label>
                    </div>

                    <PasswordInput
                        required
                        containerClassName="group"
                        className="w-full px-4 py-3 bg-white/50 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all peer"
                        placeholder="Password"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                    >
                        <label className="absolute left-4 -top-2.5 text-sm text-indigo-600 dark:text-purple-300 bg-white/80 dark:bg-[#151f38] px-2 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-500 dark:peer-placeholder-shown:text-slate-400 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-indigo-600 dark:peer-focus:text-purple-300 peer-focus:bg-white dark:peer-focus:bg-[#151f38] rounded pointer-events-none backdrop-blur-sm">
                            Password
                        </label>
                    </PasswordInput>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl py-3.5 font-bold tracking-wide hover:shadow-lg hover:shadow-purple-500/30 hover:scale-[1.02] transform transition-all active:scale-[0.98]"
                    >
                        Secure Login
                    </button>
                </form>
            </div>
        </div>
    );
}
