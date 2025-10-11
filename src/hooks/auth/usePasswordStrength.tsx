import { useState, useMemo, useCallback } from 'react';
import { getPasswordStrength, getPasswordStrengthLabel } from '../../utils/formValidation';

interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

interface UsePasswordStrengthReturn {
  strength: number;
  strengthLabel: string;
  requirements: PasswordRequirement[];
  isStrong: boolean;
  checkRequirement: (requirement: string) => boolean;
}

export const usePasswordStrength = (password: string): UsePasswordStrengthReturn => {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const strengthLabel = useMemo(() => getPasswordStrengthLabel(strength), [strength]);
  const isStrong = useMemo(() => strength >= 4, [strength]);

  const requirements: PasswordRequirement[] = useMemo(() => [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'uppercase', label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'lowercase', label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { id: 'number', label: 'One number', met: /\d/.test(password) },
    { id: 'special', label: 'One special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ], [password]);

  const checkRequirement = useCallback((requirement: string): boolean => {
    const req = requirements.find(r => r.id === requirement);
    return req?.met || false;
  }, [requirements]);

  return {
    strength,
    strengthLabel,
    requirements,
    isStrong,
    checkRequirement,
  };
};
