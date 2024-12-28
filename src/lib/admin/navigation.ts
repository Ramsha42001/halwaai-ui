// Convert icons to string identifiers
export const NAV_ITEMS = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: "dashboard"
    },
    {
      title: "Predefined Thalis",
      href: "/admin/predefinedThaalis",
      icon: "utensils"
    }
  ] as const;
  
  export type NavItemIcon = typeof NAV_ITEMS[number]['icon'];