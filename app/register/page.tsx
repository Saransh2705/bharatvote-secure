"use client"

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Camera, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { states } from '@/lib/mockData';
import { setUser } from '@/lib/session';
import Layout from '@/components/Layout';

// @ts-expect-error - Type incompatibility between react-webcam and Next.js dynamic
const Webcam: any = dynamic(() => import('react-webcam').then(mod => mod.default), { ssr: false });

export default function VoterRegistration() {
    const router = useRouter();
    const [step, setStep] = useState<'form' | 'capture' | 'done'>('form');
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [epic, setEpic] = useState('');
    const [fullName, setFullName] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const webcamRef = useRef<any>(null);

    const capture = useCallback(() => {
        const img = webcamRef.current?.getScreenshot();
        if (img) setCapturedImages(prev => [...prev, img]);
    }, []);

    const retake = () => setCapturedImages([]);

    async function submitRegistration() {
        setSubmitting(true); setError('');
        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ full_name: fullName, voter_id: epic, state, face_data: capturedImages[0] || null }),
            });
            const j = await res.json();
            if (!res.ok) { setError(j.error || 'Registration failed'); return; }
            setUser({ id: j.data.id, full_name: j.data.full_name, voter_id: j.data.voter_id });
            setStep('done');
        } catch {
            setError('Network error — please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    if (step === 'done') {
        return (
            <Layout>
                <div className="govt-section">
                    <div className="container mx-auto px-4 max-w-lg text-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block">
                            <CheckCircle className="h-20 w-20 text-green-india mx-auto mb-4" />
                        </motion.div>
                        <h1 className="text-2xl font-heading font-bold mb-2">Registration Complete</h1>
                        <p className="text-muted-foreground mb-6">Welcome, {fullName}. Your voter identity is verified and active — you can now cast your vote.</p>
                        <Button onClick={() => router.push('/vote')}>Go to Voting</Button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (step === 'capture') {
        return (
            <Layout>
                <div className="govt-section">
                    <div className="container mx-auto px-4 max-w-lg">
                        <h1 className="text-2xl font-heading font-bold mb-2">Face Capture</h1>
                        <p className="text-muted-foreground mb-6">Capture 3 photos for facial verification</p>

                        <div className="govt-card p-4 mb-4">
                            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="w-full rounded" videoConstraints={{ facingMode: 'user' }} />
                        </div>

                        <div className="flex gap-2 mb-4">
                            {[0, 1, 2].map(i => (
                                <div key={i} className={`flex-1 h-20 rounded border-2 border-dashed flex items-center justify-center overflow-hidden ${capturedImages[i] ? 'border-green-india' : 'border-border'}`}>
                                    {capturedImages[i] ? <img src={capturedImages[i]} alt={`Capture ${i + 1}`} className="h-full w-full object-cover" /> : <Camera className="h-5 w-5 text-muted-foreground" />}
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{capturedImages.length}/3 photos captured</p>
                        {error && <p className="text-sm text-red-600 mb-3 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{error}</p>}

                        <div className="flex gap-2">
                            {capturedImages.length < 3 ? (
                                <Button onClick={capture} className="flex-1"><Camera className="h-4 w-4 mr-2" /> Capture Photo</Button>
                            ) : (
                                <Button onClick={submitRegistration} disabled={submitting} className="flex-1 bg-green-india hover:bg-green-india/90">
                                    <CheckCircle className="h-4 w-4 mr-2" /> {submitting ? 'Submitting…' : 'Submit Registration'}
                                </Button>
                            )}
                            <Button variant="outline" onClick={retake}><RefreshCw className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    const canProceed = fullName.trim().length > 1 && epic.trim().length > 3;

    return (
        <Layout>
            <div className="govt-section">
                <div className="container mx-auto px-4 max-w-lg">
                    <h1 className="text-2xl font-heading font-bold mb-2">Voter Registration</h1>
                    <p className="text-muted-foreground mb-6">Register with your EPIC number and verify your identity</p>

                    <div className="govt-card p-6 space-y-4">
                        <div>
                            <Label>EPIC Number</Label>
                            <Input value={epic} onChange={e => setEpic(e.target.value)} placeholder="e.g. ABC1234567" className="mt-1" />
                        </div>
                        <div>
                            <Label>Full Name</Label>
                            <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="As per voter ID" className="mt-1" />
                        </div>
                        <div>
                            <Label>Date of Birth</Label>
                            <Input type="date" className="mt-1" />
                        </div>
                        <div>
                            <Label>State</Label>
                            <Select value={state} onValueChange={setState}>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select State" /></SelectTrigger>
                                <SelectContent>
                                    {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>District</Label>
                            <Input value={district} onChange={e => setDistrict(e.target.value)} placeholder="Your district" className="mt-1" />
                        </div>
                        <Button onClick={() => setStep('capture')} disabled={!canProceed} className="w-full">
                            Proceed to Face Capture
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
