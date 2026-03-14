"use client"

import { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';

// @ts-expect-error - Type incompatibility between react-webcam and Next.js dynamic
const Webcam: any = dynamic(() => import('react-webcam').then(mod => mod.default), { ssr: false });

type Step = 'epic' | 'face' | 'verifying' | 'success' | 'failed';

export default function VerifyVote() {
  const [step, setStep] = useState<Step>('epic');
  const [epic, setEpic] = useState('');
  const webcamRef = useRef<any>(null);
  const router = useRouter();

  const startVerification = useCallback(() => {
    const img = webcamRef.current?.getScreenshot();
    if (img) {
      setStep('verifying');
      // Simulate verification
      setTimeout(() => {
        setStep(Math.random() > 0.2 ? 'success' : 'failed');``
      }, 3000);
    }
  }, []);

  return (
    <Layout>
      <div className="govt-section">
        <div className="container mx-auto px-4 max-w-lg">
          <h1 className="text-2xl font-heading font-bold mb-2">Verify & Vote</h1>
          <p className="text-muted-foreground mb-6">Verify your identity to proceed to voting</p>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-8">
            {['EPIC Number', 'Face Capture', 'Verification'].map((label, i) => {
              const stepIndex = ['epic', 'face', 'verifying'].indexOf(step);
              const active = i <= (step === 'success' || step === 'failed' ? 2 : stepIndex);
              return (
                <div key={label} className="flex-1">
                  <div className={`h-1 rounded ${active ? 'bg-primary' : 'bg-border'}`} />
                  <p className={`text-xs mt-1 ${active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</p>
                </div>
              );
            })}
          </div>

          {step === 'epic' && (
            <div className="govt-card p-6">
              <Label>Enter your EPIC Number</Label>
              <Input
                value={epic}
                onChange={e => setEpic(e.target.value)}
                placeholder="e.g. ABC1234567"
                className="mt-2 mb-4"
              />
              <Button onClick={() => setStep('face')} disabled={!epic.trim()} className="w-full">
                Continue
              </Button>
            </div>
          )}

          {step === 'face' && (
            <div className="govt-card p-6">
              <p className="text-sm text-muted-foreground mb-4">Look directly at the camera and click Verify</p>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded mb-4"
                videoConstraints={{ facingMode: 'user' }}
              />
              <Button onClick={startVerification} className="w-full">
                <Camera className="h-4 w-4 mr-2" /> Capture & Verify
              </Button>
            </div>
          )}

          {step === 'verifying' && (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="inline-block"
              >
                <Loader2 className="h-16 w-16 text-primary" />
              </motion.div>
              <p className="mt-4 font-semibold">Verifying your identity...</p>
              <p className="text-sm text-muted-foreground">Please wait while we process your facial data</p>
            </div>
          )}

          {step === 'success' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
              <CheckCircle className="h-20 w-20 text-green-india mx-auto mb-4" />
              <h2 className="text-xl font-heading font-bold mb-2">Identity Verified</h2>
              <p className="text-muted-foreground mb-6">You are now authorized to cast your vote</p>
              <Button onClick={() => router.push('/vote')} size="lg">
                Proceed to Vote
              </Button>
            </motion.div>
          )}

          {step === 'failed' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
              <XCircle className="h-20 w-20 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-heading font-bold mb-2">Verification Failed</h2>
              <p className="text-muted-foreground mb-6">Face mismatch detected. Please try again.</p>
              <Button onClick={() => setStep('face')} variant="outline">
                Try Again
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
