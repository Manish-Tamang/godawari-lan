'use client';

import React from "react"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
    } else {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border border-border p-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Panel</h1>
          <p className="text-muted-foreground mb-8">Sign in to manage the tournament registrations</p>

          {error && (
            <Alert className="mb-6 bg-destructive/10 border-destructive">
              <AlertDescription className="text-destructive">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-border"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border"
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !password || !email}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12"
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
