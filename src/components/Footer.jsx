import React from "react";
import { Box, Grid, Typography, Container, IconButton, Divider } from "@mui/material";
import { motion } from "framer-motion";
import { Heart, Sparkles, TrendingUp } from "lucide-react";

const FloatingParticle = ({ delay = 0, x = 0 }) => (
  <motion.div
    style={{
      position: 'absolute',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.3)',
      left: `${x}%`,
      bottom: 0,
    }}
    animate={{
      y: [0, -100, -200],
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

const WaveAnimation = () => (
  <Box
    sx={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      overflow: 'hidden',
      lineHeight: 0,
      transform: 'rotate(180deg)',
    }}
  >
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{
        position: 'relative',
        display: 'block',
        width: 'calc(100% + 1.3px)',
        height: 60,
      }}
    >
      <motion.path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        fill="rgba(255,255,255,0.05)"
        animate={{
          d: [
            "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
            "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
            "M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z",
            "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        opacity="0.5"
        fill="rgba(255,255,255,0.03)"
        animate={{
          d: [
            "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
            "M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z",
            "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
            "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </svg>
  </Box>
);

export default function EnhancedFooter() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: "#0d47a1",
        color: "white",
        mt: 8,
        pt: 8,
        pb: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <WaveAnimation />
      
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.3} x={i * 5} />
      ))}

      {/* Gradient Orbs */}
      <motion.div
        style={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: -150,
          right: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Grid container spacing={6}>
            {/* Company Info Section */}
            <Grid item xs={12} md={5}>
              <motion.div variants={itemVariants}>
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Box
                        sx={{
                          width: 52,
                          height: 52,
                          borderRadius: 2.5,
                          background: "rgba(255, 255, 255, 0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(10px)",
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <Typography 
                          sx={{ 
                            fontWeight: 900,
                            fontSize: "1.4rem",
                            color: "#fff",
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                          }}
                        >
                          IZ
                        </Typography>
                      </Box>
                    </motion.div>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 800,
                        letterSpacing: 0.5,
                      }}
                    >
                      IZIEL HEALTHCARE
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      opacity: 0.9,
                      lineHeight: 1.8,
                      mb: 3,
                    }}
                  >
                 
                  </Typography>
                  
                  {/* Animated Stats */}
                  <Grid container spacing={2}>
                    {[
                     
                    ].map((stat, index) => (
                      <Grid item xs={4} key={index}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 2,
                              borderRadius: 3,
                              background: 'rgba(255,255,255,0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.2)',
                            }}
                          >
                            <stat.icon size={24} color="#fff" style={{ marginBottom: 8 }} />
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                              {stat.value}
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                              {stat.label}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </motion.div>
            </Grid>

            {/* Quick Links - Hidden but spacing maintained */}
            <Grid item xs={12} md={3}>
              <motion.div variants={itemVariants}>
                <Box sx={{ visibility: 'hidden' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Quick Links
                  </Typography>
                </Box>
              </motion.div>
            </Grid>

            {/* Contact - Hidden but spacing maintained */}
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Box sx={{ visibility: 'hidden' }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Get in Touch
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>

          <Divider 
            sx={{ 
              my: 4, 
              borderColor: "rgba(255,255,255,0.15)",
              borderWidth: 1,
            }} 
          />

          {/* Bottom Section */}
          <motion.div variants={itemVariants}>
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                pb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  © {new Date().getFullYear()} Iziel Healthcare.
                </Typography>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    All Rights Reserved.
                  </Typography>
                </motion.div>
              </Box>

              {/* Social Icons (placeholder for future use) */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[1, 2, 3].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ 
                      scale: 1.2,
                      rotate: 360,
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <IconButton
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        width: 36,
                        height: 36,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.2)',
                          boxShadow: '0 4px 16px rgba(255,255,255,0.2)',
                        },
                      }}
                    >
                      <Sparkles size={16} />
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </Container>

      {/* Scroll to Top Indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.6)',
            boxShadow: '0 0 20px rgba(255,255,255,0.8)',
          }}
        />
      </motion.div>
    </Box>
  );
}