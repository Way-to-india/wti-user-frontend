"use client";
import React from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";
import UserDropdown from "./UserDropdown";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const NavBar: React.FC = () => {
  const { token } = useAuth();
  const theme = useTheme();
  return (
    <nav className="sticky top-0 z-50 w-full" style={{ 
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.25rem 5rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      backgroundColor: theme.colors.milkWhite,
      color: theme.colors.heavyMetal,
      fontFamily: theme.typography.fontFamily.regular,
      fontWeight: theme.typography.fontWeight.regular,
      fontSize: theme.typography.fontSize.body
    }}>
      <Logo />
      <NavLinks />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {token ? <UserDropdown /> : <AuthButtons />}
      </div>
    </nav>
  );
};

export default NavBar;
