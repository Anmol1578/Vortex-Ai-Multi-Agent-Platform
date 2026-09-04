import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserdata } from "../redux/userSlice.js";
import { AnimatePresence, motion } from "motion/react";
import {
  X,
  Check,
  Zap,
  CreditCard,
  Sparkles,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { createOrder } from "../features/createOrder.js";
import { verifyPayment } from "../features/verifyPayment.js";
import { loadRazorpay } from "../features/loadRazorpay.js"; 


const PLANS = {
  free: {
    id: "free",
    name: "Free Plan",
    price: 0,
    credits: 100,
    description: "Good for getting started",
  },
  starter: {
    id: "starter",
    name: "Starter Plan",
    price: 399,
    credits: 500,
    description: "For regular AI workflows",
  },
  pro: {
    id: "pro",
    name: "Pro Plan",
    price: 999,
    credits: 1200,
    description: "For serious AI workflows",
  },
};

const PLAN_LIST = [
  {
    ...PLANS.starter,
    icon: Zap,
    popular: false,
    features: [
      "500 AI credits",
      "Higher model limits",
      "Priority processing",
      "File generation",
      "Image generation",
    ],
  },
  {
    ...PLANS.pro,
    icon: Sparkles,
    popular: true,
    features: [
      "1200 AI credits",
      "Higher model limits",
      "Priority processing",
      "Advanced agent workflows",
      "More file & image generation",
    ],
  },
];

const EASE = [0.16, 1, 0.3, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const rise = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

function UsageMeter({ used, total, remaining }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  return (
    <motion.div variants={rise} className="mt-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-black/65">
          Monthly credits
        </span>
        <span className="text-[11px] font-[IBM_Plex_Mono,monospace] text-black/35">
          {used} / {total}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-black/[0.06] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.25 }}
          className="h-full rounded-full bg-gradient-to-r from-[#1E7A56] to-[#5EEAD4]"
        />
      </div>
      <p className="text-[11px] text-black/35 mt-2">
        {remaining} credits remaining this month
      </p>
    </motion.div>
  );
}

function PlanCard({
  plan,
  isCurrent,
  isSelected,
  isLoading,
  onSelect,
  onUpgrade,
}) {
  const Icon = plan.icon;
  return (
    <motion.div
      variants={rise}
      onClick={onSelect}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={`relative rounded-xl border bg-white overflow-hidden cursor-pointer transition-colors duration-200 ${
        isSelected
          ? "border-[#1E7A56]/40 shadow-md"
          : "border-black/[0.08] shadow-sm hover:border-black/[0.15]"
      }`}
    >
      {plan.popular && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 400,
            damping: 15,
          }}
          className="absolute top-3 right-3 px-2 py-1 rounded-md bg-[#1E7A56]/10 text-[#1E7A56] text-[9px] font-semibold tracking-wide"
        >
          MOST POPULAR
        </motion.div>
      )}

      <div className="p-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#14151A] flex items-center justify-center">
            <Icon size={16} className="text-[#5EEAD4]" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-black/85">
              {plan.name}
            </h3>
            <p className="text-[11px] text-black/40">{plan.description}</p>
          </div>
        </div>

        <div className="mt-5 flex items-end gap-1">
          <span className="text-2xl font-semibold text-black/85">
            ₹{plan.price}
          </span>
          <span className="text-[11px] text-black/35 mb-1">/ 30 days</span>
        </div>

        <div className="mt-4 rounded-lg bg-[#1E7A56]/[0.045] border border-[#1E7A56]/10 px-3 py-2.5 flex items-center justify-between">
          <span className="text-xs text-black/50">Monthly credits</span>
          <span className="text-xs font-semibold text-[#1E7A56]">
            {plan.credits.toLocaleString()}
          </span>
        </div>

        <div className="mt-5 space-y-2.5">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#1E7A56]/10 flex items-center justify-center shrink-0">
                <Check size={10} strokeWidth={2.5} className="text-[#1E7A56]" />
              </div>
              <span className="text-xs text-black/60">{feature}</span>
            </div>
          ))}
        </div>

        <motion.button
          disabled={isCurrent || isLoading}
          whileHover={!isCurrent ? { scale: 1.015 } : {}}
          whileTap={!isCurrent ? { scale: 0.98 } : {}}
          onClick={(e) => {
            e.stopPropagation();
            onUpgrade(plan.id);
          }}
          className={`mt-5 w-full flex items-center justify-center gap-2 rounded-lg text-sm font-medium py-2.5 transition-colors duration-300 ${
            isCurrent
              ? "bg-black/[0.05] text-black/35 cursor-not-allowed"
              : "bg-[#14151A] text-white hover:bg-[#1E7A56]"
          }`}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLoading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Loader2 size={15} className="animate-spin" /> Processing...
              </motion.span>
            ) : isCurrent ? (
              <motion.span
                key="current"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Current Plan
              </motion.span>
            ) : (
              <motion.span
                key="upgrade"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                Upgrade to {plan.name.replace(" Plan", "")}{" "}
                <ArrowRight size={15} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}

function StatusBanner({ status }) {
  if (!status) return null;
  const styles = {
    success: "bg-[#1E7A56]/[0.06] border-[#1E7A56]/20 text-[#1E7A56]",
    processing: "bg-black/[0.03] border-black/[0.08] text-black/55",
    error: "bg-red-50 border-red-200 text-red-600",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 5, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -5, height: 0 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={`mt-5 rounded-lg border px-4 py-3 text-xs overflow-hidden ${styles[status.type]}`}
    >
      <div className="flex items-center gap-2">
        {status.type === "success" && <ShieldCheck size={15} />}
        {status.type === "processing" && (
          <Loader2 size={15} className="animate-spin" />
        )}
        <span>{status.message}</span>
      </div>
    </motion.div>
  );
}

function BillingDrawer({ open, onClose, userData }) {
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const dispatch = useDispatch();

  const currentPlanId = userData?.plan || "free";
  const currentPlan = useMemo(
    () => PLANS[currentPlanId] || PLANS.free,
    [currentPlanId],
  );

  const usedCredits = Math.max(
    (userData?.totalCredits ?? 0) - (userData?.credits ?? 0),
    0,
  );
  const totalCredits = userData?.totalCredits ?? currentPlan.credits;
  const remainingCredits = userData?.credits ?? totalCredits;

  const handleUpgrade = async (planId) => {
    const plan = PLANS[planId];
    if (!plan || plan.price === 0) return;

    if (!userData?.userId) {
      setPaymentStatus({
        type: "error",
        message: "User information is missing.",
      });
      return;
    }

    setLoadingPlan(planId);
    setPaymentStatus(null);

    try {
      // createOrder returns null on any failed request (invalid plan, server error, etc).
       await loadRazorpay();
      const orderData = await createOrder({
        plan: planId,
        userId: userData.userId,
      });
      if (!orderData?.order) throw new Error("Failed to create payment order");

      const { order, plan: serverPlan } = orderData;

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Vortex AI",
        description: `${serverPlan.name} - ${serverPlan.credits} credits`,
        order_id: order.id,
        prefill: {
          name: userData?.name || userData?.displayName || "",
          email: userData?.email || "",
        },
        theme: { color: "#1E7A56" },
        modal: { ondismiss: () => setLoadingPlan(null) },
        handler: async (response) => {
          setPaymentStatus({
            type: "processing",
            message: "Verifying payment...",
          });

          console.log("Payment response:", response);

          const verifyData = await verifyPayment(
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            userData.userId,
          );

          if (!verifyData) {
            setPaymentStatus({
              type: "error",
              message: "Payment verification failed.",
            });
            setLoadingPlan(null);
            return;
          }

          if (verifyData.user) {
            dispatch(setUserdata(verifyData.user));
          }

          setPaymentStatus({ type: "success", message: verifyData.message });
          setLoadingPlan(null);
          setTimeout(onClose, 1800);
        },
      });

      razorpay.on("payment.failed", (response) => {
        setPaymentStatus({
          type: "error",
          message:
            response?.error?.description || "Payment failed. Please try again.",
        });
        setLoadingPlan(null);
      });

      razorpay.open();
    } catch (error) {
      console.error("Upgrade error:", error);
      setPaymentStatus({
        type: "error",
        message: error.message || "Something went wrong. Please try again.",
      });
      setLoadingPlan(null);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[9998] bg-black/25 backdrop-blur-[3px] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-2xl bg-white/95 backdrop-blur-2xl border border-black/[0.08] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-black/[0.07] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1E7A56]/10 flex items-center justify-center">
                  <CreditCard size={17} className="text-[#1E7A56]" />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold text-black/85">
                    Billing & Plans
                  </h2>
                  <p className="text-[10px] text-black/40 font-[IBM_Plex_Mono,monospace] tracking-wide">
                    ACCOUNT / BILLING
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                title="Close billing"
                className="w-8 h-8 rounded-md flex items-center justify-center text-black/40 hover:text-black hover:bg-black/[0.05] transition-colors"
              >
                <X size={17} />
              </button>
            </div>

            {/* Scrollable content — one stagger container drives everything below */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="flex-1 overflow-y-auto p-5"
            >
              {/* Current plan */}
              <motion.div
                variants={rise}
                className="relative overflow-hidden rounded-xl border border-[#1E7A56]/20 bg-[#1E7A56]/[0.055] p-4"
              >
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#1E7A56]/10 blur-3xl" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-[IBM_Plex_Mono,monospace] uppercase tracking-[0.16em] text-[#1E7A56]/70">
                      Current plan
                    </span>
                    <span className="px-2 py-1 rounded-md bg-[#1E7A56]/10 text-[#1E7A56] text-[10px] font-medium">
                      ACTIVE
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-black/85">
                        {currentPlan.name}
                      </h3>
                      <p className="text-xs text-black/40 mt-1">
                        {currentPlan.description ||
                          "Your current Vortex AI plan"}
                      </p>
                    </div>
                    <Sparkles size={21} className="text-[#1E7A56]" />
                  </div>
                </div>
              </motion.div>

              <UsageMeter
                used={usedCredits}
                total={totalCredits}
                remaining={remainingCredits}
              />

              {/* Plans */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLAN_LIST.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrent={currentPlanId === plan.id}
                    isSelected={selectedPlan === plan.id}
                    isLoading={loadingPlan === plan.id}
                    onSelect={() => setSelectedPlan(plan.id)}
                    onUpgrade={handleUpgrade}
                  />
                ))}
              </div>

              <AnimatePresence>
                <StatusBanner status={paymentStatus} />
              </AnimatePresence>

              {/* Billing info */}
              <motion.div variants={rise} className="mt-5">
                <p className="text-[10px] font-[IBM_Plex_Mono,monospace] font-semibold uppercase tracking-[0.16em] text-[#1E7A56]/70 mb-3">
                  Billing
                </p>
                <div className="rounded-lg bg-black/[0.025] border border-black/[0.06] divide-y divide-black/[0.06]">
                  <div className="px-3 py-3 flex items-center justify-between">
                    <span className="text-xs text-black/50">Billing cycle</span>
                    <span className="text-xs font-medium text-black/70">
                      30 days
                    </span>
                  </div>
                  <div className="px-3 py-3 flex items-center justify-between">
                    <span className="text-xs text-black/50">Selected plan</span>
                    <span className="text-xs font-medium text-black/70">
                      {PLANS[selectedPlan]?.name}
                    </span>
                  </div>
                  <div className="px-3 py-3 flex items-center justify-between">
                    <span className="text-xs text-black/50">Payment</span>
                    <span className="text-xs font-medium text-black/40">
                      Razorpay
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={rise}
                className="flex items-center justify-center gap-1.5 mt-5"
              >
                <ShieldCheck size={12} className="text-black/30" />
                <p className="text-[10px] text-black/30">
                  Secure payments powered by Razorpay
                </p>
              </motion.div>
            </motion.div>

            {/* Footer */}
            <div className="p-4 border-t border-black/[0.07] shrink-0">
              <button
                onClick={onClose}
                className="w-full rounded-lg border border-black/[0.08] bg-white text-black/55 text-sm py-2.5 hover:bg-black/[0.03] hover:text-black/80 transition-colors"
              >
                Continue with {currentPlan.name}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;
