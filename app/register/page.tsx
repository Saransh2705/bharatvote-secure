"use client"

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Camera, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { states } from '@/lib/mockData';
import Layout from '@/components/Layout';

// Dynamically import Webcam to avoid SSR issues
// @ts-expect-error - Type incompatibility between react-webcam and Next.js dynamic
const Webcam: any = dynamic(() => import('react-webcam').then(mod => mod.default), { ssr: false });

export default function VoterRegistration() {
    const [step, setStep] = useState<'form' | 'capture' | 'done'>('form');
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const webcamRef = useRef<any>(null);

    const capture = useCallback(() => {
        const img = webcamRef.current?.getScreenshot();
        if (img) {
            setCapturedImages(prev => [...prev, img]);
        }
    }, []);

    const retake = () => setCapturedImages([]);

    if (step === 'done') {
        return (
            <Layout>
                <div className="govt-section">
                    <div className="container mx-auto px-4 max-w-lg text-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-block">
                            <CheckCircle className="h-20 w-20 text-green-india mx-auto mb-4" />
                        </motion.div>
                        <h1 className="text-2xl font-heading font-bold mb-2">Registration Submitted</h1>
                        <p className="text-muted-foreground">Your voter registration has been submitted for verification. You will receive confirmation within 7 working days.</p>
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
                            <Webcam
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full rounded"
                                videoConstraints={{ facingMode: 'user' }}
                            />
                        </div>

                        <div className="flex gap-2 mb-4">
                            {[0, 1, 2].map(i => (
                                <div key={i} className={`flex-1 h-20 rounded border-2 border-dashed flex items-center justify-center overflow-hidden ${capturedImages[i] ? 'border-green-india' : 'border-border'
                                    }`}>
                                    {capturedImages[i] ? (
                                        <img src={capturedImages[i]} alt={`Capture ${i + 1}`} className="h-full w-full object-cover" />
                                    ) : (
                                        <Camera className="h-5 w-5 text-muted-foreground" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <p className="text-sm text-muted-foreground mb-4">{capturedImages.length}/3 photos captured</p>

                        <div className="flex gap-2">
                            {capturedImages.length < 3 ? (
                                <Button onClick={capture} className="flex-1">
                                    <Camera className="h-4 w-4 mr-2" /> Capture Photo
                                </Button>
                            ) : (
                                <Button onClick={() => setStep('done')} className="flex-1 bg-green-india hover:bg-green-india/90">
                                    <CheckCircle className="h-4 w-4 mr-2" /> Submit Registration
                                </Button>
                            )}
                            <Button variant="outline" onClick={retake}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="govt-section">
                <div className="container mx-auto px-4 max-w-lg">
                    <h1 className="text-2xl font-heading font-bold mb-2">Voter Registration</h1>
                    <p className="text-muted-foreground mb-6">Register with your EPIC number and verify your identity</p>

                    <div className="govt-card p-6 space-y-4">
                        <div>
                            <Label>EPIC Number</Label>
                            <Input placeholder="e.g. ABC1234567" className="mt-1" />
                        </div>
                        <div>
                            <Label>Full Name</Label>
                            <Input placeholder="As per voter ID" className="mt-1" />
                        </div>
                        <div>
                            <Label>Date of Birth</Label>
                            <Input type="date" className="mt-1" />
                        </div>
                        <div>
                            <Label>State</Label>
                            <Select>
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select State" /></SelectTrigger>
                                <SelectContent>
                                    {states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>District</Label>
                            <Input placeholder="Your district" className="mt-1" />
                        </div>
                        <div>
                            <Label>Constituency</Label>
                            <Input placeholder="Your constituency" className="mt-1" />
                        </div>
                        <Button onClick={() => setStep('capture')} className="w-full">
                            Proceed to Face Capture
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
