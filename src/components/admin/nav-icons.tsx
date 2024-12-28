"use client"

import { LayoutDashboard, UtensilsCrossed } from "lucide-react";
import { NavItemIcon } from "@/lib/admin/navigation";

const iconMap = {
  dashboard: LayoutDashboard,
  utensils: UtensilsCrossed
};

interface NavIconProps {
  icon: NavItemIcon;
  className?: string;
}

export function NavIcon({ icon, className }: NavIconProps) {
  const Icon = iconMap[icon];
  return <Icon className={className} />;
}