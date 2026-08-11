import React, { useState } from 'react';
import { UPCOMING_MATCHES, TICKET_TIERS } from '../../data/mockData';
import { Ticket, X, CheckCircle2, ShieldCheck, MapPin, Calendar, CreditCard, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function TicketBookingModal({ isOpen, onClose, selectedMatch, initialTier }) {
  const match = selectedMatch || UPCOMING_MATCHES[0];
  const [tier, setTier] = useState(initialTier?.selectedTier || TICKET_TIERS[1]);
  const [quantity, setQuantity] = useState(2);
  const [isSuccess, setIsSuccess] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  if (!isOpen) return null;

  const totalPrice = tier.price * quantity;

  const handleBooking = (e) => {
    e.preventDefault();
    if (customerName && customerEmail) {
      setIsSuccess(true);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Book Matchday Tickets
                </h3>
                <p className="text-xs text-slate-500">Apex Arena NFC Ticketing Platform</p>
              </div>
            </div>

            {/* Selected Match Card */}
            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <Badge variant="blue">{match.competition}</Badge>
                <span className="font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  {match.date} • {match.time}
                </span>
              </div>
              <div className="flex items-center justify-between font-extrabold text-slate-900 text-base py-1">
                <span>{match.homeTeam}</span>
                <span className="text-xs text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded">VS</span>
                <span>{match.awayTeam}</span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{match.stadium}</span>
              </div>
            </div>

            <form onSubmit={handleBooking} className="space-y-5">
              
              {/* Seating Tier Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Select Seating Stand / Tier:
                </label>
                <div className="space-y-2">
                  {TICKET_TIERS.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setTier(t)}
                      className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        tier.id === t.id
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-extrabold text-slate-900">{t.name}</div>
                        <div className="text-[11px] text-slate-500">{t.stand}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black text-slate-900">${t.price}</div>
                        <div className="text-[10px] text-slate-400">/ ticket</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity Picker */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Ticket Quantity</span>
                  <span className="text-[11px] text-slate-500">Max 6 seats per transaction</span>
                </div>
                <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-slate-600 font-extrabold text-base hover:text-blue-600 px-1"
                  >
                    -
                  </button>
                  <span className="text-sm font-extrabold text-slate-900 w-4 text-center">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(6, quantity + 1))}
                    className="text-slate-600 font-extrabold text-base hover:text-blue-600 px-1"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-white text-slate-900 text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Total & Checkout button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Total Due</span>
                  <span className="text-2xl font-black text-slate-900">${totalPrice}</span>
                </div>
                <Button variant="primary" size="lg" icon={CreditCard} type="submit">
                  Confirm & Pay ${totalPrice}
                </Button>
              </div>

            </form>
          </div>
        ) : (
          /* Confirmation View */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900">Tickets Reserved!</h3>
            
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Thank you, <span className="font-bold text-slate-900">{customerName}</span>! Your matchday tickets for <span className="font-bold text-blue-600">{match.homeTeam} vs {match.awayTeam}</span> have been confirmed.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Tier:</span>
                <span className="font-bold text-slate-900">{tier.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Seats:</span>
                <span className="font-bold text-slate-900">{quantity} Mobile NFC Pass(es)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sent to:</span>
                <span className="font-bold text-slate-900">{customerEmail}</span>
              </div>
            </div>

            <Button variant="primary" size="md" onClick={handleClose} className="mt-4">
              Back to Home
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
