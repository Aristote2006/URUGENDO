import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Check,
  Copy,
  CheckCheck,
  ArrowRight,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  ChevronLeft,
  Smartphone,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Phone,
} from 'lucide-react';
import { plansConfig, paymentInfo } from '../../config/plans';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/common/SEO';

export default function Payment() {
  const { t, lang } = useLanguage();
  const { user, selectPlan, submitPaymentProof } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isRenewal = location.state?.expired;

  // If customer already has an active subscription and is not renewing, send to dashboard
  useEffect(() => {
    if (user?.subscription?.status === 'active' && !isRenewal) {
      navigate('/dashboard', { replace: true });
    }
  }, [user?.subscription?.status, isRenewal, navigate]);

  // Selected plan state (defaults to user's existing selection or monthly)
  const [selectedPlanId, setSelectedPlanId] = useState(
    user?.subscription?.plan || 'monthly'
  );
  const [step, setStep] = useState(user?.subscription?.plan ? 'instructions' : 'select_plan'); // 'select_plan' | 'instructions'
  const [paymentPhone, setPaymentPhone] = useState(user?.phone || '');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedMtn, setCopiedMtn] = useState(false);
  const [copiedAirtel, setCopiedAirtel] = useState(false);
  const [whatsappClicked, setWhatsappClicked] = useState(false);

  const selectedPlan = plansConfig[selectedPlanId] || plansConfig.monthly;

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
    selectPlan(planId);
    setStep('instructions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'phone') {
      setCopiedNumber(true);
      setTimeout(() => setCopiedNumber(false), 2000);
    } else if (type === 'mtn') {
      setCopiedMtn(true);
      setTimeout(() => setCopiedMtn(false), 2000);
    } else if (type === 'airtel') {
      setCopiedAirtel(true);
      setTimeout(() => setCopiedAirtel(false), 2000);
    }
  };

  // WhatsApp pre-filled message
  const generateWhatsAppUrl = () => {
    const registeredName = user?.name || 'Customer';
    const chosenPlanName = lang === 'rw' ? selectedPlan.nameRw : selectedPlan.name;
    const phoneUsed = paymentPhone || user?.phone || '';

    const message = `Hello Urugendo,

I have made a payment for my Urugendo learning plan.

Registered name: ${registeredName}
Payment phone number: ${phoneUsed}
Selected plan: ${chosenPlanName} (${selectedPlan.price} RWF)

I have attached my payment screenshot.`;

    return `https://wa.me/${paymentInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleConfirmPaymentSubmission = (e) => {
    e.preventDefault();
    submitPaymentProof({
      paymentPhone,
      paymentMethod: 'mtn_momo',
    });
    navigate('/payment/pending');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-ink-50">
      <SEO
        title={lang === 'rw' ? 'Guhitamo Ifatabuguzi n’Ubwishyu' : 'Choose Your Learning Plan & Payment'}
        description="Select your Urugendo learning subscription plan and follow MTN / Airtel Mobile Money payment instructions."
        canonical="/payment"
      />

      <div className="max-w-6xl mx-auto px-5 md:px-8">
        {/* Step Indicator Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          {isRenewal && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-4">
              <AlertCircle className="w-4 h-4" />
              <span>{lang === 'rw' ? 'Ifatabuguzi ryawe ryarangiye. Nyamuneka rivugurure.' : 'Your subscription has expired. Please renew to continue.'}</span>
            </div>
          )}

          {user?.subscription?.status === 'rejected' && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-100 dark:bg-red-950/70 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs font-semibold mb-4 max-w-lg mx-auto text-left">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              <div>
                <p className="font-bold">
                  {lang === 'rw' ? 'Ubwishyu bwa mbere ntiburaboneka' : 'Previous Payment Not Received'}
                </p>
                <p className="font-normal text-[11px] text-red-700 dark:text-red-300">
                  {user?.subscription?.rejectionReason ||
                    (lang === 'rw'
                      ? 'Nyamuneka genzura neza niba amafaranga yagiye maze wohereze amakuru mashya y’ubwishyu.'
                      : 'Please check your transaction to make sure it was successful, then re-submit your payment details below.')}
                </p>
              </div>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800/60 mb-4">
            <Sparkles className="w-4 h-4 text-brand-700 dark:text-brand-300" />
            <span className="text-xs font-semibold tracking-wide uppercase text-brand-700 dark:text-brand-300">
              {step === 'select_plan'
                ? lang === 'rw'
                  ? 'Intambwe ya 1: Hitamo Ifatabuguzi'
                  : 'Step 1: Choose Your Plan'
                : lang === 'rw'
                ? 'Intambwe ya 2: Amabwiriza y’Ubwishyu'
                : 'Step 2: Payment Instructions'}
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tightest mb-4">
            {step === 'select_plan'
              ? lang === 'rw'
                ? 'Hitamo ifatabuguzi ryo kwiga'
                : 'Choose your learning plan'
              : lang === 'rw'
              ? 'Kwishyura ukoresheje Mobile Money'
              : 'Complete your payment'}
          </h1>
          <p className="text-base text-ink-600 dark:text-ink-400">
            {step === 'select_plan'
              ? lang === 'rw'
                ? 'Hitamo igihe wifuza kwiga. Ukwezi 1 niyo mahitamo meza aguha ibintu byose nta mupaka.'
                : 'Select the package that fits your schedule. The 1 Month plan gives you the full experience with highest usage limits.'
              : lang === 'rw'
              ? 'Koresha MTN cyangwa Airtel Money, hanyuma wohereze screenshot kuri WhatsApp yacu kugira ngo konti yawe ifungurwe.'
              : 'Pay via MTN or Airtel Money, then submit your confirmation screenshot to our WhatsApp to activate your account.'}
          </p>
        </div>

        {/* STEP 1: PLAN SELECTION UI */}
        {step === 'select_plan' && (
          <div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-12">
              {Object.values(plansConfig).map((plan) => {
                const isBestValue = plan.popular;
                const isSelected = selectedPlanId === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                      isBestValue
                        ? 'bg-ink-50 dark:bg-ink-900 border-2 border-brand-500 shadow-xl shadow-brand-500/10 -translate-y-1'
                        : 'bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm hover:border-ink-400 dark:hover:border-ink-700'
                    }`}
                  >
                    {/* Best Value Badge */}
                    {isBestValue && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-md">
                        {lang === 'rw' ? plan.badgeRw : plan.badge}
                      </div>
                    )}

                    <div>
                      {/* Plan Header */}
                      <div className="mb-5">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-display font-bold text-2xl tracking-tight">
                            {lang === 'rw' ? plan.nameRw : plan.name}
                          </h3>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-ink-200/70 dark:bg-ink-800 text-ink-700 dark:text-ink-300">
                            {lang === 'rw' ? plan.durationTextRw : plan.durationText}
                          </span>
                        </div>
                        <p className="text-xs text-ink-500 dark:text-ink-400 min-h-[32px]">
                          {lang === 'rw' ? plan.descriptionRw : plan.description}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 pb-6 border-b border-ink-200 dark:border-ink-800 mb-6">
                        <span className="font-grotesk font-bold text-4xl sm:text-5xl tracking-tight">
                          {plan.price.toLocaleString()}
                        </span>
                        <span className="font-bold text-sm text-ink-500 dark:text-ink-400">
                          {plan.currency}
                        </span>
                        <span className="text-xs text-ink-400">
                          / {lang === 'rw' ? plan.durationTextRw : plan.durationText}
                        </span>
                      </div>

                      {/* Usage Limitations Notice */}
                      <div className="mb-6 p-3 rounded-xl bg-ink-100/70 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800 text-xs">
                        <span className="font-semibold block mb-0.5 text-ink-900 dark:text-ink-100">
                          {lang === 'rw' ? 'Imipaka y’iyi gahunda:' : 'Usage Limitation:'}
                        </span>
                        <span className="text-ink-600 dark:text-ink-400">
                          {plan.id === 'daily' &&
                            (lang === 'rw'
                              ? 'Amasomo 3 ntarengwa, ikizamini 1 cy’igerageza.'
                              : 'Limit: 3 lessons & 1 mock exam during the 24 hours.')}
                          {plan.id === 'weekly' &&
                            (lang === 'rw'
                              ? 'Amasomo 12 ntarengwa, ibizamini 5 by’igerageza.'
                              : 'Limit: 12 lessons & 5 mock exams during the 7 days.')}
                          {plan.id === 'monthly' &&
                            (lang === 'rw'
                              ? 'NTA MUPAKA: Amasomo yose n’ibizamini byose birimo.'
                              : 'UNLIMITED: Access all current and future lessons & mock exams.')}
                        </span>
                      </div>

                      {/* What is included */}
                      <div className="space-y-3 mb-8">
                        <span className="text-xs font-semibold tracking-wider uppercase text-ink-400 block">
                          {lang === 'rw' ? 'Ibyo uhawe:' : 'What is included:'}
                        </span>
                        {(lang === 'rw' ? plan.featuresRw : plan.features).map((feat, i) => (
                          <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-700 dark:text-ink-300">
                            <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Select Plan Button */}
                    <button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                        isBestValue
                          ? 'btn-primary'
                          : 'bg-ink-200 dark:bg-ink-800 text-ink-900 dark:text-ink-50 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600'
                      }`}
                    >
                      <span>{lang === 'rw' ? `Hitamo ${plan.nameRw}` : `Select ${plan.name}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-6 rounded-2xl bg-ink-100/50 dark:bg-ink-900/40 border border-ink-200 dark:border-ink-800 max-w-2xl mx-auto text-center text-xs text-ink-500 dark:text-ink-400">
              <p>
                {lang === 'rw'
                  ? 'Ukeneye ubufasha bwo guhitamo? Twandikire kuri WhatsApp yacu: '
                  : 'Need help picking the right plan? Contact our team on WhatsApp: '}
                <strong className="text-ink-900 dark:text-ink-100 font-mono">{paymentInfo.phone}</strong>
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT INSTRUCTIONS & SUBMISSION UI */}
        {step === 'instructions' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Top selected plan summary strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-ink-100 dark:bg-ink-900 border border-ink-200 dark:border-ink-800">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setStep('select_plan')}
                  className="p-2 rounded-lg btn-ghost border border-ink-200 dark:border-ink-800 text-ink-600 hover:text-ink-950"
                  title="Change Plan"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="text-xs text-ink-500 uppercase tracking-wider font-semibold">
                    {lang === 'rw' ? 'Ifatabuguzi wahisemo' : 'Selected Plan'}
                  </div>
                  <div className="font-display font-bold text-xl">
                    {lang === 'rw' ? selectedPlan.nameRw : selectedPlan.name} ·{' '}
                    <span className="text-brand-600 dark:text-brand-400">
                      {selectedPlan.price.toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('select_plan')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                {lang === 'rw' ? 'Hindura gahunda' : 'Change Plan'}
              </button>
            </div>

            {/* CRITICAL PAYMENT NOTICE (MUST NOT MISS) */}
            <div className="p-6 md:p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-200 dark:bg-amber-900/60 flex items-center justify-center flex-shrink-0 text-amber-800 dark:text-amber-300">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg md:text-xl text-amber-900 dark:text-amber-100 mb-2">
                    {lang === 'rw' ? 'Amabwiriza y’Ingenzi cyane y’Ubwishyu' : 'Critical Payment Notice'}
                  </h3>
                  <div className="space-y-2 text-sm text-amber-950 dark:text-amber-200 leading-relaxed">
                    <p>
                      {lang === 'rw' ? (
                        <>
                          Umaze kohereza amafaranga, <strong>fata screenshot y’ubutumwa bw’ubwishyu</strong> hanyuma
                          uyohereze kuri WhatsApp yacu kuri <strong>{paymentInfo.formattedPhone}</strong>.
                        </>
                      ) : (
                        <>
                          After making your payment, <strong>send a screenshot of your payment confirmation</strong> to our
                          WhatsApp number <strong>{paymentInfo.formattedPhone}</strong>.
                        </>
                      )}
                    </p>
                    <p>
                      {lang === 'rw' ? (
                        <>
                          Ugomba no gushyiraho <strong>amazina wiyandikishijeho</strong> (
                          <em>{user?.name}</em>) na <strong>nimero ya telefone wakoresheje wishyura</strong> kugira ngo bihuzwe na konti yawe.
                        </>
                      ) : (
                        <>
                          You must also include your <strong>registered name</strong> (
                          <em>{user?.name}</em>) and the <strong>phone number used to make payment</strong> so the payment can be matched with your account.
                        </>
                      )}
                    </p>
                    <p className="font-medium pt-1 text-amber-900 dark:text-amber-100">
                      {lang === 'rw'
                        ? 'Konti yawe izafungurwa neza amaze kwemezwa n’ubuyobozi. Icyo gihe uzabona amasomo n’ibizamini byose bya gahunda yawe.'
                        : 'Your account will be activated after your payment has been verified. Once activated, you will be able to access the course and learning features included in your plan.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Money Payment Codes (MTN & Airtel) */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* MTN Mobile Money */}
              <div className="p-6 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-400 text-ink-950 font-bold flex items-center justify-center text-xs">
                        MTN
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-base">MTN Mobile Money</h4>
                        <span className="text-xs text-ink-500">Dial USSD Code</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-ink-600 dark:text-ink-400 mb-4">
                    Dial this code directly on your phone and follow prompt to send{' '}
                    <strong>{selectedPlan.price.toLocaleString()} RWF</strong>:
                  </p>

                  <div className="p-3.5 rounded-xl bg-ink-100 dark:bg-ink-900 font-mono font-bold text-base sm:text-lg text-ink-900 dark:text-ink-50 flex items-center justify-between gap-2 mb-4 border border-ink-200 dark:border-ink-800">
                    <span>{paymentInfo.mtnUssd}</span>
                    <button
                      onClick={() => copyToClipboard(paymentInfo.mtnUssd, 'mtn')}
                      className="text-xs font-sans px-2.5 py-1 rounded bg-ink-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:text-brand-600 flex items-center gap-1"
                    >
                      {copiedMtn ? <CheckCheck className="w-3.5 h-3.5 text-brand-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedMtn ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between text-xs">
                  <span className="text-ink-500">Receiver Name:</span>
                  <span className="font-semibold text-ink-900 dark:text-ink-100">{paymentInfo.name}</span>
                </div>
              </div>

              {/* Airtel Money */}
              <div className="p-6 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                        Airtel
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-base">Airtel Money</h4>
                        <span className="text-xs text-ink-500">Dial USSD Code</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-ink-600 dark:text-ink-400 mb-4">
                    Dial this code directly on your phone and follow prompt to send{' '}
                    <strong>{selectedPlan.price.toLocaleString()} RWF</strong>:
                  </p>

                  <div className="p-3.5 rounded-xl bg-ink-100 dark:bg-ink-900 font-mono font-bold text-base sm:text-lg text-ink-900 dark:text-ink-50 flex items-center justify-between gap-2 mb-4 border border-ink-200 dark:border-ink-800">
                    <span>{paymentInfo.airtelUssd}</span>
                    <button
                      onClick={() => copyToClipboard(paymentInfo.airtelUssd, 'airtel')}
                      className="text-xs font-sans px-2.5 py-1 rounded bg-ink-200 dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:text-brand-600 flex items-center gap-1"
                    >
                      {copiedAirtel ? <CheckCheck className="w-3.5 h-3.5 text-brand-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAirtel ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-ink-200/60 dark:border-ink-800/60 flex items-center justify-between text-xs">
                  <span className="text-ink-500">Receiver Name:</span>
                  <span className="font-semibold text-ink-900 dark:text-ink-100">{paymentInfo.name}</span>
                </div>
              </div>
            </div>

            {/* Quick Number Copy Bar */}
            <div className="p-5 rounded-2xl bg-ink-100 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <div>
                  <span className="text-xs text-ink-500 block">Official Urugendo Payment Number:</span>
                  <span className="font-mono font-bold text-lg text-ink-900 dark:text-ink-50">
                    {paymentInfo.formattedPhone}
                  </span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(paymentInfo.phone, 'phone')}
                className="px-4 py-2.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-300 dark:border-ink-700 text-xs font-semibold hover:border-brand-500 inline-flex items-center gap-1.5 transition-colors"
              >
                {copiedNumber ? <CheckCheck className="w-4 h-4 text-brand-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedNumber ? 'Number Copied!' : 'Copy Phone Number'}</span>
              </button>
            </div>

            {/* Step-by-Step Payment Walkthrough (Steps 1 to 8) */}
            <div className="p-7 md:p-8 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800">
              <h3 className="font-display font-bold text-xl mb-6">
                {lang === 'rw' ? 'Intambwe 8 zo kwishyura:' : '8-Step Payment Process:'}
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    num: '1',
                    title: 'Choose Plan',
                    desc: `${selectedPlan.name} (${selectedPlan.price} RWF) selected.`,
                  },
                  {
                    num: '2',
                    title: 'Send Amount',
                    desc: `Pay ${selectedPlan.price} RWF via MTN or Airtel Money to ${paymentInfo.formattedPhone}.`,
                  },
                  {
                    num: '3',
                    title: 'Keep SMS Confirmation',
                    desc: 'Wait for the telecom SMS confirming money sent.',
                  },
                  {
                    num: '4',
                    title: 'Take Screenshot',
                    desc: 'Capture a clear screenshot of the confirmation SMS.',
                  },
                  {
                    num: '5',
                    title: 'Send to WhatsApp',
                    desc: `Send the screenshot to WhatsApp ${paymentInfo.formattedPhone}.`,
                  },
                  {
                    num: '6',
                    title: 'Include Details',
                    desc: `Include registered name (${user?.name}) and payment phone.`,
                  },
                  {
                    num: '7',
                    title: 'Wait Verification',
                    desc: 'Our team verifies payment details promptly.',
                  },
                  {
                    num: '8',
                    title: 'Account Activated',
                    desc: 'Your account is unlocked for full course access.',
                  },
                ].map((s) => (
                  <div key={s.num} className="p-4 rounded-xl bg-ink-100/60 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800">
                    <span className="font-grotesk font-bold text-brand-600 dark:text-brand-400 text-sm block mb-1">
                      STEP {s.num}
                    </span>
                    <h5 className="font-semibold text-sm mb-1">{s.title}</h5>
                    <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Area: Step 1 & Step 2 */}
            {/* Action Area: Step 1 & Step 2 (Directly below MTN / Airtel codes) */}
            <div className="space-y-6">
              {/* Step 1 Card: WhatsApp Action */}
              <div className="p-7 md:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                      <span>{lang === 'rw' ? 'Intambwe ya 1' : 'Step 1 of 2'}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-white">
                      {lang === 'rw' ? 'Ohereza Screenshot kuri WhatsApp' : 'Send Payment Screenshot on WhatsApp'}
                    </h3>
                    <p className="text-slate-300 text-sm max-w-xl leading-relaxed mt-1">
                      {lang === 'rw'
                        ? 'Kanda buto iri munsi kugira ngo ufungure WhatsApp yacu ifite amakuru yawe yuzuye, hanyuma wohereze screenshot y’ubwishyu.'
                        : 'Click the button below to open WhatsApp with your pre-filled payment details. Attach your screenshot in the chat to provide proof of payment.'}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <a
                      href={generateWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setWhatsappClicked(true)}
                      className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-5 h-5 fill-current flex-shrink-0" />
                      <span>{lang === 'rw' ? 'Fungura WhatsApp & Ohereza' : 'Open WhatsApp & Send Screenshot'}</span>
                    </a>
                  </div>
                </div>

                {whatsappClicked && (
                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-emerald-400 animate-in fade-in duration-300">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {lang === 'rw'
                        ? 'WhatsApp yafunguwe! Nyamuneka uzamure amaso hasi wuzuze Intambwe ya 2 y’ingenzi yo kwemeza ubwishyu.'
                        : 'WhatsApp opened! Now complete Step 2 below by confirming your phone number to submit.'}
                    </span>
                  </div>
                )}
              </div>

              {/* Step 2 Card: CRITICAL MANDATORY CONFIRMATION */}
              <div
                className={`p-7 md:p-9 rounded-3xl transition-all duration-300 shadow-2xl border-2 ${
                  whatsappClicked
                    ? 'bg-amber-950/20 dark:bg-amber-950/30 border-amber-500 shadow-amber-500/10 ring-4 ring-amber-500/20'
                    : 'bg-white dark:bg-ink-900 border-amber-500/80 dark:border-amber-500/60'
                }`}
              >
                {/* Critical Alert Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md">
                    <AlertTriangle className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider mb-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                      <span>
                        {lang === 'rw' ? 'INTAMBWE YA 2 Y’INGENZI CYANEE (MANDATORY)' : 'CRITICAL STEP 2: REQUIRED ACTION'}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-2xl text-ink-900 dark:text-white tracking-tight">
                      {lang === 'rw'
                        ? 'Emeza ko wohereje ubwishyu kuri WhatsApp'
                        : 'Confirm That You Sent Payment Proof on WhatsApp'}
                    </h3>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-300/90 leading-relaxed mt-1">
                      {lang === 'rw'
                        ? 'ICYITONDERWA: Kohereza screenshot kuri WhatsApp gusa ntibihagije! UGOMBA kwinjiza nimero ya telefone wishyuyeho maze ukande buto yo kwemeza iri munsi. Ibi nibyo bituma ubuyobozi bubona ubwishyu bwawe ako kanya bugahita bugufungurira konti.'
                        : 'CRITICAL NOTICE: Sending on WhatsApp is NOT enough by itself! You MUST enter the phone number used to make payment below and click confirm. This registers your payment in our system so the administrator can immediately verify and activate your account.'}
                    </p>
                  </div>
                </div>

                {/* Confirmation Form */}
                <form onSubmit={handleConfirmPaymentSubmission} className="space-y-5 max-w-xl">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-ink-900 dark:text-ink-100 mb-2">
                      {lang === 'rw'
                        ? '1. Nimero ya telefone wakoresheje wishyura (MTN MoMo cyangwa Airtel Money):'
                        : '1. Phone number you used to send payment (MTN MoMo or Airtel Money):'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-emerald-600 dark:text-emerald-400">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={paymentPhone}
                        onChange={(e) => setPaymentPhone(e.target.value)}
                        placeholder="urugero: 0788123456 cyangwa 0731234567"
                        className="w-full pl-12 pr-4 py-4 text-base font-semibold rounded-2xl bg-ink-50 dark:bg-ink-950 text-ink-900 dark:text-white border-2 border-emerald-500 dark:border-emerald-500/80 focus:outline-none focus:ring-4 focus:ring-emerald-500/25 focus:border-emerald-600 transition-all placeholder:text-ink-400 dark:placeholder:text-ink-600 shadow-inner"
                      />
                    </div>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-1.5 pl-1">
                      {lang === 'rw'
                        ? 'Ubuyobozi buzareba iyi nimero mu butumwa bwa MoMo kugira ngo bwemeze ubwishyu bwawe.'
                        : 'Our administration will verify this phone number in the mobile money statement to approve your account.'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-base bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white transition-all shadow-xl shadow-emerald-600/30 inline-flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>
                        {lang === 'rw'
                          ? 'Narangije Kwishyura · Emeza & Saba Gufungurirwa Konti'
                          : 'I Have Sent Proof · Submit for Immediate Verification'}
                      </span>
                      <ArrowRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Step-by-Step Payment Walkthrough (Steps 1 to 8) */}
            <div className="p-7 md:p-8 rounded-3xl bg-ink-50 dark:bg-ink-950 border border-ink-200 dark:border-ink-800">
              <h3 className="font-display font-bold text-xl mb-6">
                {lang === 'rw' ? 'Intambwe 8 zo kwishyura:' : '8-Step Payment Process:'}
              </h3>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    num: '1',
                    title: 'Choose Plan',
                    desc: `${selectedPlan.name} (${selectedPlan.price} RWF) selected.`,
                  },
                  {
                    num: '2',
                    title: 'Send Amount',
                    desc: `Pay ${selectedPlan.price} RWF via MTN or Airtel Money to ${paymentInfo.formattedPhone}.`,
                  },
                  {
                    num: '3',
                    title: 'Keep SMS Confirmation',
                    desc: 'Wait for the telecom SMS confirming money sent.',
                  },
                  {
                    num: '4',
                    title: 'Take Screenshot',
                    desc: 'Capture a clear screenshot of the confirmation SMS.',
                  },
                  {
                    num: '5',
                    title: 'Send to WhatsApp',
                    desc: `Send the screenshot to WhatsApp ${paymentInfo.formattedPhone}.`,
                  },
                  {
                    num: '6',
                    title: 'Include Details',
                    desc: `Include registered name (${user?.name}) and payment phone.`,
                  },
                  {
                    num: '7',
                    title: 'Wait Verification',
                    desc: 'Our team verifies payment details promptly.',
                  },
                  {
                    num: '8',
                    title: 'Account Activated',
                    desc: 'Your account is unlocked for full course access.',
                  },
                ].map((s) => (
                  <div key={s.num} className="p-4 rounded-xl bg-ink-100/60 dark:bg-ink-900/60 border border-ink-200 dark:border-ink-800">
                    <span className="font-grotesk font-bold text-brand-600 dark:text-brand-400 text-sm block mb-1">
                      STEP {s.num}
                    </span>
                    <h5 className="font-semibold text-sm mb-1">{s.title}</h5>
                    <p className="text-xs text-ink-500 dark:text-ink-400 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

