import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, ShieldAlert, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { FarmerReport } from '../types';
import { submitReport, getSafeErrorMessage } from '../services/api';

interface FarmerReportModalProps {
  farmerName: string;
  farmerPhone: string;
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted?: (report: FarmerReport) => void;
}

const REPORT_REASONS = [
  'Price Mismatch / Demanded Higher Price than Listed',
  'Quality Mismatch / Produce Spoiled or Substandard',
  'Wrong Date of Harvesting / Stale Produce',
  'Unresponsive / Invalid or Switched-Off Phone',
  'Suspicious / Demanded Advance Online Payment',
  'Farmer Details or Location Inaccurate',
  'Other Violation / Inappropriate Behavior',
];

export const FarmerReportModal: React.FC<FarmerReportModalProps> = ({
  farmerName,
  farmerPhone,
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');

  const [formErrors, setFormErrors] = useState<{ details?: string; reportedBy?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errors: { details?: string; reportedBy?: string } = {};
    if (!reportedBy.trim()) {
      errors.reportedBy = 'Your name is required';
    }
    if (!details.trim()) {
      errors.details = 'Please describe the issue in detail';
    } else if (details.trim().length < 10) {
      errors.details = 'Please provide at least 10 characters explaining what happened';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await submitReport({
        farmerPhone,
        farmerName,
        reportedBy: reportedBy.trim(),
        reporterPhone: reporterPhone.trim() || undefined,
        reason,
        details: details.trim(),
      });

      if (res.success && res.report) {
        setIsSuccess(true);
        if (onReportSubmitted) onReportSubmitted(res.report);
      } else {
        throw new Error(res.message || 'Failed to file report');
      }
    } catch (err) {
      const msg = getSafeErrorMessage(err, 'Failed to file report. Please try again.');
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setDetails('');
    setReportedBy('');
    setReporterPhone('');
    setReason(REPORT_REASONS[0]);
    setSubmitError(null);
    onClose();
  };

  return (
    <div
      id="farmer-report-modal-backdrop"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div
        id="farmer-report-modal"
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-rose-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 to-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Report Farmer</h3>
              <p className="text-xs text-rose-100">Directly visible to the administrator in Admin Center</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Target Farmer Summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-500 font-medium">Reporting Farmer:</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">{farmerName}</div>
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-medium">Phone Number:</span>
              <div className="font-mono font-semibold text-slate-800 text-sm mt-0.5">{farmerPhone}</div>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Report Filed Successfully</h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your report regarding <strong className="font-semibold">{farmerName}</strong> has been logged into the system. The platform administrator can review the issue in the Admin tab and delete or correct listings if needed.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Reason Selection */}
              <div>
                <label htmlFor="reportReason" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Reason for Report <span className="text-rose-500">*</span>
                </label>
                <select
                  id="reportReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                >
                  {REPORT_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Description */}
              <div>
                <label htmlFor="reportDetails" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Explanation / Incident Details <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="reportDetails"
                  rows={3}
                  value={details}
                  onChange={(e) => {
                    setDetails(e.target.value);
                    if (formErrors.details) setFormErrors({ ...formErrors, details: '' });
                  }}
                  placeholder="Explain clearly what happened (e.g. farmer quoted ₹50/kg on call instead of ₹30/kg listed, or produce was already rotting)..."
                  className={`w-full px-3 py-2 rounded-xl border ${
                    formErrors.details ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 bg-white'
                  } text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 leading-relaxed`}
                />
                {formErrors.details && (
                  <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.details}</p>
                )}
              </div>

              {/* Reporter Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reportedBy" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="reportedBy"
                    type="text"
                    value={reportedBy}
                    onChange={(e) => {
                      setReportedBy(e.target.value);
                      if (formErrors.reportedBy) setFormErrors({ ...formErrors, reportedBy: '' });
                    }}
                    placeholder="e.g. Sunita Devi"
                    className={`w-full px-3 py-2 rounded-xl border ${
                      formErrors.reportedBy ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300 bg-white'
                    } text-sm focus:outline-none focus:ring-2 focus:ring-rose-500`}
                  />
                  {formErrors.reportedBy && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{formErrors.reportedBy}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="reporterPhone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Phone (Optional)
                  </label>
                  <input
                    id="reporterPhone"
                    type="tel"
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-2xs text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Please submit truthful reports. The admin monitors reports to maintain safety and produce integrity across the platform.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                >
                  {isSubmitting ? (
                    <span>Submitting Report...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Report to Admin</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
