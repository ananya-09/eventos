"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { modalVariants, overlayVariants } from "@/lib/animations";
import { Button } from "./button";

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "danger" | "primary";
  icon?: React.ReactNode;
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger",
  icon,
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop (Using correct Tailwind slate color bg-slate-900/40) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={isLoading ? undefined : onClose}
            className="absolute inset-0 bg-slate-900/40 pointer-events-auto"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xl w-full max-w-sm relative z-10 space-y-6 pointer-events-auto"
          >
            <div className="text-center space-y-2">
              {icon && (
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                  variant === "danger" ? "bg-red-50 text-red-500" : "bg-blue-50 text-[#34629f]"
                }`}>
                  {icon}
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
              <p className="text-sm text-slate-500">{description}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 transition-colors text-sm disabled:opacity-50 cursor-pointer"
              >
                {cancelText}
              </button>
              <Button
                variant={variant === "danger" ? "destructive" : "default"}
                isLoading={isLoading}
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl font-semibold transition-colors text-sm cursor-pointer"
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
