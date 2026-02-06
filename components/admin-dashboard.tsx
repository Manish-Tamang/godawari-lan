'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TeamCard } from '@/components/team-card';
import { PaymentCalculator } from '@/components/payment-calculator';
import { createClient } from '@/lib/supabase/client';

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

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, revenue: 0 });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setIsDataLoading(true);
    try {
      const response = await fetch('/api/register');
      const data = await response.json();
      if (data.registrations) {
        setRegistrations(data.registrations);
        updateFilters(data.registrations, filterStatus, searchTerm);
        updateStats(data.registrations);
      }
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const updateFilters = (data: Registration[], status: string, search: string) => {
    let filtered = data;

    if (status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }

    if (search.trim()) {
      filtered = filtered.filter(r =>
        r.teamName.toLowerCase().includes(search.toLowerCase()) ||
        r.iglName.toLowerCase().includes(search.toLowerCase()) ||
        r.iglPhone.includes(search)
      );
    }

    setFilteredRegistrations(filtered);
  };

  const updateStats = (data: Registration[]) => {
    const approved = data.filter(r => r.status === 'approved').length;
    const revenue = approved * 250;

    setStats({
      total: data.length,
      pending: data.filter(r => r.status === 'pending').length,
      approved,
      rejected: data.filter(r => r.status === 'rejected').length,
      revenue,
    });
  };

  const handleStatusChange = async (id: string, newStatus: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          status: newStatus,
          payment_verified: newStatus === 'approved'
        })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      const updated = registrations.map(r =>
        r.id === id ? { ...r, status: newStatus, paymentVerified: newStatus === 'approved' } : r
      );
      setRegistrations(updated);
      updateFilters(updated, filterStatus, searchTerm);
      updateStats(updated);
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    updateFilters(registrations, filterStatus, value);
  };

  const handleFilterChange = (status: 'all' | 'pending' | 'approved' | 'rejected') => {
    setFilterStatus(status);
    updateFilters(registrations, status, searchTerm);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tournament Management</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCalculator(!showCalculator)}
              className="bg-accent hover:bg-accent/90 text-accent-foreground h-10"
            >
              {showCalculator ? 'Hide' : 'Show'} Calculator
            </Button>
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-destructive hover:bg-destructive/10 bg-transparent border-destructive/20 h-10"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <div className="bg-card rounded-lg border border-border p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Total</div>
            <div className="text-xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Pending</div>
            <div className="text-xl font-bold text-secondary">{stats.pending}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Approved</div>
            <div className="text-xl font-bold text-primary">{stats.approved}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Rejected</div>
            <div className="text-xl font-bold text-destructive">{stats.rejected}</div>
          </div>
          <div className="bg-card rounded-lg border border-border p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Revenue</div>
            <div className="text-xl font-bold text-primary">NPR {stats.revenue}</div>
          </div>
        </div>

        {/* Payment Calculator */}
        {showCalculator && <PaymentCalculator approvedTeams={stats.approved} />}

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div>
            <Input
              type="search"
              placeholder="Search by team name, IGL name, or phone number..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="bg-card border-border h-12"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary'
                }`}
            >
              All Teams
            </button>
            <button
              onClick={() => handleFilterChange('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === 'pending'
                ? 'bg-accent text-accent-foreground'
                : 'bg-card border border-border text-foreground hover:border-accent'
                }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => handleFilterChange('approved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === 'approved'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary'
                }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => handleFilterChange('rejected')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === 'rejected'
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-card border border-border text-foreground hover:border-destructive'
                }`}
            >
              Rejected ({stats.rejected})
            </button>
          </div>
        </div>

        {/* Teams List */}
        <div className="space-y-4">
          {isDataLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground animate-pulse">Loading registrations...</p>
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg border border-border">
              <p className="text-muted-foreground">No teams found</p>
            </div>
          ) : (
            filteredRegistrations.map(team => (
              <TeamCard
                key={team.id}
                team={team}
                isExpanded={expandedId === team.id}
                onToggleExpand={() => setExpandedId(expandedId === team.id ? null : team.id)}
                onStatusChange={handleStatusChange}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
