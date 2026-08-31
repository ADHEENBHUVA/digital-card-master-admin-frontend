import React, { useState, useEffect } from 'react';
import { FaPhoneAlt, FaWhatsapp, FaGlobe, FaShareAlt, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const LandingPage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        fetch(import.meta.env.VITE_API_URL + '/api/profile')
            .then(res => res.json())
            .then(data => {
                setProfile(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const generateVCard = () => {
        if (!profile) return;
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${profile.company.name}\nORG:${profile.company.name}\nTEL;TYPE=WORK,VOICE:${profile.contact.phone}\nEMAIL;TYPE=PREF,INTERNET:${profile.contact.email}\nURL:${profile.contact.website}\nEND:VCARD`;
        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Appifly_Infotech.vcf';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: profile?.company.name,
                    text: profile?.company.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.error("Share failed:", err);
            }
        } else {
            alert('Web Share not supported on this browser.');
        }
    };

    const openPopup = (name) => alert(`Opened ${name}`);

    if (loading || !profile) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] text-slate-800">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#eef2f6] to-[#e4e9f0] flex justify-center font-sans overflow-x-hidden">
            <div className="w-full max-w-[420px] bg-white shadow-[0_15px_50px_rgba(0,0,0,0.08)] relative flex flex-col min-h-screen">

                {/* Premium Curved Dark Header Box */}
                <div className="relative h-[350px] bg-gradient-to-br from-[#1e3a47] via-[#122630] to-[#0c181f] text-center z-0 flex flex-col items-center shadow-inner">
                    {/* Dark subtle hexagon-like abstract layout bg */}
                    <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#122830]/80"></div>

                    <div className="relative z-10 flex flex-col items-center pt-10">
                        {/* Perfect Middle-Sized Circular company logo */}
                        <div className="p-1.5 bg-white/10 backdrop-blur-md rounded-[32px] mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.2)] border border-white/20">
                            <img src={profile.company.logoUrl} alt="Logo" className="w-[88px] h-[88px] rounded-[26px] object-cover bg-white" />
                        </div>

                        <h1 className="text-[28px] font-bold text-white tracking-wide leading-tight drop-shadow-md">
                            {profile.company.name}
                        </h1>
                        <p className="text-[#a4bcc7] font-medium mt-1.5 text-[15px] drop-shadow-sm">Owner</p>
                        <p className="text-[#e2eaf0] text-[12.5px] font-semibold mt-1 uppercase tracking-widest drop-shadow-sm bg-white/10 px-4 py-1 rounded-full border border-white/5">
                            {profile.company.tagline}
                        </p>
                    </div>

                    {/* Accurate SVG Curve at the bottom perfectly matched */}
                    <svg className="absolute bottom-[-1px] left-0 w-full text-white" viewBox="0 0 1440 250" fill="currentColor" preserveAspectRatio="none">
                        <path d="M0,160L80,165.3C160,171,320,181,480,165.3C640,149,800,107,960,106.7C1120,107,1280,149,1360,170.7L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
                    </svg>
                </div>

                {/* Main Action Buttons Grid */}
                <div className="px-5 pt-8 pb-44 flex-grow z-10 bg-white relative">
                    <div className="grid grid-cols-3 gap-y-9 gap-x-2 justify-items-center">
                        {/* Row 1 - Circular Icons */}
                        <ActionCircle icon={<FaPhoneAlt size={22} />} label="Call" bgClass="bg-gradient-to-tr from-[#e53935] to-[#ff5252]" href="tel:+918347640423" />
                        <ActionCircle icon={<FaWhatsapp size={26} />} label="WhatsApp" bgClass="bg-gradient-to-tr from-[#128C7E] to-[#25D366]" href={`https://wa.me/${profile.contact.whatsapp}`} />
                        <Action3D iconSrc="https://img.icons8.com/3d-fluency/94/mail.png" label="Email" href={`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.contact.email}`} target="_blank" />

                        {/* Row 2 */}
                        <ActionCircle icon={<FaGlobe size={24} />} label="Website" bgClass="bg-gradient-to-tr from-[#1976D2] to-[#42A5F5]" href={profile.contact.website} target="_blank" />

                        {/* Row 3 - Mix */}
                        <Action3D iconSrc="https://img.icons8.com/3d-fluency/94/map-marker.png" label="Location" href={profile.contact.mapUrl} target="_blank" />
                        <Action3D iconSrc="https://img.icons8.com/3d-fluency/94/qr-code.png" label="QrCode" onClick={() => setShowQR(true)} />
                        <Action3D iconSrc="https://img.icons8.com/3d-fluency/94/address-book.png" label="Save Contact" onClick={generateVCard} />

                        {/* Row 4 */}
                        <ActionCircle icon={<FaShareAlt size={22} />} label="Share" bgClass="bg-gradient-to-tr from-[#e53935] to-[#ff5252]" onClick={handleShare} />
                        <Action3D iconSrc="https://img.icons8.com/3d-fluency/94/comments.png" label="Inquiry" onClick={() => openPopup('Inquiry Form')} />


                    </div>
                </div>

                {/* Footer and Social Overlay */}
                <div className="relative mt-auto">
                    {/* Premium High rounded white card for Socials */}
                    <div className="absolute left-0 right-0 -top-[80px] z-20 px-0">
                        <div className="bg-white/95 backdrop-blur-xl rounded-[32px] pt-8 pb-9 px-6 shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.06)] flex justify-center space-x-6 border-t border-gray-100">
                            <SocialIcon icon={<FaFacebookF size={16} />} href={profile.social.facebook} bgClass="bg-[#3b5998]" />
                            <SocialIcon icon={<FaInstagram size={18} />} href={profile.social.instagram} bgClass="bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888]" />
                            <SocialIcon icon={<FaYoutube size={16} />} href={profile.social.youtube} bgClass="bg-[#ff0000]" />
                            <SocialIcon icon={<FaLinkedinIn size={14} />} href={profile.social.linkedin} bgClass="bg-[#0077b5]" />
                        </div>
                    </div>

                    {/* Premium Dark Footer Base */}
                    <div className="bg-gradient-to-br from-[#1a2830] to-[#0c181f] text-center pt-[65px] pb-6 px-3 z-10 w-full relative shadow-inner border-t-[3px] border-blue-900/40">
                        <p className="text-[14px] text-[#ccd6dd] font-light tracking-wide">
                            Unlock New Possibilities : <span className="font-semibold text-white drop-shadow-sm">Get Your Digital Card Now!</span>
                        </p>
                        <p className="mt-2 text-[13px] text-gray-400 font-light tracking-wide">
                            Developed by <span className="font-medium text-white drop-shadow-sm">Appifly Infotech</span>
                        </p>
                    </div>
                </div>

                {/* QR Code Modal Overlay */}
                {showQR && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => setShowQR(false)}>
                        <div className="bg-white rounded-3xl p-8 max-w-[320px] w-full flex flex-col items-center shadow-2xl transform transition-all scale-100 opacity-100" onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Scan QR Code</h3>
                            <p className="text-sm text-slate-500 mb-6 text-center">Share this card instantly by scanning the code below</p>

                            <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-sm mb-6">
                                <img src={`${import.meta.env.VITE_API_URL}${profile.qrCodeUrl}`} alt="QR Code" className="w-[200px] h-[200px] object-contain" />
                            </div>

                            <button onClick={() => setShowQR(false)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Component for buttons with Solid Circle Background + White Icon (Like Call, WhatsApp)
const ActionCircle = ({ icon, label, bgClass, href, onClick, target }) => {
    const content = (
        <div className="flex flex-col items-center cursor-pointer group w-[80px]">
            <div className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${bgClass} transform transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] active:scale-95`}>
                {icon}
            </div>
            <span className="text-[14px] mt-2.5 font-medium text-slate-700 text-center leading-tight whitespace-nowrap transition-colors group-hover:text-slate-900">{label}</span>
        </div>
    );

    if (onClick) return <button type="button" onClick={onClick} className="w-full focus:outline-none flex justify-center">{content}</button>;
    return <a href={href} target={target} rel="noopener noreferrer" className="w-full flex justify-center">{content}</a>;
};

// Component for 3D Custom realistic PNG Images directly on the grid without a white circle
const Action3D = ({ iconSrc, label, href, onClick, target }) => {
    const content = (
        <div className="flex flex-col items-center cursor-pointer group w-[80px]">
            <div className="w-[52px] h-[52px] flex items-center justify-center transform transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-110 active:scale-95 drop-shadow-md group-hover:drop-shadow-xl">
                <img src={iconSrc} alt={label} className="w-[40px] h-[40px] object-contain" />
            </div>
            <span className="text-[14px] mt-2.5 font-medium text-slate-700 text-center leading-tight whitespace-nowrap transition-colors group-hover:text-slate-900">{label}</span>
        </div>
    );

    if (onClick) return <button type="button" onClick={onClick} className="w-full focus:outline-none flex justify-center">{content}</button>;
    return <a href={href} target={target} rel="noopener noreferrer" className="w-full flex justify-center">{content}</a>;
};

// Social Media Float Icons
const SocialIcon = ({ icon, href, bgClass }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`w-[40px] h-[40px] flex items-center justify-center rounded-full text-white ${bgClass} shadow-[0_5px_15px_rgba(0,0,0,0.15)] transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] active:scale-95`}>
        {icon}
    </a>
);

export default LandingPage;
