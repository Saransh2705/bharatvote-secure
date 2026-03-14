"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';
import type { AdminRole } from '@/lib/mockData';

const roles: { value: AdminRole; label: string }[] = [
  { value: 'super', label: 'Super Admin' },
  { value: 'ec', label: 'EC Admin' },
  { value: 'state', label: 'State Admin' },
  { value: 'district', label: 'District Admin' },
  { value: 'constituency', label: 'Constituency Admin' },
  { value: 'booth', label: 'Booth Admin' },
  { value: 'staff', label: 'Booth Staff' },
];

export default function AdminLogin() {
  const [role, setRole] = useState<AdminRole>('super');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/${role}`);
  };

  return (
    <Layout>
      <div className="govt-section min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <Shield className="h-12 w-12 text-primary mx-auto mb-3" />
            <h1 className="text-2xl font-heading font-bold">Admin Login</h1>
            <p className="text-sm text-muted-foreground">Authorized personnel only</p>
          </div>

          <form onSubmit={handleLogin} className="govt-card p-6 space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="admin@bharatvote.gov.in" defaultValue="admin@bharatvote.gov.in" className="mt-1" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" defaultValue="password" className="mt-1" />
            </div>
            <div>
              <Label>Role (Demo)</Label>
              <Select value={role} onValueChange={(v) => setRole(v as AdminRole)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>2FA Code (Optional)</Label>
              <Input placeholder="6-digit code" className="mt-1" />
            </div>
            <Button type="submit" className="w-full">
              <Lock className="h-4 w-4 mr-2" /> Sign In
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
