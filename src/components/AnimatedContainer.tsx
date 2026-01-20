import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { useRandomAnimation } from '../hooks/useRandomAnimation';

interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  delay = 0,
  className = '',
  ...props
}) => {
  const animation = useRandomAnimation(delay);

  return (
    <motion.div
      initial={{
        y: -120, // Start above screen (off-screen)
      }}
      animate={{
        y: 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 400, // High stiffness for snappy feel
        damping: 25, // Moderate damping for overshoot
        delay: animation.delay,
        bounce: 0.4, // Overshoot effect
      }}
      className={className}
      {...(props as MotionProps)}
    >
      {children}
    </motion.div>
  );
};