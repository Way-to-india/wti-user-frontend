import React from "react";
import Buttons from "@/lib/buttons/buttons";
import { motion, AnimatePresence } from "framer-motion";
import { Backdrop } from "./backdrop";
import { X } from "@phosphor-icons/react";

const dropIn = {
  hidden: { y: "-100vh", opacity: 0 },
  visible: {
    y: "0",
    opacity: 1,
    transition: { duration: 0.1, type: "spring", damping: 100, stiffness: 500 },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const drawerIn = {
  hidden: { x: "100vw", opacity: 1 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, type: "spring", damping: 40, stiffness: 400 },
  },
  exit: {
    x: "100vw",
    opacity: 1,
    transition: { duration: 0.15 },
  },
};

interface ModalProps {
  modalOpen: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  className?: string;
  drawer?: boolean; // If true, show as right-side drawer
}

const Modal: React.FC<ModalProps> = ({
  modalOpen,
  handleClose,
  children,
  className = '',
  drawer = false,
}) => {
  return (
    <AnimatePresence initial={false} mode="wait">
      {modalOpen && (
        <Backdrop onClick={handleClose}>
          <motion.div
            className={
              drawer
                ? `fixed top-0 right-0 h-full bg-white shadow-2xl z-50 max-w-[600px] w-full md:w-[50vw] rounded-l-2xl flex flex-col ${className}`
                : `${className} modal`
            }
            variants={drawer ? drawerIn : dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={drawer ? { maxWidth: 600, width: '100%', height: '100vh' } : {}}
          >
            {/* <Buttons
              className=""
              title="Close"
              onClick={handleClose}
            > */}
            {/* <X className="ml-[95.12%]" /> */}
            {/* </Buttons> */}
            {children}
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default Modal;
