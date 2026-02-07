'use client';

import React from "react"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from "sonner"

interface TeamData {
  teamName: string;
  iglName: string;
  iglPhone: string;
  players: Array<{
    name: string;
    uid: string;
  }>;
  paymentScreenshot: File | null;
}

export function RegistrationForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState<TeamData>({
    teamName: '',
    iglName: '',
    iglPhone: '',
    players: [
      { name: '', uid: '' },
      { name: '', uid: '' },
      { name: '', uid: '' },
      { name: '', uid: '' },
    ],
    paymentScreenshot: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    if (field === 'iglPhone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [field]: numericValue }));
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlayerChange = (index: number, field: string, value: string) => {
    const processedValue = field === 'uid' ? value.replace(/\D/g, '') : value;
    setFormData(prev => {
      const newPlayers = [...prev.players];
      newPlayers[index] = { ...newPlayers[index], [field]: processedValue };
      return { ...prev, players: newPlayers };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, paymentScreenshot: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!formData.teamName.trim()) throw new Error('Team name is required');
      if (!formData.iglName.trim()) throw new Error('Leader name is required');
      if (!/^\d{10}$/.test(formData.iglPhone)) throw new Error('Valid 10-digit WhatsApp number is required');

      for (let i = 0; i < formData.players.length; i++) {
        if (!formData.players[i].name.trim()) throw new Error(`Player ${i + 1} name is missing`);
        if (!formData.players[i].uid.trim()) throw new Error(`Player ${i + 1} UID is missing`);
      }

      if (!formData.paymentScreenshot) throw new Error('Please upload payment proof');

      const submitData = new FormData();
      submitData.append('teamName', formData.teamName);
      submitData.append('iglName', formData.iglName);
      submitData.append('iglPhone', formData.iglPhone);
      submitData.append('players', JSON.stringify(formData.players));
      submitData.append('paymentScreenshot', formData.paymentScreenshot);

      const response = await fetch('/api/register', {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) throw new Error('Registration failed. Please try again.');

      toast.success('Registration submitted successfully!');
      setIsSubmitted(true);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An error occurred';
      setMessage({ type: 'error', text: errorMsg });
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-white border border-border p-8 sm:p-12 rounded-lg text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-medium">Registration Received!</h2>
            <p className="text-sm text-muted-foreground">Your team has been successfully registered for Godawari Lan 2026.</p>
          </div>

          <div className="p-6 bg-muted/20 border border-border/40 rounded-xl space-y-4">
            <p className="text-sm font-medium">Join our official WhatsApp group to get tournament updates, brackets, and match timings.</p>
            <a
              href="https://chat.whatsapp.com/Lm7cqbxTpsx3O2SWmXMj1P?mode=gi_c"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full bg-[#25D366] hover:bg-[#20bd5a] text-white h-12 rounded-md font-medium transition-all shadow-sm"
            >
              Join WhatsApp Group
            </a>
          </div>

          <div className="pt-4 space-y-1">
            <p className="text-xs text-muted-foreground">For any queries, please contact:</p>
            <p className="text-sm font-medium text-foreground">Razz Karki <span className="text-xs font-normal opacity-60">(Event Coordinator)</span></p>
            <a href="tel:9708714590" className="text-sm text-primary hover:underline transition">9708714590</a>
          </div>

          <button
            onClick={onSuccess}
            className="text-xs text-muted-foreground hover:text-foreground pt-4 block w-full text-center"
          >
            ← Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white border border-border p-4 sm:p-8 rounded-lg">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-xl font-medium">Tournament Registration</h2>
          <p className="text-xs text-muted-foreground mt-1">Fill in your team details for Godawari Lan 2026</p>
        </div>

        {/* Intra-College Disclaimer */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-tight">Intra-College Event Only</p>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              This tournament is exclusively for <span className="font-semibold">Sushma Godawari College students</span>.
              Participants from other institutions will be disqualified during verification.
            </p>
          </div>
        </div>

        {message && message.type === 'error' && (
          <div className="mb-6 p-3 rounded text-xs bg-red-50 text-red-700">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Team Section */}
          <section className="space-y-4">
            <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground border-l-2 border-primary pl-2">General Information</h3>
            <div className="grid gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Team Name</label>
                <Input
                  placeholder="e.g. Team Phoenix"
                  value={formData.teamName}
                  onChange={(e) => handleInputChange('teamName', e.target.value)}
                  className="h-10 text-sm shadow-none focus-visible:ring-1"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Leader Name (IGL)</label>
                  <Input
                    placeholder="Full Name"
                    value={formData.iglName}
                    onChange={(e) => handleInputChange('iglName', e.target.value)}
                    className="h-10 text-sm shadow-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">WhatsApp Number</label>
                  <Input
                    type="tel"
                    placeholder="10-digit number"
                    value={formData.iglPhone}
                    onChange={(e) => handleInputChange('iglPhone', e.target.value)}
                    className="h-10 text-sm shadow-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Roster Section */}
          <section className="space-y-4">
            <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground border-l-2 border-primary pl-2">Player Roster</h3>
            <div className="space-y-3">
              {formData.players.map((player, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 sm:p-4 bg-muted/20 rounded border border-border/40">
                  <div className="sm:col-span-2 text-[10px] text-muted-foreground mb-1 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {index + 1}
                    </span>
                    PLAYER {index + 1}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-muted-foreground">Full Name</label>
                    <Input
                      placeholder="Name"
                      value={player.name}
                      onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                      className="h-9 text-sm bg-white shadow-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-muted-foreground">Free Fire UID</label>
                    <Input
                      placeholder="Numbers only"
                      value={player.uid}
                      onChange={(e) => handlePlayerChange(index, 'uid', e.target.value)}
                      className="h-9 text-sm bg-white shadow-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Section */}
          <section className="space-y-4">
            <h3 className="text-[11px] uppercase tracking-wider text-muted-foreground border-l-2 border-primary pl-2">Payment Verification</h3>
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3 p-5 bg-muted/20 border border-border/40 rounded-lg">
                <div className="w-40 h-40 bg-white p-2 rounded-md border border-border shadow-sm">
                  <img
                    src="/qr.jpg"
                    alt="Payment QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs font-medium">Mohammad keif Ali</p>
                  <p className="text-[10px] text-muted-foreground tracking-tight underline underline-offset-4">Scan QR to pay NPR 250</p>
                </div>
              </div>

              <div className="bg-primary/[0.03] border border-primary/10 p-3 rounded text-[10px] text-muted-foreground">
                Note: Please mention your team name in remarks.
              </div>

              <div className="relative border border-dashed border-border p-4 sm:p-6 rounded-lg hover:bg-muted/30 transition text-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs text-muted-foreground">
                    {formData.paymentScreenshot ? (
                      <span className="text-primary font-medium">{formData.paymentScreenshot.name}</span>
                    ) : 'Click to upload screenshot'}
                  </div>
                  <p className="text-[9px] text-muted-foreground/60 uppercase">Max size: 5MB (JPG, PNG)</p>
                </div>
              </div>
            </div>
          </section>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 rounded font-medium shadow-none transition-none"
            >
              {isLoading ? 'Processing...' : 'Register Team'}
            </Button>
            <button
              type="button"
              onClick={onSuccess}
              className="text-xs text-muted-foreground hover:underline"
            >
              Cancel and Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
