"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, Loader2 } from "lucide-react";

interface LeaveCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function LeaveCommunityModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading 
}: LeaveCommunityModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isLoading ? undefined : onClose}
            className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 shadow-inner">
                    <LogOut className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Leave Community</h3>
                </div>
                <button 
                  onClick={onClose}
                  disabled={isLoading}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-slate-600 leading-relaxed">
                  Are you sure you want to leave this community? You will no longer receive updates and your membership status will be removed.
                </p>
              </div>

              {/* Footer */}
              <div className="p-6 pt-2 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end bg-slate-50/50">
                <motion.button
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.97 } : {}}
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition-all disabled:opacity-50 w-full sm:w-auto"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={!isLoading ? { scale: 1.02 } : {}}
                  whileTap={!isLoading ? { scale: 0.97 } : {}}
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Leaving...
                    </>
                  ) : (
                    "Leave Community"
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
