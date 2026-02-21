'use client'
import { useState, useEffect } from 'react';
import { Plus, Circle, X, LogOut, Activity, RefreshCw, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { BACKEND_URL } from '@/lib/utils';

interface WebsiteTick {
    id: string;
    response_time_ms: number;
    status: 'Up' | 'Down' | 'Unknown';
    createdAt: string;
}

interface Website {
    id: string;
    url: string;
    status: 'up' | 'down' | 'checking';
    responseTime: number;
    lastChecked: string;
}

interface ApiWebsite {
    id: string;
    url: string;
    ticks: { status: string; response_time_ms: number; createdAt: string }[];
}

interface DashboardProps {
    onSignOut: () => void;
}

export default function Dashboard({ onSignOut }: DashboardProps) {
    const [isDark, setIsDark] = useState(false);
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formUrl, setFormUrl] = useState('');
    const [addingWebsite, setAddingWebsite] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // Theme persistence — same pattern as the main page
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
        fetchWebsites();
    }, []);

    const fetchWebsites = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${BACKEND_URL}/websites`, {
                headers: {
                    Authorization: token
                }
            });
            setWebsites((response.data.websites as ApiWebsite[]).map((w: ApiWebsite) => ({
                id: w.id,
                url: w.url,
                status: w.ticks[0] ? w.ticks[0].status === "Up" ? "up" : "down" : "checking",
                responseTime: w.ticks[0] ? w.ticks[0].response_time_ms : 0,
                lastChecked: w.ticks[0] ? w.ticks[0].createdAt : new Date().toISOString()
            })) || []);
        } catch (err) {
            console.error('Error fetching websites:', err);
            if (axios.isAxiosError(err) && err.response?.status === 403) {
                localStorage.removeItem('token');
                router.push('/signin');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddWebsite = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setAddingWebsite(true);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BACKEND_URL}/website`, {
                url: formUrl
            }, {
                headers: {
                    Authorization: token
                }
            });
            setFormUrl('');
            setIsModalOpen(false);
            fetchWebsites();
        } catch (err) {
            console.error('Error adding website:', err);
            setError('Failed to add website. Please try again.');
        } finally {
            setAddingWebsite(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'up':
                return 'text-green-500';
            case 'down':
                return 'text-red-500';
            default:
                return isDark ? 'text-gray-500' : 'text-gray-400';
        }
    };

    const getStatusBgColor = (status: string) => {
        switch (status) {
            case 'up':
                return isDark ? 'bg-green-900/30 border-green-500/20' : 'bg-green-500/10 border-green-500/20';
            case 'down':
                return isDark ? 'bg-red-900/30 border-red-500/20' : 'bg-red-500/10 border-red-500/20';
            default:
                return isDark ? 'bg-gray-800 border-gray-700' : 'bg-slate-100 border-slate-200';
        }
    };

    return (
        <div className={`min-h-screen ${isDark ? 'dark bg-gray-950' : 'bg-gray-50'}`}>
            {/* Navbar */}
            <nav className={`border-b ${isDark ? 'bg-gray-900/80 border-gray-800 backdrop-blur-md' : 'bg-white/80 border-gray-200 backdrop-blur-md'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
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
                            onClick={fetchWebsites}
                            className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                            title="Refresh"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onSignOut}
                            className={`p-2 rounded-lg transition-colors flex items-center space-x-2 ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Your Websites
                        </h2>
                        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                            Track the status of all your monitored services
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center space-x-2 shadow-lg"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add Website</span>
                    </button>
                </div>

                {loading ? (
                    <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Loading websites...
                    </div>
                ) : websites.length === 0 ? (
                    <div className={`rounded-2xl p-12 text-center border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
                        <Circle className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
                        <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
                            No websites yet
                        </h3>
                        <p className={`mb-6 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                            Start monitoring your services by adding your first website
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add your first website</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {websites.map((website) => (
                            <div
                                key={website.id}
                                onClick={() => router.push(`/website/${website.id}`)}
                                className={`rounded-2xl p-6 border transition-all cursor-pointer ${isDark
                                    ? 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:shadow-lg hover:shadow-emerald-500/5'
                                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                            {website.url}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm border ${getStatusBgColor(website.status)}`}>
                                        <Circle className={`h-2.5 w-2.5 fill-current ${getStatusColor(website.status)}`} />
                                        <span className={`font-medium capitalize ${getStatusColor(website.status)}`}>
                                            {website.status}
                                        </span>
                                    </div>
                                </div>

                                <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Last checked: {new Date(website.lastChecked).toLocaleString()}
                                    </p>
                                    {website.responseTime > 0 && (
                                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                            Response time: {website.responseTime}ms
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add Website Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className={`rounded-2xl max-w-md w-full p-6 shadow-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                Add Website
                            </h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setError('');
                                    setFormUrl('');
                                }}
                                className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleAddWebsite} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Website URL
                                </label>
                                <input
                                    type="url"
                                    value={formUrl}
                                    onChange={(e) => setFormUrl(e.target.value)}
                                    placeholder="e.g., https://example.com"
                                    required
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors outline-none ${isDark
                                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent'
                                        }`}
                                />
                            </div>

                            {error && (
                                <div className={`px-4 py-3 rounded-lg text-sm border ${isDark ? 'bg-red-900/20 border-red-500/30 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                    {error}
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setError('');
                                        setFormUrl('');
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addingWebsite}
                                    className="flex-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addingWebsite ? 'Adding...' : 'Add Website'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
