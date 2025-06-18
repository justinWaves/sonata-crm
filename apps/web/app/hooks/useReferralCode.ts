import { useCallback } from 'react';

// Generates a short random alphanumeric referral code
function generateReferralCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function useReferralCode() {
  return useCallback(() => generateReferralCode(), []);
} 