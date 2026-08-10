import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle } from 'lucide-react';
import PasswordInput from './components/PasswordInput';

export default function AddSubAdmin() {
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        password: '',
        email: '',
        mobile: '',
        companyName: '',
        designation: '',
        themeColor: '#6366f1' // Defaults to primary
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Enforce Email Format for Username
        if (!formData.username.includes('@') || !formData.username.includes('.')) {
            return toast.error('Username must be a valid email format containing "@" and "."');
        }

        try {
            const response = await axios.post('http://localhost:5000/api/admin/sub-admins', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            toast.success('Sub Admin created successfully!');
            toast.info(`Created Username: ${response.data.username}`);
            navigate('/sub-admins');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error creating sub admin');
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden relative transition-colors">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-2xl">
                        <UserPlus className="text-primary w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                            Create Sub Admin
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Provision a new account with dashboard access.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Section: Credentials */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 pb-2">Credentials</h3>

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors">Full Name</label>
                                    <input
                                        type="text" name="fullName" value={formData.fullName} onChange={handleChange} required
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors">
                                        Username (Email Required, @ and .)
                                    </label>
                                    <input
                                        type="email" name="username" value={formData.username} onChange={handleChange} required
                                        pattern=".+@.+\..+" title="Must be a valid email format containing '@' and '.'"
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:focus:ring-rose-500/40 focus:border-rose-500 transition-all shadow-sm"
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors">
                                        Assigned Password
                                    </label>
                                    <PasswordInput
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Set initial password..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Profile */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700 pb-2">Profile Details</h3>

                            <div className="space-y-4">
                                <div className="group">
                                    <label className="block text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors">Contact Email</label>
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleChange} required
                                        className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="block text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors">Company</label>
                                        <input
                                            type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors">Designation</label>
                                        <input
                                            type="text" name="designation" value={formData.designation} onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="group md:col-span-2">
                                        <label className="block text-slate-600 dark:text-slate-400 text-sm font-semibold mb-2 group-focus-within:text-primary dark:group-focus-within:text-blue-400 transition-colors">Mobile No.</label>
                                        <input
                                            type="text" name="mobile" value={formData.mobile} onChange={handleChange}
                                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/40 focus:border-primary transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                        Create Sub Admin
                    </button>
                </form>
            </div>
        </div>
    );
}
