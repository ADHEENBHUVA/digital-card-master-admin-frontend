import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Loader2, Phone, Share2, Layout, Image as ImageIcon, UploadCloud, UserCircle, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DigitalCardConfig({ adminId, onCancel }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        hero: { name: '', designation: '', company: '', tagline: '', description: '', photo: '', coverType: 'image', coverImage: '', coverVideo: '', logo: '' },
        mainSection: { about: '', highlights: '' },
        contact: { phone: '', whatsapp: '', email: '', website: '', address: '', googleMap: '', inquiry: '' },
        socialLinks: { facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '', telegram: '' },
        footer: { businessName: '', tagline: '', copyright: '', backgroundColor: '' },
        design: { primaryColor: '#3b82f6', backgroundColor: '#ffffff', textColor: '#1e293b' }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/sub-admins/${adminId}/digital-card`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                });
                const data = response.data;
                setFormData({
                    hero: { ...formData.hero, ...data.hero },
                    mainSection: { ...formData.mainSection, ...data.mainSection },
                    contact: { ...formData.contact, ...data.contact },
                    socialLinks: { ...formData.socialLinks, ...data.socialLinks },
                    footer: { ...formData.footer, ...data.footer },
                    design: { ...formData.design, ...data.design }
                });
            } catch (err) {
                toast.error('Failed to load digital card config');
            } finally { setLoading(false); }
        };
        if (adminId) {
            fetchCard();
        }
    }, [adminId]);

    const getMediaUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('/uploads')) return `${import.meta.env.VITE_API_URL}${url}`;
        return url;
    };

    const handleChange = (e, section) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [section]: { ...formData[section], [name]: value } });
    };

    const extractCountryCode = (phoneStr) => {
        if (!phoneStr) return '+91';
        const match = phoneStr.match(/^(\+\d{1,4})\s?(.*)$/);
        return match ? match[1] : '+91';
    };

    const extractPhoneNumber = (phoneStr) => {
        if (!phoneStr) return '';
        const match = phoneStr.match(/^(\+\d{1,4})\s?(.*)$/);
        return match ? match[2] : phoneStr;
    };

    const handlePhoneWithCode = (e, field) => {
        const { name, value } = e.target;
        const currentFull = formData.contact[field] || '';
        const currentCode = extractCountryCode(currentFull);
        const currentNum = extractPhoneNumber(currentFull);

        const newFull = name === 'code' ? `${value}${currentNum}` : `${currentCode}${value}`;

        setFormData({
            ...formData,
            contact: {
                ...formData.contact,
                [field]: newFull
            }
        });
    };

    const handleFileChange = (e, section, name) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Invalid or empty file.");
            return;
        }

        if (file.size === 0) {
            toast.error("Invalid or empty file.");
            return;
        }

        const allowedImageTypes = ['image/png', 'image/jpeg', 'image/webp'];
        const allowedVideoTypes = ['video/mp4', 'video/webm'];

        const isImage = allowedImageTypes.includes(file.type);
        const isVideo = allowedVideoTypes.includes(file.type);

        if (!isImage && !isVideo) {
            toast.error("Unsupported file format. Please upload JPG, PNG, WEBP, MP4, or WEBM.");
            return;
        }

        // Limit both image and video to 10MB
        const maxLimit = 10 * 1024 * 1024;

        if (file.size > maxLimit) {
            toast.error(isVideo ? "Video is too large. Please upload a video smaller than 10MB." : "Image size must be less than 10MB");
            return;
        }

        // Read using FileReader to preview. Real implementation would ideally use createObjectURL, 
        // but since we transport as Base64 to bypass constraints, we safely extract string.
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, [section]: { ...formData[section], [name]: reader.result } });
        };
        reader.readAsDataURL(file);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/sub-admins/${adminId}/digital-card`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
            });
            toast.success('Digital Card updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update Digital Card');
        }
    };

    if (loading) return (
        <div className="h-[70vh] flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-3 text-primary" size={32} />
            <p className="font-semibold animate-pulse tracking-wide">Loading Configurator...</p>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden relative transition-colors">

                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-indigo-500/10 dark:bg-indigo-500/20 p-3 rounded-2xl">
                        <Layout className="text-indigo-600 dark:text-indigo-400 w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                            Digital Business Card
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Configure aesthetics, links, and public info.</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-10 relative z-10">

                    {/* Hero Section */}
                    <section className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</span>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">Hero Section <UserCircle size={18} className="text-slate-400" /></h3>
                        </div>

                        {/* Media Uploads */}
                        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Logo Upload */}
                            <div className="bg-white dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-3 w-full text-center">Brand Logo</label>
                                {formData.hero.logo ? (
                                    <div className="relative mb-3 flex flex-col items-center">
                                        <img src={getMediaUrl(formData.hero.logo)} alt="Logo" className="h-20 object-contain rounded-md shadow-sm border border-slate-100" />
                                        <button type="button" onClick={() => setFormData({ ...formData, hero: { ...formData.hero, logo: '' } })} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition-transform">&times;</button>
                                    </div>
                                ) : (
                                    <ImageIcon className="text-slate-300 w-12 h-12 mb-3" />
                                )}
                                <div className="relative">
                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'hero', 'logo')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <button type="button" className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold py-2 px-6 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800 pointer-events-none group-hover:bg-blue-100 transition-colors flex items-center gap-2">
                                        <UploadCloud size={16} /> Upload Logo
                                    </button>
                                </div>
                            </div>

                            {/* Background Upload */}
                            <div className="bg-white dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="flex w-full justify-between items-center mb-3">
                                    <label className="text-xs uppercase tracking-wider font-bold text-slate-400">Hero Background</label>
                                    {/* Media Type Toggle */}
                                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                        <button type="button" onClick={() => setFormData({ ...formData, hero: { ...formData.hero, coverType: 'image', coverVideo: '' } })} className={`text-xs font-bold px-3 py-1 rounded-md transition-all ${formData.hero.coverType === 'image' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}>Image</button>
                                        <button type="button" onClick={() => setFormData({ ...formData, hero: { ...formData.hero, coverType: 'video', coverImage: '' } })} className={`text-xs font-bold px-3 py-1 rounded-md transition-all ${formData.hero.coverType === 'video' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400' : 'text-slate-500 hover:text-slate-700'}`}>Video</button>
                                    </div>
                                </div>

                                {formData.hero.coverType === 'image' ? (
                                    <>
                                        {formData.hero.coverImage ? (
                                            <div className="relative mb-3 w-full max-w-[200px] flex flex-col items-center">
                                                <img src={getMediaUrl(formData.hero.coverImage)} alt="Cover Image" className="w-full h-20 object-cover rounded-md shadow-sm border border-slate-100" />
                                                <button type="button" onClick={() => setFormData({ ...formData, hero: { ...formData.hero, coverImage: '' } })} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition-transform">&times;</button>
                                            </div>
                                        ) : (
                                            <ImageIcon className="text-slate-300 w-12 h-12 mb-3" />
                                        )}
                                        <div className="relative">
                                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'hero', 'coverImage')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <button type="button" className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold py-2 px-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 pointer-events-none group-hover:bg-slate-100 transition-colors flex items-center gap-2">
                                                <UploadCloud size={16} /> Select Image
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {formData.hero.coverVideo ? (
                                            <div className="relative mb-3 w-full max-w-[200px] flex flex-col items-center">
                                                <video src={getMediaUrl(formData.hero.coverVideo)} className="w-full h-20 object-cover rounded-md shadow-sm border border-slate-100" controls />
                                                <button type="button" onClick={() => setFormData({ ...formData, hero: { ...formData.hero, coverVideo: '' } })} className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:scale-110 transition-transform">&times;</button>
                                            </div>
                                        ) : (
                                            <Layout className="text-slate-300 w-12 h-12 mb-3" />
                                        )}
                                        <div className="relative">
                                            <input type="file" accept="video/mp4,video/webm" onChange={(e) => handleFileChange(e, 'hero', 'coverVideo')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <button type="button" className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold py-2 px-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 pointer-events-none group-hover:bg-slate-100 transition-colors flex items-center gap-2">
                                                <UploadCloud size={16} /> Upload Video
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Display Name</label>
                                <input type="text" name="name" value={formData.hero.name || ''} onChange={(e) => handleChange(e, 'hero')} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Company</label>
                                <input type="text" name="company" value={formData.hero.company || ''} onChange={(e) => handleChange(e, 'hero')} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Designation</label>
                                <input type="text" name="designation" value={formData.hero.designation || ''} onChange={(e) => handleChange(e, 'hero')} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary/20" />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Tagline</label>
                                <input type="text" name="tagline" value={formData.hero.tagline || ''} onChange={(e) => handleChange(e, 'hero')} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:ring-2 focus:ring-primary/20" />
                            </div>
                        </div>
                    </section>

                    {/* Main Section */}
                    <section className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">2</span>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">Main Section <Layout size={18} className="text-slate-400" /></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2 group mt-2">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">About Description</label>
                                <textarea name="about" value={formData.mainSection.about || ''} onChange={(e) => handleChange(e, 'mainSection')} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm resize-y min-h-[100px]" placeholder="Write something about your business..." />
                            </div>
                        </div>
                    </section>

                    {/* Contact & Social Links - New Section 3 */}
                    <section className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">3</span>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">Contact & Social Links <Phone size={18} className="text-slate-400" /></h3>
                        </div>
                        {/* First Line: Call, WhatsApp, Location */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-indigo-500 transition-colors">Direct Call <span className="text-red-500">*</span></label>
                                <div className="flex bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/20">
                                    <select
                                        name="code"
                                        value={extractCountryCode(formData.contact.phone)}
                                        onChange={(e) => handlePhoneWithCode(e, 'phone')}
                                        className="bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold px-3 focus:outline-none text-sm appearance-none"
                                    >
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+61">🇦🇺 +61</option>
                                        <option value="+971">🇦🇪 +971</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="number"
                                        value={extractPhoneNumber(formData.contact.phone)}
                                        onChange={(e) => handlePhoneWithCode(e, 'phone')}
                                        placeholder="Phone Number"
                                        required
                                        className="w-full bg-transparent dark:text-white py-3 px-3 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-emerald-500 transition-colors">Whatsapp Number <span className="text-red-500">*</span></label>
                                <div className="flex bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20">
                                    <select
                                        name="code"
                                        value={extractCountryCode(formData.contact.whatsapp)}
                                        onChange={(e) => handlePhoneWithCode(e, 'whatsapp')}
                                        className="bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold px-3 focus:outline-none text-sm appearance-none"
                                    >
                                        <option value="+91">🇮🇳 +91</option>
                                        <option value="+1">🇺🇸 +1</option>
                                        <option value="+44">🇬🇧 +44</option>
                                        <option value="+61">🇦🇺 +61</option>
                                        <option value="+971">🇦🇪 +971</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="number"
                                        value={extractPhoneNumber(formData.contact.whatsapp)}
                                        onChange={(e) => handlePhoneWithCode(e, 'whatsapp')}
                                        placeholder="Whatsapp Number"
                                        required
                                        className="w-full bg-transparent dark:text-white py-3 px-3 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-amber-500 transition-colors">Location / Google Maps Link</label>
                                <input type="url" name="googleMap" value={formData.contact.googleMap || ''} onChange={(e) => handleChange(e, 'contact')} placeholder="https://maps.google.com/..." className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:ring-2 focus:ring-amber-500/20" />
                            </div>
                        </div>

                        {/* Second Line: Email, Website */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-indigo-500 transition-colors">Email Action <span className="text-red-500">*</span></label>
                                <input type="email" name="email" value={formData.contact.email || ''} onChange={(e) => handleChange(e, 'contact')} placeholder="email@address.com" required className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-indigo-500 transition-colors">Website URL <span className="text-red-500">*</span></label>
                                <input type="url" name="website" value={formData.contact.website || ''} onChange={(e) => handleChange(e, 'contact')} placeholder="https://..." required className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 tracking-wide uppercase flex items-center gap-2">Social Networks <Globe size={16} /></h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {['facebook', 'instagram', 'youtube', 'linkedin', 'twitter', 'telegram'].map(net => (
                                    <div key={net} className="group">
                                        <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 capitalize group-focus-within:text-pink-500 transition-colors">{net} URL</label>
                                        <input type="url" name={net} value={formData.socialLinks[net] || ''} onChange={(e) => handleChange(e, 'socialLinks')} className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:ring-2 focus:ring-pink-500/20" placeholder={`https://${net}.com/...`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* App Features - New Section 4 */}
                    <section className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">4</span>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">App Features Configuration <Layout size={18} className="text-slate-400" /></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm opacity-80">
                                <div>
                                    <span className="block text-sm font-bold text-slate-800 dark:text-white">Profile Button Active</span>
                                    <span className="block text-[11px] text-slate-500 mt-1">Permanently enabled on your digital card</span>
                                </div>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">MANDATORY</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm opacity-80">
                                <div>
                                    <span className="block text-sm font-bold text-slate-800 dark:text-white">Inquiry Form Active</span>
                                    <span className="block text-[11px] text-slate-500 mt-1">Permanently enabled on your digital card</span>
                                </div>
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-md">MANDATORY</span>
                            </div>
                        </div>
                    </section>

                    {/* Footer Setup - New Section 5 */}
                    <section className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">5</span>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">Footer Setup <Layout size={18} className="text-slate-400" /></h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-emerald-500 transition-colors">Footer Company Name</label>
                                <input type="text" name="businessName" value={formData.footer?.businessName || ''} onChange={(e) => handleChange(e, 'footer')} placeholder="Enter the company name to show in the footer" className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 dark:text-white py-3 px-4 rounded-xl focus:ring-2 focus:ring-emerald-500/20" />
                            </div>
                            <div className="group">
                                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 group-focus-within:text-emerald-500 transition-colors">Footer Background Color (Optional)</label>
                                <div className="flex bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 p-2 items-center gap-3">
                                    <input type="color" name="backgroundColor" value={formData.footer?.backgroundColor || '#000000'} onChange={(e) => handleChange(e, 'footer')} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                                    <input type="text" name="backgroundColor" value={formData.footer?.backgroundColor || ''} onChange={(e) => handleChange(e, 'footer')} placeholder="Inherits Theme Color if empty" className="flex-1 bg-transparent dark:text-white outline-none text-sm font-medium" />
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="pt-4 pb-2 flex gap-4">
                        <button type="submit" className="flex-1 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-indigo-500 text-white font-bold py-4 rounded-2xl hover:shadow-xl hover:shadow-slate-900/20 transform hover:-translate-y-1 active:scale-[0.98] transition-all tracking-wide text-lg">
                            Deploy Card Updates
                        </button>
                        {onCancel && (
                            <button type="button" onClick={onCancel} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-4 px-8 rounded-2xl transition-all">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
