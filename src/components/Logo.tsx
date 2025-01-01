import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <motion.div
      className="flex items-center space-x-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative w-10 h-10">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-lg"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0.5 bg-white rounded-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-primary">E</span>
        </div>
      </div>
      <motion.span 
        className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Enhancer AI
      </motion.span>
    </motion.div>
  );
};