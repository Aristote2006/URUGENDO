import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { paymentInfo, plansConfig } from '../../config/plans';
import SEO from '../../components/common/SEO';

export default function PaymentPending() {
  const { user, checkPaymentStatus, refreshUser } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [status, setStatus] = useState(user?.subscription?.status || 'awaiting_verification');
  const [rejectionReason, setRejectionReason] = useState(user?.subscription?.rejectionReason || '');
  const [isVerifyingNow, setIsVerifyingNow] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [manualCheckNotice, setManualCheckNotice] = useState(null);
  const pollCountRef = useRef(0);

  const planId = user?.subscription?.plan || 'monthly';
  const planDetails = plansConfig[planId] || plansConfig.monthly;

  // Real-time verification polling
  useEffect(() => {
    // If already active on mount, direct straight to dashboard
    if (user?.subscription?.status === 'active') {
      navigate('/dashboard', { replace: true });
      return;
    }

    let isMounted = true;
    let pollInterval = null;

    const performStatusCheck = async () => {
      try {
        pollCountRef.current += 1;
        const result = await checkPaymentStatus();

        if (!isMounted || !result) return;

        // Condition 1: Payment verified by administrator
        if (result.isVerified || result.status === 'active') {
          setIsVerifyingNow(true);
          if (pollInterval) clearInterval(pollInterval);

          // Give user a celebratory visual cue then redirect to dashboard
          setTimeout(() => {
            if (isMounted) {
              navigate('/dashboard', { replace: true });
            }
          }, 1400);
          return;
        }

        // Condition 2: Payment rejected / not received
        if (result.isRejected || result.status === 'rejected') {
          setStatus('rejected');
          setRejectionReason(
            result.rejectionReason ||
              (lang === 'rw'
                ? 'Ubwishyu ntiburaboneka. Nyamuneka genzura neza niba amafaranga yagiye neza.'
                : 'Payment has not been received yet. Please check your transaction to confirm if it was successful.')
          );
          if (pollInterval) clearInterval(pollInterval);
        }
      } catch (err) {
        console.warn('[PaymentPending] Polling error:', err);
      }
    };

    // Immediate check on mount
    performStatusCheck();

    // Poll every 3.5 seconds
    pollInterval = setInterval(performStatusCheck, 3500);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [user?.subscription?.status, navigate, checkPaymentStatus, lang]);

  // Manual Check Button Handler
  const handleManualCheck = async () => {
    setIsChecking(true);
    setManualCheckNotice(null);

    try {
      const result = await checkPaymentStatus();

      if (result?.isVerified || result?.status === 'active') {
        setIsVerifyingNow(true);
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1200);
        return;
      }

      if (result?.isRejected || result?.status === 'rejected') {
        setStatus('rejected');
        setRejectionReason(
          result.rejectionReason ||
            (lang === 'rw'
              ? 'Ubwishyu ntiburaboneka. Nyamuneka genzura neza niba amafaranga yagiye neza.'
              : 'Payment has not been received yet. Please check your transaction to confirm if it was successful.')
        );
        return;
      }

      // If still awaiting
      setManualCheckNotice({
        type: 'warning',
        text:
          lang === 'rw'
            ? 'Ubwishyu ntiburaboneka cyangwa buracyasuzumwa. Nyamuneka genzura kuri telefone yawe ko amafaranga yagiye neza cyangwa utegereze gato.'
            : 'The payment has not been received yet. Please check your payment if it was successful, or wait a moment while our team verifies it.',
      });
    } catch (err) {
      setManualCheckNotice({
        type: 'warning',
        text:
          lang === 'rw'
            ? 'Ntibyashobotse kugenzura. Nyamuneka ongera ugerageze.'
            : 'Unable to check status right now. Please try again.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const isRejectedState = status === 'rejected';

  return (
    <div className="min-h-screen pt-28 pb-20 px-5 flex items-center justify-center bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-50 transition-colors">
      <SEO
        title={
          isVerifyingNow
            ? 'Payment Verified! · Urugendo'
            : isRejectedState
            ? 'Payment Not Received · Urugendo'
            : 'Awaiting Payment Verification · Urugendo'
        }
        description="Check your Urugendo subscription payment verification status in real time."
        canonical="/payment/pending"
      />

      <div className="max-w-xl w-full bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-3xl shadow-xl p-7 md:p-10 text-center relative overflow-hidden">
        {/* Verification Success Overlay Animation */}
        {isVerifyingNow ? (
          <div className="py-6 space-y-5 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>{lang === 'rw' ? 'Bwemejwe!' : 'Payment Verified!'}</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink-900 dark:text-white tracking-tight">
              {lang === 'rw' ? 'Konti yawe ifunguwe neza!' : 'Payment Verified Successfully!'}
            </h1>

            <p className="text-sm text-ink-600 dark:text-ink-400 max-w-md mx-auto leading-relaxed">
              {lang === 'rw'
                ? 'Ubwishyu bwemejwe neza n’ubuyobozi. Turakwerekeza kuri Dashboard yawe ubu...'
                : 'Your payment was successfully approved by administration. Redirecting you to your dashboard now...'}
            </p>

            <div className="pt-3 flex justify-center items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>{lang === 'rw' ? 'Kwerekeza kuri Dashboard...' : 'Opening Dashboard...'}</span>
            </div>
          </div>
        ) : isRejectedState ? (
          /* Payment Rejected / Not Received State */
          <div className="space-y-6">
            <div className="w-18 h-18 rounded-full bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-2">
              <XCircle className="w-9 h-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lang === 'rw' ? 'Ubwishyu Ntiburaboneka' : 'Payment Not Received'}</span>
            </div>

            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-red-600 dark:text-red-400 mb-2">
                {lang === 'rw' ? 'Ubwishyu ntiburaboneka' : 'Payment Has Not Been Received Yet'}
              </h1>
              <p className="text-sm text-ink-600 dark:text-ink-300 leading-relaxed max-w-md mx-auto">
                {lang === 'rw'
                  ? 'Ubwishyu bwawe ntiburaboneka mu bwirinzi bwacu. Nyamuneka genzura niba amafaranga yagiye neza kuri telefone yawe, cyangwa wohereze indi screenshot nshya.'
                  : 'The payment has not been received yet. Please check your mobile money transaction to confirm if it was successful.'}
              </p>
            </div>

            {/* Rejection Note from Admin if provided */}
            {rejectionReason && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-left text-xs text-red-800 dark:text-red-200 space-y-1">
                <span className="font-bold block text-[11px] uppercase tracking-wider text-red-700 dark:text-red-300">
                  {lang === 'rw' ? 'Icyitonderwa cy’ubuyobozi:' : 'Note from Administration:'}
                </span>
                <p className="leading-relaxed">{rejectionReason}</p>
              </div>
            )}

            {/* Order Details Reference */}
            <div className="p-4 rounded-2xl bg-ink-100/70 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-ink-500">Plan:</span>
                <span className="font-semibold text-ink-900 dark:text-ink-100">
                  {planDetails.name} ({planDetails.price.toLocaleString()} RWF)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Phone Submitted:</span>
                <span className="font-mono font-semibold text-ink-900 dark:text-ink-100">
                  {user?.subscription?.paymentDetails?.phone || user?.phone}
                </span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-ink-200/60 dark:border-ink-800/60">
                <span className="text-ink-500">Status:</span>
                <span className="font-bold text-red-600 dark:text-red-400 uppercase">
                  {lang === 'rw' ? 'NTIBURABONEKA' : 'NOT RECEIVED / REJECTED'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/payment')}
                className="w-full py-3.5 px-5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{lang === 'rw' ? 'Ongera Wishyure cyangwa Usubiremo' : 'Check Payment & Submit New Proof'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleManualCheck}
                disabled={isChecking}
                className="w-full py-3 px-5 rounded-2xl border border-ink-300 dark:border-ink-700 hover:bg-ink-100 dark:hover:bg-ink-800 text-ink-800 dark:text-ink-200 font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Checking status...' : 'Check Status Again'}</span>
              </button>

              <a
                href={`https://wa.me/${paymentInfo.whatsappNumber}?text=${encodeURIComponent(
                  `Hello Urugendo, my payment verification was not confirmed. My registered email is: ${user?.email}, Phone: ${user?.phone}. Please assist me.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact WhatsApp Support ({paymentInfo.formattedPhone})</span>
              </a>
            </div>
          </div>
        ) : (
          /* Normal Awaiting Verification State with Real-Time Polling */
          <div>
            {/* Animated Pending Icon */}
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
            </div>

            {/* Status Pill with pulse indicator */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span>{lang === 'rw' ? 'Biri Gusuzumwa' : 'Awaiting Verification'}</span>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight mb-3">
              {lang === 'rw' ? 'Ubwishyu bwawe buri gusuzumwa' : 'Payment Proof Under Review'}
            </h1>

            <p className="text-sm text-ink-600 dark:text-ink-400 leading-relaxed max-w-md mx-auto mb-6">
              {lang === 'rw'
                ? 'Ubutumwa bwawe bwakiriwe neza. Itsinda ryacu riragenzura screenshot wohereje kuri WhatsApp. Iyi paji irikwisubiramo mu buryo bwikora (auto-refresh) iyo bwemejwe.'
                : 'Your payment proof has been received. Our team is verifying your payment against your mobile money transaction. This page checks continuously and will direct you to your dashboard automatically.'}
            </p>

            {/* Live Auto-Refresh Indicator Bar */}
            <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-ink-100/60 dark:bg-ink-800/60 text-ink-600 dark:text-ink-400 text-xs mb-6 max-w-md mx-auto">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600 dark:text-brand-400" />
              <span>Real-time sync active · Auto-refreshes when verified</span>
            </div>

            {/* Manual Check Notice Banner if triggered */}
            {manualCheckNotice && (
              <div className="p-4 mb-6 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800/80 text-left text-xs text-amber-800 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <p className="leading-relaxed">{manualCheckNotice.text}</p>
              </div>
            )}

            {/* Order Details Summary Box */}
            <div className="p-5 rounded-2xl bg-ink-100/70 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 text-left text-xs space-y-2.5 mb-6">
              <div className="flex justify-between">
                <span className="text-ink-500">Registered Name:</span>
                <span className="font-semibold text-ink-900 dark:text-ink-100">{user?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Selected Plan:</span>
                <span className="font-semibold text-ink-900 dark:text-ink-100">
                  {planDetails.name} ({planDetails.price.toLocaleString()} RWF)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-500">Payment Phone:</span>
                <span className="font-mono font-semibold text-ink-900 dark:text-ink-100">
                  {user?.subscription?.paymentDetails?.phone || user?.phone}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-ink-200/60 dark:border-ink-800/60">
                <span className="text-ink-500">Current Status:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">
                  {lang === 'rw' ? 'BIRI GUSUZUMWA' : 'AWAITING VERIFICATION'}
                </span>
              </div>
            </div>

            {/* Manual Check Button & WhatsApp Support Link */}
            <div className="space-y-4 mb-6">
              <button
                onClick={handleManualCheck}
                disabled={isChecking}
                className="w-full py-3 px-4 rounded-xl bg-ink-900 hover:bg-ink-800 dark:bg-ink-100 dark:hover:bg-white text-white dark:text-ink-900 font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Checking with server...' : 'Check Status Now'}</span>
              </button>

              <div>
                <a
                  href={`https://wa.me/${paymentInfo.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Urugendo, I submitted payment proof for ${user?.email}. Please verify my account.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Need immediate help? WhatsApp {paymentInfo.formattedPhone}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
