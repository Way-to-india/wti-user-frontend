"use client";
import { useRouter, usePathname } from "next/navigation";
import { House, UsersFour, Bed, Island, Headset } from "@phosphor-icons/react";
import NavItem from "./NavItem";
import MoreMenu from "./MoreMenu";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
    { icon: House, text: "Home", path: "/" },
    { icon: UsersFour, text: "Tours", path: "/tours" },
    { icon: Bed, text: "Hotels", path: "/hotels" },
    { icon: Island, text: "Transportation", path: "/transport" },
    { icon: Headset, text: "Contact Us", path: "/contact-us" },
];

const NavLinks = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      margin: '0 2.5rem',
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.body,
      color: theme.colors.heavyMetal
    }}>
      {navItems.map((item, index) => (
        <NavItem key={index} {...item} onClick={router.push} activePath={pathname || undefined} />
      ))}
      <MoreMenu />
    </div>
  );
};

export default NavLinks;
