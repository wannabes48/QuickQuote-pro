import React from 'react';
import { cn } from "@/lib/utils";

export function AppLogo({ className, ...props }) {
  return (
    <img 
      src="/logo.png" 
      alt="QuickQuote Pro" 
      className={cn("object-contain", className)} 
      {...props} 
    />
  );
}

export function AppLogoText() {
  // Disabled: The new logo image has text baked in.
  return null;
}

export function AppLogoDarkText() {
  // Disabled: The new logo image has text baked in.
  return null;
}
