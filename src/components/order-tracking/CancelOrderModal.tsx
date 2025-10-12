import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => Promise<void>;
  orderNumber: string;
  loading?: boolean;
}

const CANCEL_REASONS = [
  'Changed my mind',
  'Found a better price elsewhere',
  'Ordered by mistake',
  'Delivery time too long',
  'Need to modify order',
  'Other reason',
];

const CancelOrderModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  orderNumber,
  loading = false
}: CancelOrderModalProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    const finalReason = selectedReason === 'Other reason' ? customReason : selectedReason;
    await onConfirm(finalReason);
    // Reset state
    setSelectedReason('');
    setCustomReason('');
    setShowConfirm(false);
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedReason('');
      setCustomReason('');
      setShowConfirm(false);
      onClose();
    }
  };

  const canProceed = selectedReason && (selectedReason !== 'Other reason' || customReason.trim());

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {!showConfirm ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Cancel Order
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  Order: <span className="font-semibold">{orderNumber}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please select a reason for cancellation:
                </p>
              </div>

              {/* Reasons */}
              <div className="space-y-2 mb-4">
                {CANCEL_REASONS.map((reason) => (
                  <label
                    key={reason}
                    className={`
                      flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all
                      ${
                        selectedReason === reason
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="cancel-reason"
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      disabled={loading}
                      className="w-4 h-4 text-red-600 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                    />
                    <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                      {reason}
                    </span>
                  </label>
                ))}
              </div>

              {/* Custom Reason Textarea */}
              {selectedReason === 'Other reason' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Please specify your reason:
                  </label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 disabled:opacity-50"
                    rows={3}
                    placeholder="Enter your reason..."
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {customReason.length}/200 characters
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex gap-3">
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 py-2 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Keep Order
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={!canProceed || loading}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-colors
                  ${
                    !canProceed || loading
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }
                `}
              >
                Continue
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation Screen */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
                Confirm Cancellation
              </h2>
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50"
                aria-label="Go back"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-3">
                  <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Are you sure?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    This action cannot be undone. Your order will be cancelled and you'll receive a confirmation email.
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Order Number:</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{orderNumber}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cancellation Reason:</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      {selectedReason === 'Other reason' ? customReason : selectedReason}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="flex-1 py-2 px-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`
                  flex-1 py-2 px-4 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-2
                  ${
                    loading
                      ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  'Yes, Cancel Order'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CancelOrderModal;

