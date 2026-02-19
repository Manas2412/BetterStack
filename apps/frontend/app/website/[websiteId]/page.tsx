'use client'
import { Activity } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function WebsitePage() {
    const params = useParams();
    const websiteId = params.websiteId;

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 mb-8">
                    <Activity className="h-8 w-8 text-emerald-600" />
                    <span className="text-2xl font-bold text-slate-900">Website Details</span>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <p className="text-slate-600">Website ID: {websiteId}</p>
                </div>
            </div>
        </div>
    );
}
