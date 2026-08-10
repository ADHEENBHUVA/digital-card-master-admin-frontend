import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2, UserCircle, Save, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PasswordInput from './components/PasswordInput';

export default function Profile() {
    const [formData, setFormData] = useState({
        fullName: '', mobile: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [accountInfo, setAccountInfo] = useState(null);
    const navigate = useNavigate();

    // Password State
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                });
                const data = response.data;
                setFormData({
                    fullName: data.fullName || '',
                    mobile: data.mobile || ''
                });
                setAccountInfo({
                    username: data.username,
                    role: data.role,
                    status: data.status,
                    createdAt: new Date(data.createdAt).toLocaleDateString()
                });
            } catch (err) {
                if (err.response?.status !== 401) {
                    toast.error('Failed to load profile details');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('http://localhost:5000/api/auth/profile', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error('New password and confirm password do not match.');
        }

        if (passwordData.newPassword.length < 6) {
            return toast.error('Password does not meet the required security rules.');
        }

        setPasswordSaving(true);
        try {
            await axios.post('http://localhost:5000/api/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });

            // Password changed properly, initiate auto-logout
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            toast.success('Password changed successfully. Please login again with your new password.');
            navigate('/login');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to change password.';
            if (errorMsg === 'Invalid current password') {
                toast.error('Current password is incorrect.');
            } else {
                toast.error(errorMsg);
            }
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-3 text-primary" size={32} />
            <p className="font-semibold animate-pulse tracking-wide">Loading Profile...</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-2xl">
                    <UserCircle className="text-primary dark:text-blue-400 w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                        Master Administrator Profile
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage your personal details and view account status.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Editable Profile Information */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">Personal Information</h3>
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="group">
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Full Name</label>
                            <input
                                required
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Mobile Number <span className="text-slate-300 dark:text-slate-600 font-normal ml-2 lowercase">(Optional)</span></label>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 font-bold text-white bg-gradient-to-r from-primary to-blue-600 dark:from-blue-600 dark:to-indigo-500 hover:shadow-lg hover:shadow-primary/20 rounded-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password Change Form */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4 flex items-center gap-2">
                        <KeyRound className="text-slate-400" size={20} />
                        Security Settings
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-6">

                        <div className="group">
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Current Password</label>
                            <PasswordInput
                                required
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                placeholder="Enter current password"
                                className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">New Password</label>
                                <PasswordInput
                                    required
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    placeholder="Enter new password"
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </div>

                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-primary transition-colors">Confirm New Password</label>
                                <PasswordInput
                                    required
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    placeholder="Verify new password"
                                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={passwordSaving}
                                className="px-6 py-3 font-bold text-slate-700 bg-white border border-slate-300 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none shadow-sm"
                            >
                                {passwordSaving ? <Loader2 className="animate-spin" size={18} /> : <KeyRound size={18} />}
                                {passwordSaving ? "Changing..." : "Change Password"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Account Details */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 h-fit transition-colors">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">Account Status</h3>

                    {accountInfo && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Username / Email</p>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{accountInfo.username}</p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Role Permissions</p>
                                <p className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 font-bold text-sm tracking-wide">
                                    {accountInfo.role.replace('_', ' ')}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                                <p className="inline-flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                    {accountInfo.status.toUpperCase()}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Joined Date</p>
                                <p className="font-medium text-slate-600 dark:text-slate-300">{accountInfo.createdAt}</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
