"use client"

import { Vote, Users, BarChart3, FileText, Shield, Globe } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from '@/components/AdminLayout';
import type { AdminRole } from '@/lib/mockData';

const turnoutData = [
  { state: 'MH', turnout: 67 },
  { state: 'DL', turnout: 58 },
  { state: 'UP', turnout: 62 },
  { state: 'KA', turnout: 71 },
  { state: 'TN', turnout: 69 },
  { state: 'WB', turnout: 73 },
];

export default async function AdminDashboardPage({ params }: { params: Promise<{ role: AdminRole }> }) {
  const { role } = await params;
  
  return (
    <AdminLayout role={role}>
      <div>
        <h1 className="text-2xl font-heading font-bold mb-6">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Vote} label="Active Elections" value={3} />
          <StatCard icon={Users} label="Registered Voters" value="91.2 Cr" />
          <StatCard icon={BarChart3} label="Avg. Turnout" value="67.3%" />
          <StatCard icon={FileText} label="Documents" value={24} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="govt-card p-6">
            <h3 className="font-heading font-semibold mb-4">State-wise Turnout</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={turnoutData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="turnout" fill="hsl(224, 60%, 26%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="govt-card p-6">
            <h3 className="font-heading font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { icon: Shield, text: 'Maharashtra Assembly Election started', time: '2 hours ago' },
                { icon: Users, text: '1,245 new voter registrations today', time: '3 hours ago' },
                { icon: Globe, text: 'Delhi Municipal results published', time: '5 hours ago' },
                { icon: FileText, text: 'New election notification uploaded', time: '1 day ago' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <item.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="flex-1">{item.text}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
