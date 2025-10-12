import { Check, X } from 'lucide-react';
import { usePasswordStrength } from '../../hooks/auth/usePasswordStrength';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const { strength, strengthLabel, requirements } = usePasswordStrength(password);

  // Don't show anything if password is empty
  if (!password) {
    return null;
  }

  // Color scheme based on strength
  const getStrengthColor = (strength: number) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = (strength: number) => {
    if (strength <= 2) return 'text-red-600 dark:text-red-400';
    if (strength <= 3) return 'text-yellow-600 dark:text-yellow-400';
    if (strength <= 4) return 'text-blue-600 dark:text-blue-400';
    return 'text-green-600 dark:text-green-400';
  };

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Meter Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Password Strength
          </span>
          <span className={`text-xs font-semibold ${getStrengthTextColor(strength)}`}>
            {strengthLabel}
          </span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStrengthColor(strength)} transition-all duration-300`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2">
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password Requirements:
        </p>
        {requirements.map((requirement) => (
          <div
            key={requirement.id}
            className="flex items-center space-x-2 text-xs transition-all duration-200"
          >
            {requirement.met ? (
              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            ) : (
              <X className="h-4 w-4 text-gray-400 flex-shrink-0" />
            )}
            <span
              className={`${
                requirement.met
                  ? 'text-green-600 dark:text-green-400 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {requirement.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

