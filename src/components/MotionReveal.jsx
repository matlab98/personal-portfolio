import { motion, useReducedMotion } from 'framer-motion';

import { motion as motionTokens } from '@/config/tokens';

/**
 * Aparición al entrar en viewport, con el mismo timing en todo el sitio.
 * Si el sistema pide menos movimiento, renderiza sin animación.
 */
const MotionReveal = ({ children, delay = 0, y = 24, style }) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div style={style}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: motionTokens.duration.base, delay, ease: motionTokens.ease }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default MotionReveal;
