import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Search,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { plansConfig } from '../../config/plans';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminService.getDashboardStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const filteredUsers = (stats?.recentUsers || []).filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white tracking-tight">
            Administrative Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time platform metrics, active subscriptions, and pending payment verifications.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-brand-600' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchStats}
            className="font-bold underline hover:opacity-80"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 4 Statistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Total Customers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Customers
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            {loading ? (
              <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            ) : (
              stats?.totalCustomers ?? '—'
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>Registered trainee learners</span>
          </p>
        </div>

        {/* Active Subscriptions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Active Subscriptions
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-emerald-700 dark:text-emerald-400">
            {loading ? (
              <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            ) : (
              stats?.activeSubscriptions ?? '—'
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Full theory & exam access
          </p>
        </div>

        {/* Pending Payments */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending Payments
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-amber-700 dark:text-amber-400">
            {loading ? (
              <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            ) : (
              stats?.pendingPayments ?? '—'
            )}
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1.5 font-medium">
            Requires manual verification
          </p>
        </div>

        {/* Expired Subscriptions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Expired Subscriptions
            </span>
            <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-extrabold text-3xl text-slate-900 dark:text-white">
            {loading ? (
              <div className="w-16 h-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            ) : (
              stats?.expiredSubscriptions ?? '—'
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
            Eligible for plan renewal
          </p>
        </div>
      </div>

      {/* Subscription Plan Distribution Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Plan Distribution & Official Pricing
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Centralized pricing: 1 Day (500 RWF), 1 Week (1,500 RWF), 1 Month (3,000 RWF).
            </p>
          </div>
          <Link
            to="/admin/subscriptions"
            className="text-xs font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-400 flex items-center gap-1"
          >
            <span>All Subscriptions</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* 1 Day Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">1 Day Pass</span>
                <p className="font-display font-bold text-xl text-slate-900 dark:text-white">500 RWF</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                {stats?.planDistribution?.daily ?? 0} active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              24-hour fast revision tier
            </p>
          </div>

          {/* 1 Week Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">1 Week Pass</span>
                <p className="font-display font-bold text-xl text-slate-900 dark:text-white">1,500 RWF</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                {stats?.planDistribution?.weekly ?? 0} active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              7-day comprehensive sprint tier
            </p>
          </div>

          {/* 1 Month Card */}
          <div className="p-4 rounded-2xl bg-brand-50/50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-brand-700 dark:text-brand-400">1 Month Pass</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-brand-700 text-white">BEST VALUE</span>
                </div>
                <p className="font-display font-bold text-xl text-slate-900 dark:text-white">3,000 RWF</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-brand-300 dark:border-brand-800 text-brand-700 dark:text-brand-400">
                {stats?.planDistribution?.monthly ?? 0} active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              30-day complete unlimited preparation
            </p>
          </div>
        </div>
      </div>

      {/* Dual Section: Recent Payments & Recent Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Payments (with quick verify link) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Recent Payments
            </h2>
            <Link
              to="/admin/payments"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-400 flex items-center gap-1"
            >
              <span>Manage Payments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (stats?.recentPayments || []).length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
              No payments submitted yet.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.recentPayments.map((p) => (
                <div key={p._id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {p.user?.name || 'Customer'}
                      </p>
                      <span className="text-[11px] font-mono text-slate-400">
                        ({p.plan ? p.plan.toUpperCase() : 'PLAN'})
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {p.paymentPhoneNumber || p.user?.phone || 'No phone'} • {p.amount?.toLocaleString()} {p.currency || 'RWF'}
                    </p>
                  </div>

                  <div>
                    {p.status === 'verified' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    ) : p.status === 'rejected' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800">
                        <XCircle className="w-3 h-3" />
                        <span>Rejected</span>
                      </span>
                    ) : (
                      <Link
                        to="/admin/payments"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-200 transition-colors"
                      >
                        <Clock className="w-3 h-3" />
                        <span>Verify Pending</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Customers */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Recent Customers
            </h2>
            <Link
              to="/admin/users"
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-400 flex items-center gap-1"
            >
              <span>View All Users</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search recent customers..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {loading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800/60 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-6 text-center">
              No matching customers found.
            </p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((u) => (
                <div key={u._id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {u.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {u.email} • {u.phone || 'No phone'}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.subscription?.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : u.subscription?.status === 'awaiting_verification'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {u.subscription?.status || 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

