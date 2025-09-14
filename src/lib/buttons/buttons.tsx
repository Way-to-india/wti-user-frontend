import { motion, VariantLabels, TargetAndTransition } from "framer-motion";

interface ButtonProps {
  whileHover?: VariantLabels | TargetAndTransition; // Ensure correct type
  whileTap?: VariantLabels | TargetAndTransition;   // Ensure correct type
  type?: "button" | "submit" | "reset";
  title?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  text: string;
  children?: React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({
  whileHover,
  whileTap,
  type = "button",
  title,
  disabled,
  loading,
  onClick,
  className,
  text,
  children,
}) => (
  <motion.button
    whileHover={whileHover} // Ensure correct type
    whileTap={whileTap}     // Ensure correct type
    type={type}
    title={title}
    disabled={disabled || loading}
    onClick={onClick}
    className={`${className} rounded-3xl flex items-center justify-center`}
  >
    {loading ? (
      <div className="loader"></div>
    ) : (
      <>
        <p className="font-sefarvestSFProDisplay text-lg">{text}</p>
        {children}
      </>
    )}
  </motion.button>
);

export default CustomButton;
