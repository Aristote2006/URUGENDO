import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Layers,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function UserDetailsModal({ userId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await adminService.getUserById(userId);
        if (res.success && res.data) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load user details.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  if (!userId) return null;

  const user = data?.user;
  const payments = data?.payments || [];
  const subscriptions = data?.subscriptions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400 flex items-center justify-center font-bold text-base">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {user?.name || 'Customer Details'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customer ID: <span className="font-mono">{userId}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {loading ? (
            <div className="space-y-4 py-8">
              <div className="h-6 w-1/3 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ) : user ? (
            <>
              {/* Personal Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Full Name
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user.name}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Email Address
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Phone Number (MoMo/Airtel)
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{user.phone || 'Not provided'}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Registration Date
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Account & Role */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Account & Role
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      System Role
                    </span>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-brand-700 dark:text-brand-400" />
                      <span className="uppercase">{user.role}</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                      Account Status
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.isActive
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      <span>{user.isActive ? 'Active' : 'Deactivated'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Subscription */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Current Subscription
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Plan:</span>
                      <p className="font-display font-bold text-base text-slate-900 dark:text-white">
                        {user.subscription?.plan
                          ? user.subscription.plan.toUpperCase()
                          : 'None Selected'}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        user.subscription?.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : user.subscription?.status === 'awaiting_verification'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {user.subscription?.status || 'Pending'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Started:</span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {user.subscription?.startedAt
                          ? new Date(user.subscription.startedAt).toLocaleDateString()
                          : '—'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 dark:text-slate-400">Expires:</span>
                      <p className="font-semibold text-slate-700 dark:text-slate-300">
                        {user.subscription?.expiresAt
                          ? new Date(user.subscription.expiresAt).toLocaleDateString()
                          : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                  Payment History ({payments.length})
                </h4>

                {payments.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    No payment transactions recorded for this user.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {payments.map((p) => (
                      <div
                        key={p._id}
                        className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/30 flex items-center justify-between text-xs"
                      >
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {p.amount?.toLocaleString()} {p.currency} ({p.plan?.toUpperCase()})
                          </p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                            {p.paymentMethod?.toUpperCase()} • Phone: {p.paymentPhoneNumber || '—'}
                          </p>
                        </div>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            p.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : p.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

