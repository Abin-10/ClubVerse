import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, itemType, itemName }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-[#FFFDF8] border border-[#E4E1D8] rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-warm-lg space-y-5 relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#6F716B] hover:text-[#20221F] rounded-full hover:bg-[#EFEEE8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-black text-xl text-[#20221F]">Confirm Deletion</h3>
              <p className="text-xs text-[#6F716B] font-medium">This action cannot be undone.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7F5EF] border border-[#E4E1D8] space-y-1">
            <p className="text-xs text-[#6F716B]">
              Are you sure you want to permanently delete {itemType || 'item'}:
            </p>
            <p className="text-sm font-bold text-[#20221F]">
              {itemName || 'Selected Item'}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-[#E4E1D8] text-[#20221F] font-bold text-xs bg-[#FFFDF8] hover:bg-[#EFEEE8] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-warm-sm flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Permanently</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
