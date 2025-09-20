"use client";
import React from "react";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import AuthButtons from "./AuthButtons";
import UserDropdown from "./UserDropdown";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const NavBar: React.FC = () => {
  const { token } = useAuth();
  const theme = useTheme();

  return (
    <nav 
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100"
      style={{
        fontFamily: theme.typography.fontFamily.regular,
        color: theme.colors.heavyMetal,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <NavLinks />

          {/* Desktop Auth/User Section */}
          <div className="hidden lg:flex items-center gap-4">
            {token ? <UserDropdown /> : <AuthButtons />}
          </div>

          {/* Mobile Menu */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;