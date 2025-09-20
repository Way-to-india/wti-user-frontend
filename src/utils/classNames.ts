/**
 * Utility function to conditionally join classNames together
 * Similar to classnames library but simplified
 */
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Utility function to create conditional className objects
 */
export function classNames(...args: (string | Record<string, boolean> | undefined | null)[]): string {
  const classes: string[] = [];

  args.forEach(arg => {
    if (!arg) return;

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'object') {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(' ');
}

/**
 * Common responsive patterns
 */
export const responsive = {
  // Container patterns
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  containerTight: 'container mx-auto px-4 sm:px-6',
  
  // Grid patterns
  gridCols1: 'grid grid-cols-1',
  gridCols2: 'grid grid-cols-1 md:grid-cols-2',
  gridCols3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  gridCols4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  
  // Flex patterns
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  flexStart: 'flex items-start',
  flexCol: 'flex flex-col',
  flexColCenter: 'flex flex-col items-center justify-center',
  
  // Text responsive patterns
  textSm: 'text-sm sm:text-base',
  textBase: 'text-base sm:text-lg',
  textLg: 'text-lg sm:text-xl md:text-2xl',
  textXl: 'text-xl sm:text-2xl md:text-3xl',
  text2xl: 'text-2xl sm:text-3xl md:text-4xl',
  text3xl: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
  
  // Spacing patterns
  py: 'py-8 md:py-12',
  px: 'px-4 md:px-8',
  gap: 'gap-4 md:gap-6',
  gapLg: 'gap-6 md:gap-8',
  
  // Common combinations
  section: 'py-8 md:py-12 px-4 md:px-8',
  sectionContainer: 'container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12',
};

/**
 * Animation classes
 */
export const animations = {
  fadeIn: 'animate-in fade-in duration-500',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-500',
  slideDown: 'animate-in slide-in-from-top-4 duration-500',
  slideLeft: 'animate-in slide-in-from-right-4 duration-500',
  slideRight: 'animate-in slide-in-from-left-4 duration-500',
  scaleIn: 'animate-in zoom-in-95 duration-300',
  hover: 'transition-all duration-200 hover:scale-105',
  hoverShadow: 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
};

/**
 * Focus and interaction states
 */
export const interactions = {
  focus: 'focus:outline-none focus:ring-2 focus:ring-carrot-orange focus:ring-offset-2',
  focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carrot-orange',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  clickable: 'cursor-pointer select-none',
  transition: 'transition-all duration-200',
};

/**
 * Common button variants
 */
export const buttonVariants = {
  primary: 'bg-carrot-orange text-white hover:bg-orange-600',
  secondary: 'bg-gray-100 text-heavy-metal hover:bg-gray-200',
  outline: 'border border-carrot-orange text-carrot-orange hover:bg-carrot-orange hover:text-white',
  ghost: 'text-carrot-orange hover:bg-carrot-orange/10',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

/**
 * Color utilities
 */
export const colors = {
  primary: 'text-carrot-orange',
  secondary: 'text-heavy-metal',
  muted: 'text-gray-600',
  white: 'text-white',
  success: 'text-green-600',
  warning: 'text-yellow-600',
  danger: 'text-red-600',
  
  // Backgrounds
  bgPrimary: 'bg-carrot-orange',
  bgSecondary: 'bg-heavy-metal',
  bgMuted: 'bg-gray-100',
  bgWhite: 'bg-white',
  bgSuccess: 'bg-green-100',
  bgWarning: 'bg-yellow-100',
  bgDanger: 'bg-red-100',
};
