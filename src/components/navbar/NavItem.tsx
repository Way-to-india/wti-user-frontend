'use client';
import { Icon } from '@phosphor-icons/react';
import { useTheme } from '@/context/ThemeContext';

interface NavItemProps {
  icon: Icon;
  text: string;
  path: string;
  onClick: (path: string) => void;
  activePath?: string;
  isMobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  text,
  path,
  onClick,
  activePath,
  isMobile = false,
}) => {
  const theme = useTheme();
  const isActive = activePath === path;

  const baseClasses = `
    flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer
    hover:bg-gray-100 active:scale-95
  `;

  const mobileClasses = isMobile ? 'w-full justify-start text-base' : 'text-sm lg:text-base';

  return (
    <div
      className={`${baseClasses} ${mobileClasses} ${
        isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700 hover:text-orange-600'
      }`}
      onClick={() => onClick(path)}
      style={{
        fontFamily: theme.typography.fontFamily.regular,
        fontWeight: isActive
          ? theme.typography.fontWeight.bold
          : theme.typography.fontWeight.regular,
      }}
    >
      <Icon
        size={isMobile ? 20 : 18}
        weight={isActive ? 'fill' : 'regular'}
        className="flex-shrink-0"
      />
      <span className={isMobile ? 'block' : 'hidden sm:block'}>{text}</span>
    </div>
  );
};

export default NavItem;
