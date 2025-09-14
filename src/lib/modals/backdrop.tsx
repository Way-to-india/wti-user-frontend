import React from "react";
import { motion } from "framer-motion";

export const Backdrop = ({
	children,
	onClick,
}: {
	children: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
}) => {
	return (
		<motion.div
			className="backdrop"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={onClick}
		>
			{children}
		</motion.div>
	);
};
