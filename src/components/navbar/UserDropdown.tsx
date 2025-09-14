"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CaretDown, User as UserIcon } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const UserDropdown = () => {
  const { user, logoutUser } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          padding: '0.5rem 0.75rem',
          borderRadius: '9999px',
          transition: 'background-color 0.3s ease',
          backgroundColor: dropdownOpen ? theme.colors.carrotOrange + '20' : 'transparent'
        }}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '9999px',
          overflow: 'hidden',
          border: `2px solid ${theme.colors.carrotOrange}`,
          backgroundColor: theme.colors.carrotOrange + '20',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {user?.profileImagePath ? (
            <Image
              src={user.profileImagePath}
              alt="Profile"
              width={40}
              height={40}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
          ) : (
            <UserIcon size={24} weight="fill" style={{ color: theme.colors.carrotOrange }} />
          )}
        </div>
        <span style={{
          fontWeight: theme.typography.fontWeight.regular,
          fontFamily: theme.typography.fontFamily.regular,
          color: theme.colors.heavyMetal,
          fontSize: theme.typography.fontSize.body
        }}>
          {user?.name || "User"}
        </span>
        <CaretDown size={16} style={{
          transition: 'transform 0.3s ease',
          transform: dropdownOpen ? 'rotate(180deg)' : 'none'
        }} />
      </div>
      {dropdownOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          backgroundColor: theme.colors.milkWhite,
          borderRadius: '0.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          minWidth: '12rem',
          zIndex: 50
        }}>          <button
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              textAlign: 'left' as const,
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.colors.heavyMetal,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.body,
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onClick={() => {
              router.push("/profile");
              setDropdownOpen(false);
            }}
          >
            Profile
          </button>
          <button
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              textAlign: 'left' as const,
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.colors.heavyMetal,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.body,
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onClick={() => {
              router.push("/my-bookings");
              setDropdownOpen(false);
            }}
          >
            My Bookings
          </button>
          <button
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              textAlign: 'left' as const,
              border: 'none',
              backgroundColor: 'transparent',
              color: theme.colors.heavyMetal,
              fontFamily: theme.typography.fontFamily.regular,
              fontSize: theme.typography.fontSize.body,
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onClick={() => {
              logoutUser();
              setDropdownOpen(false);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
