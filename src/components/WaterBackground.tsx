import { motion, useScroll, useTransform } from 'motion/react';
import { useMemo } from 'react';

export type WaterTheme = 'dawn' | 'day' | 'sunset' | 'night';

export default function WaterBackground({ 
  theme = 'night',
  showBackground = true,
  showParticles = true
}: { 
  theme?: WaterTheme;
  showBackground?: boolean;
  showParticles?: boolean;
}) {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], ['0vh', '-30vh']);

  const themeConfig = useMemo(() => {
    switch (theme) {
      case 'dawn':
        return {
          baseBg: 'bg-[#003355]',
          gradient: 'from-[#ffbbee] via-[#00aadd] to-[#001155]',
          wave: 'text-[#ffbbee]',
          colors: ['#ffbbee', '#ffddff', '#aaddff', '#00ccff', '#ffddee'],
          primary: '#ffbbee'
        };
      case 'day':
        return {
          baseBg: 'bg-[#0055cc]',
          gradient: 'from-[#88eeff] via-[#00aaff] to-[#0033cc]',
          wave: 'text-[#ffffff]',
          colors: ['#ffffff', '#aaddff', '#66ccff', '#bbddff', '#ccffff'],
          primary: '#ffffff'
        };
      case 'sunset':
        return {
          baseBg: 'bg-[#400030]',
          gradient: 'from-[#ffaa55] via-[#990055] to-[#200030]',
          wave: 'text-[#ffaa55]',
          colors: ['#ffaa55', '#ffcc88', '#ff5599', '#ff8866', '#ffaacc'],
          primary: '#ffaa55'
        };
      case 'night':
      default:
        return {
          baseBg: 'bg-[#0015b0]',
          gradient: 'from-[#00ccff] via-[#0044ff] to-[#000540]',
          wave: 'text-[#00ffff]',
          colors: ['#00ffff', '#00ccff', '#0088ff', '#00aaff', '#00ddff'],
          primary: '#00ffff'
        };
    }
  }, [theme]);

  // Generate organic water particles base layout (runs once)
  const baseParticles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 35 + 15,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 10,
      colorIndex: Math.floor(Math.random() * 5), // Assuming 5 colors per theme
      reactsToLight: Math.random() > 0.6,
      xOffset: Math.random() * 80 - 40,
    }));
  }, []);

  const particles = useMemo(() => {
    return baseParticles.map(p => {
      const color = themeConfig.colors[p.colorIndex % themeConfig.colors.length];
      return {
        ...p,
        color,
        isCyan: color === themeConfig.primary,
      };
    });
  }, [baseParticles, themeConfig]);

  // Generate smaller ambient bubbles for depth base layout
  const baseAmbientBubbles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 10 + 4,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.3 + 0.05,
      colorIndex: Math.floor(Math.random() * 5),
      isFilled: Math.random() > 0.5,
      reactsToLight: Math.random() > 0.5,
      xOffset: Math.random() * 40 - 20,
    }));
  }, []);

  const ambientBubbles = useMemo(() => {
    return baseAmbientBubbles.map(b => {
      const color = themeConfig.colors[b.colorIndex % themeConfig.colors.length];
      return {
        ...b,
        color,
        isCyan: color === themeConfig.primary,
      };
    });
  }, [baseAmbientBubbles, themeConfig]);

  // Generate stylized light rays from the side, evenly distributed to avoid clumping
  const rays = useMemo(() => {
    const numRays = 7;
    return Array.from({ length: numRays }).map((_, i) => ({
      id: i,
      width: `${Math.random() * 8 + 4}%`,
      // Even distribution across the width to prevent overlaps, with slight randomness
      right: `${-10 + i * (120 / numRays) + Math.random() * 6}%`,
      baseAngle: -(Math.random() * 15 + 25), // Angle diagonally to the left
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 7,
      opacity: Math.random() * 0.08 + 0.02,
    }));
  }, []);

  // Define paths for organic wave morphing
  const wavePaths1 = [
    "M0 60 C 150 110, 350 110, 500 60 C 650 10, 850 10, 1000 60 L 1000 0 L 0 0 Z",
    "M0 60 C 150 60, 350 10, 500 60 C 650 110, 850 60, 1000 60 L 1000 0 L 0 0 Z",
    "M0 60 C 150 10, 350 10, 500 60 C 650 110, 850 110, 1000 60 L 1000 0 L 0 0 Z",
    "M0 60 C 150 60, 350 110, 500 60 C 650 10, 850 60, 1000 60 L 1000 0 L 0 0 Z",
    "M0 60 C 150 110, 350 110, 500 60 C 650 10, 850 10, 1000 60 L 1000 0 L 0 0 Z",
  ];

  const wavePaths2 = [
    "M0 70 C 200 10, 300 120, 500 70 C 700 20, 800 120, 1000 70 L 1000 0 L 0 0 Z",
    "M0 70 C 200 120, 300 20, 500 70 C 700 120, 800 10, 1000 70 L 1000 0 L 0 0 Z",
    "M0 70 C 200 10, 300 120, 500 70 C 700 20, 800 120, 1000 70 L 1000 0 L 0 0 Z",
  ];

  return (
    <div className={`fixed inset-0 overflow-hidden ${themeConfig.baseBg} z-[-1] transition-colors duration-1000`}>
      <motion.div style={{ y: yParallax }} className="absolute w-full h-[150vh]">
        {/* Base Gradient */}
        {showBackground && (
          <div className={`absolute inset-0 bg-gradient-to-b ${themeConfig.gradient} opacity-90 transition-all duration-1000`} />
        )}

        {/* Lateral Light Rays (Top Right) */}
        {showBackground && (
          <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none mix-blend-overlay">
            {rays.map((ray) => (
              <motion.div
                key={`ray-${ray.id}`}
                className="absolute top-0 bg-gradient-to-b from-white to-transparent"
                style={{
                  height: '150vh',
                  width: ray.width,
                  right: ray.right,
                  transformOrigin: 'top right',
                }}
                animate={{
                  rotate: [ray.baseAngle - 2, ray.baseAngle + 2, ray.baseAngle - 2],
                  opacity: [ray.opacity, ray.opacity * 1.5, ray.opacity],
                }}
                transition={{
                  duration: ray.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: ray.delay,
                }}
              />
            ))}
          </div>
        )}

      {/* Background Morphing Wave (No gooey) */}
      {showBackground && (
        <div className="absolute top-0 left-0 w-full h-64 opacity-30">
          <motion.svg
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            className="absolute top-0 w-full h-full text-white fill-current"
          >
            <motion.path
              animate={{ d: wavePaths2 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            />
          </motion.svg>
        </div>
      )}

      {/* Foreground Layer: Wave + Particles */}
      <div className="absolute inset-0 opacity-60">
        {/* Foreground Morphing Wave */}
        {showBackground && (
          <div className="absolute top-0 left-0 w-full h-64">
            <motion.svg
              viewBox="0 0 1000 200"
              preserveAspectRatio="none"
              className={`absolute top-0 w-full h-full ${themeConfig.wave} fill-current transition-colors duration-1000`}
            >
              <motion.path
                animate={{ d: wavePaths1 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }}
              />
            </motion.svg>
          </div>
        )}

        {/* Morphing Water Particles */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((particle) => (
              <motion.div
                key={`particle-${particle.id}`}
                className="absolute top-[110vh]"
              style={{
                width: particle.size,
                height: particle.size,
                left: particle.left,
                ...(particle.reactsToLight ? { mixBlendMode: 'color-dodge' } : {})
              }}
              animate={{
                y: ['0vh', '-140vh'],
                x: ['0px', `${particle.xOffset}px`, '0px'],
                scaleY: [1, 1.2, 1.8],
                scale: particle.isCyan ? [1, 1, 1.5, 3] : [1, 1, 1.5, 2.5],
                opacity: particle.isCyan ? [1, 1, 0.5, 0] : [1, 1, 0, 0],
                backgroundColor: particle.isCyan ? particle.color : [particle.color, particle.color, themeConfig.primary, themeConfig.primary],
                borderRadius: [
                  '40% 60% 70% 30% / 40% 50% 60% 50%',
                  '60% 40% 30% 70% / 60% 30% 70% 40%',
                  '50% 50% 70% 30% / 30% 60% 40% 70%',
                  '40% 60% 70% 30% / 40% 50% 60% 50%',
                ],
              }}
              transition={{
                y: {
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: particle.delay,
                },
                x: {
                  duration: particle.duration * 0.7,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: particle.delay,
                },
                scaleY: {
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: 'easeIn',
                  delay: particle.delay,
                },
                scale: {
                  duration: particle.duration,
                  repeat: Infinity,
                  times: [0, 0.75, 0.9, 1],
                  delay: particle.delay,
                },
                opacity: {
                  duration: particle.duration,
                  repeat: Infinity,
                  times: [0, 0.75, 0.9, 1],
                  delay: particle.delay,
                },
                backgroundColor: {
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: 'easeIn',
                  times: [0, 0.75, 0.85, 1],
                  delay: particle.delay,
                },
                borderRadius: {
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            />
          ))}
        </div>
        )}
      </div>

      {/* Floating Ambient Bubbles */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {ambientBubbles.map((bubble) => (
            <motion.div
              key={`ambient-${bubble.id}`}
              className="absolute top-[110vh] rounded-full"
              style={{
                width: bubble.size,
                height: bubble.size,
                left: bubble.left,
                backgroundColor: bubble.isFilled ? undefined : 'transparent',
                border: bubble.isFilled ? 'none' : `1px solid ${bubble.color}`,
                ...(bubble.reactsToLight ? { mixBlendMode: 'color-dodge' } : {})
              }}
              animate={{
                y: ['0vh', '-140vh'],
                x: ['0px', `${bubble.xOffset}px`, '0px'],
                opacity: bubble.isCyan ? [bubble.opacity, bubble.opacity, bubble.opacity * 0.4, 0] : [bubble.opacity, bubble.opacity, 0, 0],
                scale: bubble.isCyan ? [1, 1, 1.5, 2.5] : [1, 1, 1.5, 2],
                ...(bubble.isFilled
                  ? {
                      backgroundColor: bubble.isCyan
                        ? bubble.color
                        : [bubble.color, bubble.color, themeConfig.primary, themeConfig.primary],
                    }
                  : {
                      borderColor: bubble.isCyan
                        ? bubble.color
                        : [bubble.color, bubble.color, themeConfig.primary, themeConfig.primary],
                    }),
              }}
              transition={{
                y: {
                  duration: bubble.duration,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: bubble.delay,
                },
                x: {
                  duration: bubble.duration / 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: bubble.delay,
                },
                opacity: {
                  duration: bubble.duration,
                  repeat: Infinity,
                  times: [0, 0.8, 0.95, 1],
                  delay: bubble.delay,
                },
                scale: {
                  duration: bubble.duration,
                  repeat: Infinity,
                  times: [0, 0.8, 0.95, 1],
                  delay: bubble.delay,
                },
                backgroundColor: {
                  duration: bubble.duration,
                  repeat: Infinity,
                  ease: 'easeIn',
                  times: [0, 0.5, 0.7, 1],
                  delay: bubble.delay,
                },
                borderColor: {
                  duration: bubble.duration,
                  repeat: Infinity,
                  ease: 'easeIn',
                  times: [0, 0.5, 0.7, 1],
                  delay: bubble.delay,
                },
              }}
            />
          ))}
        </div>
      )}
      </motion.div>
    </div>
  );
}
