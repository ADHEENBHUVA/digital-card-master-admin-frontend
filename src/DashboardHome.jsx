import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Eye, TrendingUp, UserCheck, Activity, Smartphone } from 'lucide-react';

export default function DashboardHome() {
    const [stats, setStats] = useState({
        totalAdmins: 0,
        activeAdmins: 0,
        totalCardViews: 0,
        totalLandingViews: 0
    });
    const [recentAdmins, setRecentAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [trafficData, setTrafficData] = useState([]);
    const [slug, setSlug] = useState('');

    const generateActivityData = (adminsList) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = new Date();
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            last7Days.push({
                date: d.toISOString().split('T')[0],
                dayName: days[d.getDay()],
                created: 0,
                updated: 0
            });
        }

        adminsList.forEach(admin => {
            if (admin.createdAt) {
                const createDate = admin.createdAt.split('T')[0];
                const activeDay = last7Days.find(d => d.date === createDate);
                if (activeDay) activeDay.created += 1;
            }
            if (admin.updatedAt) {
                const updateDate = admin.updatedAt.split('T')[0];
                // Only count as update if it's different day or intentionally updated later
                const activeDay = last7Days.find(d => d.date === updateDate);
                if (activeDay && admin.updatedAt !== admin.createdAt) activeDay.updated += 1;
            }
        });

        // if the system is completely new or has no data in last 7 days, fallback gracefully
        const totalActivity = last7Days.reduce((acc, curr) => acc + curr.created + curr.updated, 0);
        if (totalActivity === 0) {
            return [
                { name: 'Mon', card: 0, lp: 0 },
                { name: 'Tue', card: 0, lp: 0 },
                { name: 'Wed', card: 0, lp: 0 },
                { name: 'Thu', card: 0, lp: 0 },
                { name: 'Fri', card: 0, lp: 0 },
                { name: 'Sat', card: 0, lp: 0 },
                { name: 'Sun', card: 0, lp: 0 },
            ];
        }

        return last7Days.map(d => ({
            name: d.dayName,
            card: d.created,
            lp: d.updated
        }));
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/sub-admins', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                });

                const admins = response.data;
                const active = admins.filter(a => a.status === 'active').length;
                const cardViews = admins.reduce((acc, curr) => acc + (curr.views?.digitalCard || 0), 0);
                const lpViews = admins.reduce((acc, curr) => acc + (curr.views?.landingPage || 0), 0);

                setStats({
                    totalAdmins: admins.length,
                    activeAdmins: active,
                    totalCardViews: cardViews,
                    totalLandingViews: lpViews
                });

                // Fetch Master Admin Profile to get slug for preview
                try {
                    const profileRes = await axios.get('http://localhost:5000/api/admin/profile', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
                    });
                    if (profileRes.data && profileRes.data.slug) {
                        setSlug(profileRes.data.slug);
                    }
                } catch (err) {
                    console.error("Failed to load master admin profile", err);
                }

                setTrafficData(generateActivityData(admins));

                setRecentAdmins(admins.slice(0, 5));
            } catch (error) {
                console.error("Dashboard data error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);



    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${color}-500 group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">{title}</p>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white">{loading ? '...' : value}</h3>
                </div>
                <div className={`p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600 dark:text-${color}-400 group-hover:rotate-12 transition-transform`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className={`mt-4 flex items-center gap-2 text-sm font-semibold text-${color}-500`}>
                <TrendingUp size={16} /> <span>+{trend}% this week</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative pb-10">
            {/* Header section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-300 tracking-tight mb-2">Platform Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">Real-time metrics and system analytics for Master Admin.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <Activity className="text-emerald-500 animate-pulse" size={18} />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">System Online</span>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Sub Admins" value={stats.totalAdmins} icon={Users} color="blue" trend={12} />
                <StatCard title="Active Accounts" value={stats.activeAdmins} icon={UserCheck} color="emerald" trend={8} />
                <StatCard title="Total Card Views" value={stats.totalCardViews} icon={Smartphone} color="indigo" trend={24} />
                <StatCard title="Landing Page Hops" value={stats.totalLandingViews} icon={Eye} color="pink" trend={18} />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Area Chart (Expanded) */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none relative overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Network Traffic <span className="text-slate-400 text-sm font-medium ml-2">(Last 7 Days)</span></h3>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCard" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorLp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Area type="monotone" dataKey="card" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCard)" name="Cards Created" />
                                <Area type="monotone" dataKey="lp" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorLp)" name="Cards Updated" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/20 dark:shadow-none overflow-hidden">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Recently Added Admins</h3>
                    <div className="space-y-4">
                        {recentAdmins.length === 0 && !loading && (
                            <p className="text-slate-500 text-sm">No administrators found.</p>
                        )}
                        {recentAdmins.map((admin, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                        {admin.fullName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{admin.fullName}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{admin.username}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${admin.status === 'active' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                    {admin.status?.toUpperCase() || 'ACTIVE'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-blue-600 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rotate-45 transform translate-x-16 -translate-y-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
                            <Smartphone size={32} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black mb-3">Powering Digital Identity</h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-sm">Manage NFC and QR-coded digital cards intuitively. Start by adding a sub-admin to deploy a new profile.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
