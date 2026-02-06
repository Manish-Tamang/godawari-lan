'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface Player {
  name: string;
  uid: string;
}

interface Registration {
  id: string;
  teamName: string;
  iglName: string;
  iglPhone: string;
  players: Player[];
  paymentScreenshot: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  paymentAmount: number;
  paymentVerified: boolean;
}

interface TeamCardProps {
  team: Registration;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (id: string, status: 'approved' | 'rejected') => void;
}

export function TeamCard({
  team,
  isExpanded,
  onToggleExpand,
  onStatusChange,
}: TeamCardProps) {
  const statusColors = {
    pending: 'bg-accent/10 border-accent text-accent',
    approved: 'bg-primary/10 border-primary text-primary',
    rejected: 'bg-destructive/10 border-destructive text-destructive',
  };

  const registeredDate = new Date(team.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden transition-all duration-200">
      {/* Header */}
      <div
        onClick={onToggleExpand}
        className="p-4 sm:p-5 cursor-pointer hover:bg-muted/30 transition flex items-center justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className="text-base font-medium">{team.teamName}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[team.status]}`}>
              {team.status.toUpperCase()}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>{team.iglName}</span>
            <span>{team.iglPhone}</span>
            <span className="opacity-60">{registeredDate}</span>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border p-4 sm:p-5 space-y-6 bg-muted/5">
          {/* Players */}
          <div>
            <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-medium">Players</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {team.players.map((player, idx) => (
                <div key={idx} className="bg-white rounded border border-border p-2.5">
                  <div className="text-xs font-medium">{player.name}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">UID: {player.uid}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Screenshot Layout */}
            <div className="space-y-3">
              <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Payment Screenshot</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative aspect-[4/3] w-full bg-white border border-border rounded-lg cursor-zoom-in overflow-hidden group">
                    <img
                      src={team.paymentScreenshot}
                      alt="Payment Receipt"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl border-none p-0 bg-transparent shadow-none">
                  <DialogHeader className="sr-only">
                    <DialogTitle>Payment Screenshot</DialogTitle>
                  </DialogHeader>
                  <div className="relative w-full h-[80vh]">
                    <img
                      src={team.paymentScreenshot}
                      alt="Zoomed Payment Receipt"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Verification Stats */}
            <div className="space-y-4 flex flex-col justify-end">
              <div className="bg-white rounded border border-border p-4">
                <div className="text-[10px] uppercase text-muted-foreground mb-1">Fee Amount</div>
                <div className="text-xl font-bold text-primary">NPR {team.paymentAmount}</div>
              </div>
              <div className="bg-white rounded border border-border p-4">
                <div className="text-[10px] uppercase text-muted-foreground mb-1">Status</div>
                <div className={`text-sm font-medium ${team.paymentVerified ? 'text-primary' : 'text-muted-foreground'}`}>
                  {team.paymentVerified ? '✓ Payment Verified' : '○ Pending Verification'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          {team.status === 'pending' && (
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                onClick={() => onStatusChange(team.id, 'approved')}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-10 text-xs font-medium"
              >
                Approve Team
              </Button>
              <Button
                onClick={() => onStatusChange(team.id, 'rejected')}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground h-10 text-xs font-medium"
              >
                Reject Team
              </Button>
            </div>
          )}

          {team.status === 'approved' && (
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                onClick={() => onStatusChange(team.id, 'rejected')}
                variant="outline"
                className="flex-1 text-destructive hover:bg-destructive/10 border-destructive/20 h-10 text-xs font-medium"
              >
                Reject Team
              </Button>
            </div>
          )}

          {team.status === 'rejected' && (
            <div className="flex gap-2 pt-4 border-t border-border">
              <Button
                onClick={() => onStatusChange(team.id, 'approved')}
                variant="outline"
                className="flex-1 h-10 text-xs font-medium"
              >
                Approve Team
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
