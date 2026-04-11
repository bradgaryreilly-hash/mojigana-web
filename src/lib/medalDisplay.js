import {
  Medal as MedalIcon,
  Award,
  Trophy,
  Crown,
} from 'lucide-react';

/**
 * Full medal tier metadata for UI (icons, gradients, borders).
 * Used across selection grid, quiz penalties, and mastery guide.
 */
export const getMedalDisplayInfo = (score = 0, isDark = false) => {
  if (score >= 30) {
    return {
      name: 'Platinum',
      threshold: 30,
      icon: Crown,
      color: '#06B6D4',
      dimColor: isDark ? '#164E63' : '#CFFAFE',
      unselectedBg: isDark ? '#08334466' : '#E0F7FA99',
      bg: isDark
        ? 'linear-gradient(135deg, #083344 0%, #155E75 100%)'
        : 'linear-gradient(135deg, #FFFFFF 0%, #22D3EE 100%)',
      border: '#22D3EE',
      shadow: '0 4px 12px rgba(6, 182, 212, 0.4)',
      penalty: 9,
    };
  }
  if (score >= 20) {
    return {
      name: 'Gold',
      threshold: 20,
      icon: Trophy,
      color: '#F59E0B',
      dimColor: isDark ? '#A16207' : '#FEF3C7',
      unselectedBg: isDark ? '#713F1244' : '#FFFDE799',
      bg: isDark
        ? 'linear-gradient(135deg, #451A03 0%, #92400E 100%)'
        : 'linear-gradient(135deg, #FFFFFF 0%, #FBBF24 100%)',
      border: '#FBBF24',
      shadow: '0 3px 8px rgba(245, 158, 11, 0.3)',
      penalty: 5,
    };
  }
  if (score >= 10) {
    return {
      name: 'Silver',
      threshold: 10,
      icon: MedalIcon,
      color: isDark ? '#94A3B8' : '#64748B',
      dimColor: isDark ? '#334155' : '#E2E8F0',
      unselectedBg: isDark ? '#1E293B66' : '#F8FAFC99',
      bg: isDark
        ? 'linear-gradient(135deg, #1E293B 0%, #64748B 50%, #1E293B 100%)'
        : 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 50%, #94A3B8 100%)',
      border: '#94A3B8',
      shadow: '0 2px 8px rgba(148, 163, 184, 0.2)',
      penalty: 3,
    };
  }
  if (score >= 4) {
    return {
      name: 'Bronze',
      threshold: 4,
      icon: Award,
      color: '#D97706',
      dimColor: isDark ? '#7C2D12' : '#FFD8A8',
      unselectedBg: isDark ? '#43140766' : '#FFF3E099',
      bg: isDark
        ? 'linear-gradient(135deg, #431407 0%, #7C2D12 100%)'
        : 'linear-gradient(135deg, #FFFFFF 0%, #F97316 100%)',
      border: '#D97706',
      shadow: 'none',
      penalty: 2,
    };
  }
  return {
    name: 'Unranked',
    icon: null,
    color: isDark ? '#2DD4BF' : '#06948E',
    dimColor: isDark ? '#1E293B' : '#E0F2F1',
    unselectedBg: isDark ? '#0f172a' : '#ffffff',
    bg: isDark
      ? '#0f172a'
      : 'linear-gradient(135deg, #FFFFFF 0%, #F0FDFA 100%)',
    border: isDark ? '#0d9488' : '#A8D7D3',
    shadow: '0 2px 8px rgba(13, 148, 136, 0.1)',
    penalty: 1,
  };
};
