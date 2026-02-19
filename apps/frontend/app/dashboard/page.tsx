'use client'
import { Activity } from 'lucide-react';

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-2">
                        <Activity className="h-8 w-8 text-emerald-600" />
                        <span className="text-2xl font-bold text-slate-900">UpMonitor Dashboard</span>
                    </div>
                    <button className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition">
                        Log Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Active Monitors</h3>
                        <p className="text-3xl font-bold text-slate-900">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Status Pages</h3>
                        <p className="text-3xl font-bold text-slate-900">0</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-slate-500 text-sm font-medium mb-1">Incident Alerts</h3>
                        <p className="text-3xl font-bold text-green-600">All Systems Go</p>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <p className="text-slate-500">No websites monitored yet. Add your first check to get started.</p>
                    <button className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">
                        Add New Monitor
                    </button>
                </div>
            </div>
        </div>
    );
}
