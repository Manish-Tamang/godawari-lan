'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface PaymentCalculatorProps {
  approvedTeams: number;
}

export function PaymentCalculator({ approvedTeams }: PaymentCalculatorProps) {
  const [customTeams, setCustomTeams] = useState(approvedTeams);
  const registrationFee = 250;

  const totalRevenue = customTeams * registrationFee;
  const platformFee = Math.round(totalRevenue * 0.05); // 5% platform fee
  const netRevenue = totalRevenue - platformFee;

  useEffect(() => {
    setCustomTeams(approvedTeams);
  }, [approvedTeams]);

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-8">
      <h3 className="font-bold text-lg text-primary mb-6">Payment Calculator</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Approved Teams */}
        <div>
          <label className="block text-xs uppercase text-muted-foreground font-medium mb-2">Approved Teams</label>
          <Input
            type="number"
            value={customTeams}
            onChange={(e) => setCustomTeams(Math.max(0, parseInt(e.target.value) || 0))}
            className="bg-background border-border text-lg font-bold"
            min="0"
          />
        </div>

        {/* Registration Fee Per Team */}
        <div>
          <label className="block text-xs uppercase text-muted-foreground font-medium mb-2">Fee Per Team</label>
          <div className="bg-background rounded px-4 py-2 text-lg font-bold">
            NPR {registrationFee}
          </div>
        </div>

        {/* Total Revenue */}
        <div>
          <label className="block text-xs uppercase text-muted-foreground font-medium mb-2">Total Revenue</label>
          <div className="bg-primary/10 border border-primary rounded px-4 py-2 text-lg font-bold text-primary">
            NPR {totalRevenue.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Net Revenue After Fees */}
        <div>
          <label className="block text-xs uppercase text-muted-foreground font-medium mb-2">Net Revenue</label>
          <div className="bg-accent/10 border border-accent rounded px-4 py-2 text-lg font-bold text-accent">
            NPR {netRevenue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="border-t border-border pt-6">
        <h4 className="font-medium text-sm uppercase text-muted-foreground mb-4">Revenue Breakdown</h4>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Registration Revenue ({customTeams} teams × NPR {registrationFee})</span>
            <span className="font-bold">NPR {totalRevenue.toLocaleString('en-IN')}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm">Platform Fee (5%)</span>
            <span className="font-bold text-destructive">-NPR {platformFee.toLocaleString('en-IN')}</span>
          </div>

          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span className="text-sm font-bold">Total Collected (After Fees)</span>
            <span className="text-lg font-bold text-primary">NPR {netRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-background/50 rounded p-4 border border-border">
        <p className="text-xs text-muted-foreground">
          <strong>Note:</strong> These calculations are based on approved teams only. The 5% platform fee is a reference calculation.
          Actual fees may vary based on payment gateway and bank charges.
        </p>
      </div>
    </div>
  );
}
