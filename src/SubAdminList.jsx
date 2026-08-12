import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Key, Trash2, Link, ExternalLink, Loader2, ShieldCheck, Mail, Download, FileText, Edit, X, Image as ImageIcon, Layout, Phone, Share2, UploadCloud, Eye, Smartphone } from 'lucide-react';
import jsPDF from 'jspdf';
import PasswordInput from './components/PasswordInput';
import DigitalCardConfig from './components/DigitalCardConfig';

export default function SubAdminList() {
    const [subAdmins, setSubAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editModalType, setEditModalType] = useState('profile');
    const [currentEdit, setCurrentEdit] = useState(null);
    const [editForm, setEditForm] = useState({
        fullName: '', email: '', mobile: '', companyName: '', designation: '', newPassword: '', confirmNewPassword: '',
        contact: { phone: '', whatsapp: '', website: '', maps: '', email: '' },
        socialLinks: { facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '' }
    });
    const [updating, setUpdating] = useState(false);

    const fetchSubAdmins = async () => {
        try {
            const response = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/sub-admins', {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            setSubAdmins(response.data);
        } catch (error) {
            toast.error('Failed to load sub admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubAdmins();
    }, []);



    const handleDelete = async (id, un) => {
        if (!window.confirm(`Are you certain you want to delete ${un}?`)) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/sub-admins/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            toast.success(`${un} deleted successfully.`);
            setSubAdmins(subAdmins.filter(admin => admin._id !== id));
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const openEditModal = (admin, type = 'profile') => {
        setCurrentEdit(admin);
        setEditModalType(type);
        setEditForm({
            fullName: admin.fullName || '',
            email: admin.email || '',
            mobile: admin.mobile || '',
            companyName: admin.profile?.companyName || '',
            designation: admin.profile?.designation || '',
            newPassword: '',
            confirmNewPassword: '',
            profile: {
                photo: admin.profile?.photo || '',
                coverImage: admin.profile?.coverImage || '',
                description: admin.profile?.description || ''
            },
            contact: {
                phone: admin.contact?.phone || '',
                whatsapp: admin.contact?.whatsapp || '',
                website: admin.contact?.website || '',
                maps: admin.contact?.maps || '',
                email: admin.contact?.email || ''
            },
            socialLinks: {
                facebook: admin.socialLinks?.facebook || '',
                instagram: admin.socialLinks?.instagram || '',
                youtube: admin.socialLinks?.youtube || '',
                linkedin: admin.socialLinks?.linkedin || '',
                twitter: admin.socialLinks?.twitter || ''
            }
        });
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setCurrentEdit(null);
    };

    const handleUpdateChange = (e, section) => {
        if (section) {
            setEditForm({ ...editForm, [section]: { ...editForm[section], [e.target.name]: e.target.value } });
        } else {
            setEditForm({ ...editForm, [e.target.name]: e.target.value });
        }
    };

    const handleFileChange = (e, name) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setEditForm(prev => ({
                ...prev,
                profile: { ...prev.profile, [name]: reader.result }
            }));
        };
        reader.readAsDataURL(file);
    };

    const submitUpdate = async (e) => {
        e.preventDefault();

        if (editForm.newPassword) {
            if (editForm.newPassword !== editForm.confirmNewPassword) {
                toast.error("New password and confirm password do not match.");
                return;
            }
            if (editForm.newPassword.length < 6) {
                toast.error("Password must be at least 6 characters long.");
                return;
            }
        }

        setUpdating(true);
        try {
            const payload = {
                fullName: editForm.fullName,
                email: editForm.email,
                mobile: editForm.mobile,
                profile: {
                    companyName: editForm.companyName,
                    designation: editForm.designation,
                    photo: editForm.profile?.photo,
                    coverImage: editForm.profile?.coverImage,
                    description: editForm.profile?.description
                },
                contact: editForm.contact,
                socialLinks: editForm.socialLinks
            };

            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/sub-admins/${currentEdit._id}`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });

            if (editForm.newPassword) {
                await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/sub-admins/${currentEdit._id}/reset-password`,
                    { newPassword: editForm.newPassword },
                    { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
                );
            }

            toast.success("Profile Updated Successfully!");
            // Update local state without fetching again for smooth UI
            setSubAdmins(subAdmins.map(admin => admin._id === currentEdit._id ? response.data : admin));
            closeEditModal();
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setUpdating(false);
        }
    };

    const handleDownloadPdf = (qrCodeUrl, username) => {
        try {
            const doc = new jsPDF();
            doc.setFontSize(22);
            doc.text(`${username.toUpperCase()} - Business Card`, 105, 30, { align: "center" });

            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = `${import.meta.env.VITE_API_URL}${qrCodeUrl}`;

            img.onload = () => {
                doc.addImage(img, 'PNG', 55, 50, 100, 100);
                doc.save(`${username}_QR_Code.pdf`);
                toast.success("PDF Generated Successfully!");
            };
            img.onerror = () => {
                toast.error("Failed to load QR image for PDF");
            };
        } catch (error) {
            toast.error("Error creating PDF");
        }
    };

    const handleDownloadPng = async (qrCodeUrl, username) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}${qrCodeUrl}`);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${username}_QR_Code.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            toast.success("PNG Downloaded!");
        } catch (error) {
            toast.error("Failed to download PNG");
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        const words = name.trim().split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return words[0][0].toUpperCase();
    };

    if (loading) return (
        <div className="h-[80vh] flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mb-4 text-primary" size={40} />
            <p className="text-lg font-medium animate-pulse">Loading Sub Admins...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex-wrap gap-4 transition-colors">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-300 tracking-tight">System Users</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all Sub Admins and their access privileges.</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                    <ShieldCheck size={20} /> Total: {subAdmins.length}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden w-full transition-colors">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-100 dark:border-slate-700 uppercase tracking-wider font-semibold">
                                <th className="p-5 font-semibold">Administrator</th>
                                <th className="p-5 font-semibold">Company / Contact</th>
                                <th className="p-5 font-semibold">Digital Assets</th>
                                <th className="p-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {subAdmins.length === 0 ? (
                                <tr><td colSpan="4" className="p-12 text-center text-slate-500 dark:text-slate-400">No Sub Admins generated yet.</td></tr>
                            ) : subAdmins.map((admin) => (
                                <tr key={admin._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-4">
                                            {admin.profile?.photo ? (
                                                <img src={admin.profile.photo.startsWith('http') ? admin.profile.photo : `${import.meta.env.VITE_API_URL}${admin.profile.photo}`} alt={admin.fullName} className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white dark:border-slate-800" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm border-2 border-white dark:border-slate-800 flex items-center justify-center text-white font-bold text-lg tracking-wider">
                                                    {getInitials(admin.fullName)}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 dark:text-white text-lg">{admin.fullName}</span>
                                                <span className="flex items-center gap-2 mt-1">
                                                    <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 rounded-md text-xs font-medium tracking-wide">
                                                        {admin.username}
                                                    </span>
                                                    {admin.status === 'active' ? (
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                                    ) : (
                                                        <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col text-sm text-slate-600 dark:text-slate-300 space-y-1">
                                            <span className="font-medium text-slate-800 dark:text-slate-200">{admin.profile?.companyName || 'No Company'}</span>
                                            <span className="flex items-center gap-1.5"><Mail size={14} className="text-slate-400 dark:text-slate-500" /> {admin.email || admin.username}</span>
                                            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1"><ShieldCheck size={12} /> LP: {admin.views?.landingPage || 0}</span>
                                                <span className="flex items-center gap-1"><ShieldCheck size={12} /> Card: {admin.views?.digitalCard || 0}</span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-[10px] text-slate-400 font-medium tracking-wide">
                                            LAST UPDATED: {new Date(admin.updatedAt).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-2 flex-wrap text-sm">
                                            {admin.qrCodeUrl ? (
                                                <div className="flex gap-2 items-center">
                                                    <button onClick={() => handleDownloadPng(admin.qrCodeUrl, admin.username)} title="Download PNG" className="text-primary flex items-center gap-1.5 hover:bg-primary shadow-sm hover:text-white transition-all py-1.5 px-3 bg-primary/10 rounded-lg text-xs font-bold tracking-wide">
                                                        <Download size={14} /> PNG
                                                    </button>
                                                    <button onClick={() => handleDownloadPdf(admin.qrCodeUrl, admin.username)} title="Download PDF" className="text-rose-600 flex items-center gap-1.5 hover:bg-rose-600 shadow-sm hover:text-white transition-all py-1.5 px-3 bg-rose-50 border-rose-100 rounded-lg text-xs font-bold tracking-wide">
                                                        <FileText size={14} /> PDF
                                                    </button>
                                                </div>
                                            ) : <span className="text-slate-400 text-xs italic px-2">No QR Gen</span>}

                                            {admin.nfcUrl ? (
                                                <a href={admin.nfcUrl} target="_blank" rel="noreferrer" className="text-indigo-600 flex items-center gap-1.5 hover:text-indigo-800 hover:translate-x-1 transition-all w-max py-0.5 px-2 bg-indigo-50 rounded-md">
                                                    <Link size={14} /> NFC Profile Link
                                                </a>
                                            ) : <span className="text-slate-400 text-xs italic px-2">No NFC URL</span>}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right align-middle">
                                        <div className="flex items-center justify-end gap-2 transition-opacity">
                                            {/* View Digital Card Button */}
                                            <a href={`http://localhost:5175/${admin.slug || (admin.username ? admin.username.split('@')[0] : 'admin')}`} target="_blank" rel="noreferrer" title="View Digital Card" className="flex items-center justify-center p-2.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white shadow-sm hover:scale-105 active:scale-95 transition-all">
                                                <Eye size={16} />
                                            </a>
                                            {/* Edit Digital Card Button */}
                                            <button onClick={() => openEditModal(admin, 'card')} title="Edit Digital Card" className="p-2.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white shadow-sm hover:scale-105 active:scale-95 transition-all">
                                                <Smartphone size={16} />
                                            </button>
                                            {/* Update Profile (Existing) */}
                                            <button onClick={() => openEditModal(admin, 'profile')} title="Update Sub Admin Profile" className="p-2.5 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white dark:hover:text-white shadow-sm hover:scale-105 active:scale-95 transition-all">
                                                <Edit size={16} />
                                            </button>
                                            {/* Delete Account (Existing) */}
                                            <button onClick={() => handleDelete(admin._id, admin.username)} title="Delete Account" className="p-2.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-lg hover:bg-rose-600 dark:hover:bg-rose-600 hover:text-white dark:hover:text-white shadow-sm hover:scale-105 active:scale-95 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal Overlay */}
            {editModalOpen && currentEdit && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-700 custom-scrollbar">
                        <button
                            onClick={closeEditModal}
                            className="absolute top-6 right-6 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                                {editModalType === 'profile' ? 'Update User Profile' : 'Update Digital Card'}
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Editing {editModalType === 'profile' ? 'details' : 'digital card'} for <span className="font-semibold text-primary dark:text-blue-400">{currentEdit.username}</span></p>
                        </div>

                        {editModalType === 'profile' && (
                            <form onSubmit={submitUpdate} className="space-y-6">
                                <section className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</span>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">Core Profile</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="group">
                                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2">Username (Login)</label>
                                            <input disabled type="email" value={currentEdit.username} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 py-3 px-4 rounded-xl outline-none cursor-not-allowed opacity-75" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2 group-focus-within:text-primary transition-colors">Full Name</label>
                                            <input required type="text" name="fullName" value={editForm.fullName} onChange={handleUpdateChange} className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2 group-focus-within:text-primary transition-colors">Email</label>
                                            <input required type="email" name="email" value={editForm.email} onChange={handleUpdateChange} className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2 group-focus-within:text-primary transition-colors">Mobile</label>
                                            <input type="text" name="mobile" value={editForm.mobile} onChange={handleUpdateChange} className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2 group-focus-within:text-primary transition-colors">Designation</label>
                                            <input type="text" name="designation" value={editForm.designation} onChange={handleUpdateChange} className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary outline-none transition-all shadow-sm" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2 group-focus-within:text-primary transition-colors">Company Name</label>
                                            <input type="text" name="companyName" value={editForm.companyName} onChange={handleUpdateChange} className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-primary/20 dark:focus:ring-blue-500/20 focus:border-primary outline-none transition-all shadow-sm" />
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">2</span>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">Security Override <Key size={18} className="text-slate-400" /></h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="group relative">
                                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2">New Password (Leave blank to keep current)</label>
                                            <PasswordInput
                                                name="newPassword"
                                                value={editForm.newPassword}
                                                onChange={handleUpdateChange}
                                                placeholder="Min 6 characters"
                                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 pl-4 pr-12 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                        <div className="group relative">
                                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2">Confirm New Password</label>
                                            <PasswordInput
                                                name="confirmNewPassword"
                                                value={editForm.confirmNewPassword}
                                                onChange={handleUpdateChange}
                                                placeholder="Must match new password"
                                                className="w-full bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 pl-4 pr-12 rounded-xl focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="mt-8 flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <button type="button" onClick={closeEditModal} className="w-1/3 py-4 px-4 font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all">Cancel</button>
                                    <button type="submit" disabled={updating} className="flex-1 py-4 px-4 font-bold text-white bg-gradient-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-indigo-500 hover:shadow-xl hover:shadow-slate-900/20 rounded-xl transform hover:-translate-y-1 transition-all flex items-center justify-center disabled:opacity-50 tracking-wide text-lg">
                                        {updating ? <Loader2 className="animate-spin" size={24} /> : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {editModalType === 'card' && (
                            <DigitalCardConfig adminId={currentEdit._id} onCancel={closeEditModal} />
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}
