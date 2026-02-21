'use client'
import { useState, useEffect } from 'react';
import { Activity, ArrowLeft, Circle, Clock, Globe, RefreshCw, Wifi, WifiOff, Moon, Sun, LogOut } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/utils';

interface WebsiteTick {
    id: string;
    response_time_ms: number;
    status: 'Up' | 'Down' | 'Unknown';
    createdAt: string;
    region_id: string;
}

interface WebsiteData {
    id: string;
    url: string;
    user_id: string;
    timeAdded: string;
    ticks: WebsiteTick[];
}

export default function WebsitePage() {
    const params = useParams();
    const router = useRouter();
    const websiteId = params.websiteId as string;

    const [isDark, setIsDark] = useState(false);
    const [website, setWebsite] = useState<WebsiteData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Theme persistence
    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved) {
            setIsDark(saved === 'dark');
        } else {
            setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/signin');
            return;
        }
        fetchWebsiteStatus();
    }, [websiteId]);

    const fetchWebsiteStatus = async () => {
        try {
            setLoading(true);
            setError('');
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/status/${websiteId}`, {
                headers: {
                    Authorization: token
                }
            });
            setWebsite(response.data.website);
        } catch (err) {
            console.error('Error fetching website status:', err);
            if (axios.isAxiosError(err) && err.response?.status === 403) {
                localStorage.removeItem('token');
                router.push('/signin');
            } else if (axios.isAxiosError(err) && err.response?.status === 409) {
                setError('Website not found');
            } else {
                setError('Failed to load website details');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        router.push('/signin');
    };

    const getCurrentStatus = (): 'up' | 'down' | 'checking' => {
        if (!website || website.ticks.length === 0) return 'checking';
        return website.ticks[0].status === 'Up' ? 'up' : 'down';
    };

    const getUptimePercentage = (): string => {
        if (!website || website.ticks.length === 0) return '—';
        const upCount = website.ticks.filter(t => t.status === 'Up').length;
        return ((upCount / website.ticks.length) * 100).toFixed(1);
    };

    const getAverageResponseTime = (): string => {
        if (!website || website.ticks.length === 0) return '—';
        const upTicks = website.ticks.filter(t => t.status === 'Up');
        if (upTicks.length === 0) return '—';
        const avg = upTicks.reduce((sum, t) => sum + t.response_time_ms, 0) / upTicks.length;
        return Math.round(avg).toString();
    };

    const getMaxResponseTime = (): string => {
        if (!website || website.ticks.length === 0) return '—';
        const upTicks = website.ticks.filter(t => t.status === 'Up');
        if (upTicks.length === 0) return '—';
        return Math.max(...upTicks.map(t => t.response_time_ms)).toString();
    };

    const getMinResponseTime = (): string => {
        if (!website || website.ticks.length === 0) return '—';
        const upTicks = website.ticks.filter(t => t.status === 'Up');
        if (upTicks.length === 0) return '—';
        return Math.min(...upTicks.map(t => t.response_time_ms)).toString();
    };

    const status = getCurrentStatus();

    // Response time bar chart — renders ticks as bars
    const renderResponseTimeBars = () => {
        if (!website || website.ticks.length === 0) return null;

        const reversedTicks = [...website.ticks].reverse();
        const maxTime = Math.max(...reversedTicks.map(t => t.response_time_ms), 1);

        return (
            <div className="flex items-end space-x-1 h-32">
                {reversedTicks.map((tick, index) => {
                    const heightPercent = (tick.response_time_ms / maxTime) * 100;
                    const isUp = tick.status === 'Up';
                    return (
                        <div
                            key={tick.id || index}
                            className="flex-1 group relative"
                            title={`${tick.response_time_ms}ms — ${tick.status} — ${new Date(tick.createdAt).toLocaleString()}`}
                        >
                            <div
                                className={`rounded-t transition-all ${isUp
                                    ? isDark ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-emerald-500 hover:bg-emerald-600'
                                    : isDark ? 'bg-red-500 hover:bg-red-400' : 'bg-red-500 hover:bg-red-600'
                                    }`}
                                style={{ height: `${Math.max(heightPercent, 4)}%` }}
                            />
                            {/* Tooltip */}
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-white'
                                }`}>
                                {tick.response_time_ms}ms • {tick.status}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Status dots for uptime history
    const renderUptimeDots = () => {
        if (!website || website.ticks.length === 0) return null;

        const reversedTicks = [...website.ticks].reverse();

        return (
            <div className="flex space-x-1">
                {reversedTicks.map((tick, index) => (
                    <div
                        key={tick.id || index}
                        title={`${tick.status} — ${new Date(tick.createdAt).toLocaleString()}`}
                        className={`w-3 h-8 rounded-sm transition-colors ${tick.status === 'Up'
                            ? isDark ? 'bg-emerald-500 hover:bg-emerald-400' : 'bg-emerald-500 hover:bg-emerald-600'
                            : isDark ? 'bg-red-500 hover:bg-red-400' : 'bg-red-500 hover:bg-red-600'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className={`min-h-screen ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
            {/* Navbar */}
            <nav className={`border-b ${isDark ? 'bg-gray-900/80 border-gray-800 backdrop-blur-md' : 'bg-white/80 border-gray-200 backdrop-blur-md'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/dashboard')}>
                        <Activity className="h-7 w-7 text-emerald-600" />
                        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>UpMonitor</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => setIsDark(!isDark)}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                            title="Toggle theme"
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={fetchWebsiteStatus}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                            title="Refresh"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                        <button
                            onClick={handleSignOut}
                            className={`p-2 rounded-lg transition-colors flex items-center ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back button */}
                <button
                    onClick={() => router.push('/dashboard')}
                    className={`flex items-center space-x-2 mb-8 transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Back to Dashboard</span>
                </button>

                {loading ? (
                    <div className={`text-center py-20 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading website details...</p>
                    </div>
                ) : error ? (
                    <div className={`rounded-2xl p-12 text-center border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                        <WifiOff className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                            {error}
                        </h3>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Go back to Dashboard
                        </button>
                    </div>
                ) : website ? (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className={`rounded-2xl p-6 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${status === 'up'
                                        ? isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
                                        : status === 'down'
                                            ? isDark ? 'bg-red-900/30' : 'bg-red-100'
                                            : isDark ? 'bg-gray-800' : 'bg-gray-100'
                                        }`}>
                                        {status === 'up'
                                            ? <Wifi className="h-6 w-6 text-emerald-500" />
                                            : status === 'down'
                                                ? <WifiOff className="h-6 w-6 text-red-500" />
                                                : <Globe className={`h-6 w-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                                        }
                                    </div>
                                    <div>
                                        <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {website.url}
                                        </h2>
                                        <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                            Added {new Date(website.timeAdded).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${status === 'up'
                                    ? isDark ? 'bg-emerald-900/30 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : status === 'down'
                                        ? isDark ? 'bg-red-900/30 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'
                                        : isDark ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-600'
                                    }`}>
                                    <Circle className="h-2.5 w-2.5 fill-current" />
                                    <span className="font-semibold text-sm capitalize">{status === 'checking' ? 'Checking...' : status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className={`rounded-2xl p-5 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Uptime</p>
                                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {getUptimePercentage()}{getUptimePercentage() !== '—' && '%'}
                                </p>
                            </div>
                            <div className={`rounded-2xl p-5 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Avg Response</p>
                                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {getAverageResponseTime()}{getAverageResponseTime() !== '—' && 'ms'}
                                </p>
                            </div>
                            <div className={`rounded-2xl p-5 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Fastest</p>
                                <p className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                    {getMinResponseTime()}{getMinResponseTime() !== '—' && 'ms'}
                                </p>
                            </div>
                            <div className={`rounded-2xl p-5 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                                <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Slowest</p>
                                <p className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                                    {getMaxResponseTime()}{getMaxResponseTime() !== '—' && 'ms'}
                                </p>
                            </div>
                        </div>

                        {/* Response Time Chart */}
                        <div className={`rounded-2xl p-6 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Response Time</h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Last {website.ticks.length} checks</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Up</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                        <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Down</span>
                                    </div>
                                </div>
                            </div>
                            {website.ticks.length > 0 ? (
                                renderResponseTimeBars()
                            ) : (
                                <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <Clock className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm">No data available yet</p>
                                </div>
                            )}
                        </div>

                        {/* Uptime History */}
                        <div className={`rounded-2xl p-6 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Uptime History</h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Each bar represents a check</p>
                                </div>
                            </div>
                            {website.ticks.length > 0 ? (
                                <>
                                    {renderUptimeDots()}
                                    <div className={`flex justify-between mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                        <span className="text-xs">
                                            {new Date(website.ticks[website.ticks.length - 1].createdAt).toLocaleString()}
                                        </span>
                                        <span className="text-xs">
                                            {new Date(website.ticks[0].createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <Clock className="h-8 w-8 mx-auto mb-2" />
                                    <p className="text-sm">No uptime data yet</p>
                                </div>
                            )}
                        </div>

                        {/* Recent Checks Table */}
                        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                            <div className="p-6 pb-4">
                                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Checks</h3>
                                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Detailed log of recent health checks</p>
                            </div>
                            {website.ticks.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`border-t border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                                <th className={`text-left px-6 py-3 text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Status</th>
                                                <th className={`text-left px-6 py-3 text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Response Time</th>
                                                <th className={`text-left px-6 py-3 text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Checked At</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {website.ticks.map((tick, index) => (
                                                <tr
                                                    key={tick.id || index}
                                                    className={`border-b last:border-b-0 transition-colors ${isDark ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50'}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Circle className={`h-2.5 w-2.5 fill-current ${tick.status === 'Up' ? 'text-emerald-500' : 'text-red-500'}`} />
                                                            <span className={`text-sm font-medium ${tick.status === 'Up'
                                                                ? isDark ? 'text-emerald-400' : 'text-emerald-700'
                                                                : isDark ? 'text-red-400' : 'text-red-700'
                                                                }`}>
                                                                {tick.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                        {tick.response_time_ms}ms
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                                        {new Date(tick.createdAt).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className={`text-center py-8 px-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <p className="text-sm">No checks recorded yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </main>
        </div>
    );
}
