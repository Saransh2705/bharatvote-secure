"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Shield, LayoutDashboard, Users, FileText, BarChart3, Vote,
  MapPin, Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import type { AdminRole } from '@/lib/mockData';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

const roleMenus: Record<AdminRole, NavItem[]> = {
  super: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '' },
    { label: 'Elections', icon: Vote, path: 'elections' },
    { label: 'EC Admins', icon: Users, path: 'users' },
    { label: 'Documents', icon: FileText, path: 'documents' },
    { label: 'Analytics', icon: BarChart3, path: 'analytics' },
    { label: 'Settings', icon: Settings, path: 'settings' },
  ],
  ec: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '' },
    { label: 'State Admins', icon: Users, path: 'users' },
    { label: 'Elections', icon: Vote, path: 'elections' },
    { label: 'Analytics', icon: BarChart3, path: 'analytics' },
  ],
  state: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '' },
    { label: 'District Admins', icon: Users, path: 'users' },
    { label: 'Voting Progress', icon: BarChart3, path: 'analytics' },
  ],
  district: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '' },
    { label: 'Constituency Admins', icon: Users, path: 'users' },
    { label: 'Booths', icon: MapPin, path: 'booths' },
  ],
  constituency: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '' },
    { label: 'Booth Admins', icon: Users, path: 'users' },
    { label: 'Manage Booths', icon: MapPin, path: 'booths' },
  ],
  booth: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '' },
    { label: 'Staff', icon: Users, path: 'users' },
    { label: 'Voter Registration', icon: Vote, path: 'registration' },
    { label: 'Turnout', icon: BarChart3, path: 'analytics' },
  ],
  staff: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '' },
    { label: 'Verify Voters', icon: Users, path: 'verify' },
    { label: 'Voter Queue', icon: BarChart3, path: 'queue' },
  ],
};

const roleLabels: Record<AdminRole, string> = {
  super: 'Super Admin',
  ec: 'EC Admin',
  state: 'State Admin',
  district: 'District Admin',
  constituency: 'Constituency Admin',
  booth: 'Booth Admin',
  staff: 'Booth Staff',
};

export default function AdminLayout({ role, children }: { role: AdminRole; children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const menu = roleMenus[role];
  const basePath = `/admin/${role}`;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'} transition-all duration-200 govt-banner text-primary-foreground flex flex-col shrink-0`}>
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-saffron" />
            <span className="font-heading font-bold text-sm">BharatVote Admin</span>
          </div>
          <p className="text-xs opacity-70 mt-1">{roleLabels[role]}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menu.map(item => {
            const fullPath = item.path ? `${basePath}/${item.path}` : basePath;
            const isActive = pathname === fullPath;
            return (
              <Link
                key={item.label}
                href={fullPath}
                className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
                  isActive ? 'bg-primary-foreground/20 font-medium' : 'hover:bg-primary-foreground/10'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-primary-foreground/20">
          <Link href="/admin/login" className="flex items-center gap-3 px-3 py-2 rounded text-sm hover:bg-primary-foreground/10">
            <LogOut className="h-4 w-4" /> Sign Out
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="saffron-stripe" />
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-secondary rounded"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{roleLabels[role]} Dashboard</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto bg-secondary/30">
          {children}
        </main>
      </div>
    </div>
  );
}
