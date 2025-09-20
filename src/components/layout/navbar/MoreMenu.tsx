"use client";

import { CaretDown } from "@phosphor-icons/react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const moreItems = [
  { text: "About Us", path: "/about" },
  { text: "Blog", path: "/blog" },
  { text: "Careers", path: "/careers" },
  // Add or remove items as needed
];

const MoreMenu: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.5rem 0.75rem',
          borderRadius: '9999px',
          transition: 'background-color 0.3s ease',
          backgroundColor: open ? theme.colors.carrotOrange + '20' : 'transparent',
          fontFamily: theme.typography.fontFamily.regular,
          fontWeight: theme.typography.fontWeight.regular,
          color: theme.colors.heavyMetal,
          fontSize: theme.typography.fontSize.body,
          border: 'none',
          cursor: 'pointer'
        }}
        onClick={() => setOpen(!open)}
        aria-label="More menu"
      >
        More
        <CaretDown
          size={16}
          style={{
            transition: 'transform 0.3s ease',
            transform: open ? 'rotate(180deg)' : 'none'
          }}
        />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          marginTop: '0.5rem',
          width: '10rem',
          backgroundColor: theme.colors.milkWhite,
          borderRadius: '0.5rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          zIndex: 50
        }}>
          <ul style={{ padding: '0.25rem 0' }}>
            {moreItems.map((item, i) => (
              <li
                key={i}
                style={{
                  listStyle: 'none',
                  padding: '0.75rem 1rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease',
                  fontFamily: theme.typography.fontFamily.regular,
                  fontSize: theme.typography.fontSize.body,
                  color: theme.colors.heavyMetal
                }}
                onClick={() => {
                  router.push(item.path);
                  setOpen(false);
                }}
              >
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MoreMenu;
