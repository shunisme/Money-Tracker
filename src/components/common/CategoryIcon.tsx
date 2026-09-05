import React from 'react';
import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Receipt,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Wallet,
  Laptop,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TransactionCategory } from '../../types/finance';

interface CategoryIconProps {
  category: TransactionCategory;
  className?: string;
}

const iconMap: Record<TransactionCategory, LucideIcon> = {
  Food: UtensilsCrossed,
  Transport: Car,
  Shopping: ShoppingBag,
  Bills: Receipt,
  Entertainment: Gamepad2,
  Education: GraduationCap,
  Health: HeartPulse,
  Salary: Briefcase,
  Allowance: Wallet,
  Freelance: Laptop,
  Investment: TrendingUp,
  Other: MoreHorizontal,
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, className = 'w-5 h-5' }) => {
  const IconComponent = iconMap[category] || MoreHorizontal;
  return <IconComponent className={className} />;
};
