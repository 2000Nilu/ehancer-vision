import { Flame } from "lucide-react";
import { motion } from "framer-motion";

const Logo = () => {
  return (
    <motion.div
      className="flex items-center gap-2 text-2xl font-bold"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-orange-500"
      >
        <Flame className="w-8 h-8" />
      </motion.div>
      <motion.span
        className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text"
        whileHover={{ scale: 1.05 }}
      >
        Enhance AI
      </motion.span>
    </motion.div>
  );
};

export default Logo;