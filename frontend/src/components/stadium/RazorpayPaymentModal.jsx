import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck, CreditCard, QrCode, Building2,
  Lock, ArrowRight
} from 'lucide-react';

export default function RazorpayPaymentModal({
  isOpen,
  onClose,
  amount,
  fixture,
  seats,
  currentUser,
  onPaymentSuccess
}) {
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi, card, netbanking
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [upiId, setUpiId] = useState(currentUser?.email ? `${currentUser.email.split('@')[0]}@upi` : 'shup@okaxis');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  if (!isOpen) return null;

  const keyId = 'rzp_test_3ujiEJJapHR3Se';

  const handlePay = () => {
    setProcessing(true);
    setProcessingStep('Connecting to Razorpay Secure Gateway...');

    setTimeout(() => {
      setProcessingStep('Authorizing transaction with bank...');
    }, 800);

    setTimeout(() => {
      setProcessingStep('Verifying payment signature...');
    }, 1600);

    setTimeout(() => {
      const randomSuffix = Math.random().toString(36).substring(2, 9).toUpperCase();
      const paymentId = `pay_rzp_${randomSuffix}`;
      setProcessing(false);
      onPaymentSuccess(paymentId, paymentMethod.toUpperCase());
    }, 2200);
  };

  const formattedAmount = (amount || 0).toLocaleString('en-IN');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-gray-200 relative my-6 text-left"
        >
          {/* Top Razorpay Header Bar */}
          <div className="bg-[#0B1426] text-white p-5 relative flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0052FF] flex items-center justify-center text-white font-black text-lg shadow-lg">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base tracking-tight text-white">Razorpay Checkout</h3>
                  <span className="text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                    Test Mode
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono">Key: {keyId}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={processing}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Amount & Merchant Header Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-emerald-50/30 p-4 px-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Merchant</span>
              <span className="text-sm font-black text-gray-900">ClubVerse FC Official Ticketing</span>
              <p className="text-xs text-gray-500 mt-0.5">
                {fixture?.home_team?.name || 'Home'} vs {fixture?.away_team?.name || 'Away'} • {seats?.length || 1} Seat(s)
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Total Amount</span>
              <span className="text-2xl font-serif font-black text-gray-900">₹{formattedAmount}</span>
            </div>
          </div>

          {/* Processing Screen Overlay */}
          {processing ? (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 py-14">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                <Lock className="w-6 h-6 text-emerald-700 absolute inset-0 m-auto" />
              </div>
              <div>
                <h4 className="font-bold text-base text-gray-900">Processing Payment...</h4>
                <p className="text-xs text-emerald-600 font-medium mt-1 animate-pulse">{processingStep}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted Razorpay Gateway</span>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-5">

              {/* User Prefill Info */}
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center">
                    {(currentUser?.name || currentUser?.full_name || 'S')[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900">{currentUser?.name || currentUser?.full_name || 'Shup'}</span>
                    <span className="text-gray-500 block text-[11px]">{currentUser?.email || 'shup@gmail.com'}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Verified User
                </span>
              </div>

              {/* Payment Methods Selection Tabs */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${paymentMethod === 'upi'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs">UPI / GPay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-3 rounded-2xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${paymentMethod === 'netbanking'
                        ? 'border-emerald-600 bg-emerald-50/50 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span className="text-xs">NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Method Details Section */}
              {paymentMethod === 'upi' && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">Virtual Payment Address (VPA)</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">Auto Test Approved</span>
                  </div>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    placeholder="username@upi"
                  />
                  <p className="text-[11px] text-gray-500">
                    Supports Google Pay, PhonePe, Paytm, BHIM & all major UPI apps.
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-600 block mb-1">Card Number (Test Card)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono text-center focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-600 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvv}
                        maxLength={3}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-mono text-center focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <label className="text-xs font-bold text-gray-800 block mb-1">Select Bank</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank'].map(bank => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${selectedBank === bank
                            ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500/20'
                            : 'border-gray-200 text-gray-700 bg-white hover:bg-gray-100'
                          }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay Action Button */}
              <button
                type="button"
                onClick={handlePay}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Lock className="w-4 h-4 text-emerald-200" />
                Pay ₹{formattedAmount} via Razorpay
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secured by Razorpay</span>
                </div>
                <span>PCI-DSS Compliant</span>
              </div>

            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
