"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface NavItemProps {
  icon: any;
  text: string;
  path: string;
  onClick: (url: string) => void;
  activePath?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, text, path, onClick, activePath }) => {
  const theme = useTheme();
  const isActive = activePath === path;
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        padding: '0.5rem 0.75rem',
        borderRadius: '9999px',
        backgroundColor: isActive ? theme.colors.carrotOrange : 'transparent',
        color: isActive ? theme.colors.milkWhite : theme.colors.heavyMetal,
        fontWeight: isActive ? theme.typography.fontWeight.bold : theme.typography.fontWeight.regular,
        boxShadow: isActive ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
        fontFamily: theme.typography.fontFamily.regular,
        fontSize: theme.typography.fontSize.body
      }}
      className={!isActive ? "hover:text-[#FF8B02]" : ""}
      onClick={() => onClick(path)}
    >
      <Icon size={20} />
      <span>{text}</span>
    </div>
  );
};

export default NavItem;
