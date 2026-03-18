import React from 'react';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-brand-dark overflow-x-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-brand-dark/95 selection:bg-brand-primary/30">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-brand-primary/10 blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 blur-[120px] animate-pulse delay-700"></div>
      </div>

      {/* Persistence Sidebar */}
      <Sidebar />

      {/* Primary Content Terminal */}
      <main className="flex-1 transition-all duration-500 lg:pl-64 relative z-10">
        {/* <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="h-full overflow-y-auto px-6 py-10 lg:px-14 lg:py-14"
        > */}
          {children}
        {/* </motion.div> */}
      </main>
    </div>
  );
};

export default MainLayout;
