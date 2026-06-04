import { motion } from "motion/react";
export default function UnderLineDiv({Id,className}) {
  return (
    <motion.div
      layoutId={Id}
      className={className}
    />
  );
}
