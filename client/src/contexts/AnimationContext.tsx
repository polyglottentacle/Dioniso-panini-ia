import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Definizione del tipo di contesto per le animazioni
interface AnimationContextType {
  pageTransition: any;
  fadeIn: any;
  slideUp: any;
  staggerChildren: any;
  childVariants: any;
  animationsEnabled: boolean;
  toggleAnimations: () => void;
}

// Creazione del contesto con valori di default
const AnimationContext = createContext<AnimationContextType>({
  pageTransition: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  },
  slideUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  },
  staggerChildren: {
    initial: {},
    animate: {},
    transition: { staggerChildren: 0.1 }
  },
  childVariants: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.3 }
  },
  animationsEnabled: true,
  toggleAnimations: () => {}
});

// Provider del contesto di animazione
export function AnimationProvider({ children }: { children: ReactNode }) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  const toggleAnimations = () => {
    setAnimationsEnabled(prev => !prev);
    // Salva la preferenza dell'utente nel localStorage
    localStorage.setItem('animationsEnabled', (!animationsEnabled).toString());
  };
  
  // Carica le preferenze dell'utente al montaggio del componente
  useEffect(() => {
    const savedPreference = localStorage.getItem('animationsEnabled');
    if (savedPreference !== null) {
      setAnimationsEnabled(savedPreference === 'true');
    }
  }, []);
  
  // Configurazioni delle animazioni
  const pageTransition = animationsEnabled ? {
    initial: { opacity: 0, x: -5 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 5 },
    transition: { type: "spring", stiffness: 260, damping: 20 }
  } : {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
    transition: { duration: 0 }
  };
  
  const fadeIn = animationsEnabled ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 }
  } : {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 }
  };
  
  const slideUp = animationsEnabled ? {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 300, damping: 30 }
  } : {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 }
  };
  
  const staggerChildren = animationsEnabled ? {
    initial: {},
    animate: {},
    transition: { staggerChildren: 0.08, delayChildren: 0.2 }
  } : {
    initial: {},
    animate: {},
    transition: { duration: 0 }
  };
  
  const childVariants = animationsEnabled ? {
    initial: { y: 15, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 200, damping: 20 }
  } : {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    transition: { duration: 0 }
  };
  
  return (
    <AnimationContext.Provider value={{
      pageTransition,
      fadeIn,
      slideUp,
      staggerChildren,
      childVariants,
      animationsEnabled,
      toggleAnimations
    }}>
      {children}
    </AnimationContext.Provider>
  );
}

// Hook personalizzato per utilizzare il contesto di animazione
export function useAnimation() {
  return useContext(AnimationContext);
}

// Componente che gestisce le transizioni tra pagine
export function PageTransition({ children }: { children: ReactNode }) {
  const { pageTransition } = useAnimation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={window.location.pathname}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
        className="page-transition-container"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Componente per creare un gruppo di elementi con effetto stagger
export function StaggerGroup({ children, className = "" }: { children: ReactNode, className?: string }) {
  const { staggerChildren } = useAnimation();
  
  return (
    <motion.div
      className={className}
      initial={staggerChildren.initial}
      animate={staggerChildren.animate}
      transition={staggerChildren.transition}
    >
      {children}
    </motion.div>
  );
}

// Componente per gli elementi figli in un gruppo stagger
export function StaggerItem({ children, className = "", delay = 0 }: { 
  children: ReactNode, 
  className?: string,
  delay?: number 
}) {
  const { childVariants } = useAnimation();
  
  return (
    <motion.div
      className={className}
      initial={childVariants.initial}
      animate={childVariants.animate}
      transition={{
        ...childVariants.transition,
        delay: delay
      }}
    >
      {children}
    </motion.div>
  );
}