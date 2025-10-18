"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const AuthButtons: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const theme = useTheme();

  if (token) return null;

  return (
    <button
      className="hidden lg:block bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors duration-200 font-medium text-sm"
      onClick={() => router.push("/auth")}
      style={{
        fontFamily: theme.typography.fontFamily.regular,
      }}
    >
      Sign Up / Login
    </button>
  );
};

export default AuthButtons;