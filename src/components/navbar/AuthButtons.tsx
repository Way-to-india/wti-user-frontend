"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const AuthButtons = () => {
  const router = useRouter();
  const { token, logoutUser } = useAuth();
  const theme = useTheme();

  if (!token) {
    return (
      <button
        style={{
          backgroundColor: theme.colors.carrotOrange,
          borderRadius: '9999px',
          padding: '0.5rem 1.25rem',
          textAlign: 'center' as const,
          fontWeight: theme.typography.fontWeight.regular,
          marginLeft: '2.5rem',
          fontFamily: theme.typography.fontFamily.regular,
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          color: theme.colors.milkWhite,
          border: 'none',
          fontSize: theme.typography.fontSize.body
        }}
        onClick={() => router.push("/auth/signup")}
      >
        Sign Up/Login
      </button>
    );
  }

  return null; // We'll show user dropdown instead
};

export default AuthButtons;
