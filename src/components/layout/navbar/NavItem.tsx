
interface NavItemProps {
  icon: React.ElementType;
  text: string;
  onClick: (path?: string) => void;
  path?: string;
  active?: boolean;
  isMobile?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, text, onClick, active, path, isMobile }) => (
  <button
    onClick={() => onClick(path)}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
      active ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-500'
    }`}
  >
    <Icon size={20} />
    <span>{text}</span>
  </button>
);

export default NavItem;
