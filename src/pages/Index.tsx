import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { ImageUpload } from "@/components/ImageUpload";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Transform Your Images with AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enhance, restore, and perfect your photos with our cutting-edge AI technology.
            Experience the magic of automatic image enhancement.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ImageUpload />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;