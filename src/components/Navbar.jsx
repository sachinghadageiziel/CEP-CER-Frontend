import React, { useState, useEffect } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  Fade,
} from "@mui/material";
import {
  Menu as MenuIcon,
  X,
  Home,
  Info,
  Mail,
  LogOut,
  UserCircle,
  ChevronDown,
  Sparkles,
  Shield,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMsal } from '@azure/msal-react';
import { motion, AnimatePresence } from "framer-motion";
import MicrosoftLoginModal from "./Microsoftloginmodal.jsx";

const MicrosoftLogo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <rect width="10" height="10" fill="#F25022"/>
    <rect x="11" width="10" height="10" fill="#7FBA00"/>
    <rect y="11" width="10" height="10" fill="#00A4EF"/>
    <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
  </svg>
);

const PremiumMicrosoftButton = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <Button
        onClick={onClick}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#fff',
          color: '#1a1a1a',
          fontWeight: 700,
          borderRadius: 3.5,
          px: 4.5,
          py: 1.5,
          textTransform: 'none',
          fontSize: '0.95rem',
          boxShadow: '0 6px 24px rgba(255, 255, 255, 0.35), inset 0 1px 0 rgba(255,255,255,0.9)',
          border: '2.5px solid rgba(255, 255, 255, 0.95)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            bgcolor: '#ffffff',
            boxShadow: '0 10px 40px rgba(255, 255, 255, 0.5), 0 0 0 3px rgba(37, 99, 235, 0.15)',
            border: '2.5px solid #fff',
            transform: 'translateY(-1px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.08), transparent)',
            transition: 'left 0.5s ease',
          },
          '&:hover::before': {
            left: '100%',
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          position: 'relative',
          zIndex: 1,
        }}>
          <motion.div
            animate={{
              rotate: hovered ? 360 : 0,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <MicrosoftLogo size={22} />
          </motion.div>
          
          <Typography sx={{ 
            fontWeight: 700, 
            fontSize: '0.95rem',
            lineHeight: 1,
            color: '#1a1a1a',
          }}>
            Sign in with Microsoft
          </Typography>

          <motion.div
            animate={{
              x: hovered ? 5 : 0,
              opacity: hovered ? 1 : 0.7,
            }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles size={16} color="#2563eb" />
          </motion.div>
        </Box>

        {/* Subtle shimmer effect */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { instance, accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;
  const account = accounts[0];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "About", path: "/about", icon: Info },
    { label: "Contact", path: "/contact", icon: Mail },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavClick = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLoginModalOpen = () => {
    setLoginModalOpen(true);
    setMobileOpen(false);
  };

  const handleLoginModalClose = () => {
    setLoginModalOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    instance.logoutPopup({
      postLogoutRedirectUri: '/',
      mainWindowRedirectUri: '/'
    });
    handleProfileMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleProfileMenuClose();
  };

  const getUserInitials = () => {
    if (!account?.name) return 'U';
    const names = account.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return account.name.charAt(0).toUpperCase();
  };

  const drawer = (
    <Box sx={{ width: 280, pt: 2, height: "100%" }}>
      <Box sx={{ px: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1rem",
              color: "#fff",
            }}
          >
            IZ
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800,
              background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            IZIEL HEALTHCARE
          </Typography>
        </Box>
      </Box>

      {isAuthenticated && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box sx={{ px: 3, mb: 2, pb: 2, borderBottom: "2px solid #e9ecef" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
              <Avatar 
                sx={{ 
                  background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                  width: 52,
                  height: 52,
                  fontWeight: 700,
                  fontSize: "1.3rem",
                  boxShadow: "0 4px 12px rgba(13, 110, 253, 0.3)",
                }}
              >
                {getUserInitials()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#212529", mb: 0.5 }}>
                  {account?.name || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6c757d", display: "block" }}>
                  {account?.username}
                </Typography>
                <Chip 
                  label="Microsoft Account" 
                  size="small"
                  icon={<MicrosoftLogo size={12} />}
                  sx={{ 
                    mt: 0.5,
                    height: 20,
                    fontSize: "0.7rem",
                    bgcolor: "#e7f1ff",
                    color: "#0d6efd",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}

      <List>
        {navItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleNavClick(item.path)}
                sx={{
                  mx: 2,
                  borderRadius: 2.5,
                  mb: 0.5,
                  bgcolor: location.pathname === item.path ? "#e7f1ff" : "transparent",
                  borderLeft: location.pathname === item.path ? "4px solid #0d6efd" : "4px solid transparent",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: location.pathname === item.path ? "#e7f1ff" : "#f8f9fa",
                    transform: "translateX(6px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
                  <item.icon 
                    size={22} 
                    color={location.pathname === item.path ? "#0d6efd" : "#6c757d"} 
                    strokeWidth={location.pathname === item.path ? 2.5 : 2}
                  />
                  <ListItemText 
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: location.pathname === item.path ? 700 : 600,
                      color: location.pathname === item.path ? "#0d6efd" : "#495057",
                      fontSize: "0.95rem",
                    }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
        
        {isAuthenticated ? (
          <>
            <ListItem disablePadding sx={{ mt: 3 }}>
              <ListItemButton 
                onClick={handleProfile}
                sx={{
                  mx: 2,
                  borderRadius: 2.5,
                  border: "2px solid #0d6efd",
                  color: "#0d6efd",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: "#e7f1ff",
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 16px rgba(13, 110, 253, 0.2)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center", width: "100%" }}>
                  <UserCircle size={20} strokeWidth={2.5} />
                  <ListItemText 
                    primary="My Profile"
                    primaryTypographyProps={{
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleLogout}
                sx={{
                  mx: 2,
                  mt: 1.5,
                  borderRadius: 2.5,
                  background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #c82333 0%, #bd2130 100%)",
                    boxShadow: "0 6px 16px rgba(220, 53, 69, 0.4)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center", width: "100%" }}>
                  <LogOut size={20} strokeWidth={2.5} />
                  <ListItemText 
                    primary="Sign Out"
                    primaryTypographyProps={{
                      fontWeight: 700,
                      textAlign: "center",
                    }}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding sx={{ mt: 3 }}>
            <ListItemButton 
              onClick={handleLoginModalOpen}
              sx={{
                mx: 2,
                borderRadius: 2.5,
                background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
                  boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                  transform: "translateY(-3px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center", width: "100%" }}>
                <MicrosoftLogo size={20} />
                <ListItemText 
                  primary="Sign in with Microsoft"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    textAlign: "center",
                    fontSize: "0.95rem",
                  }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={scrolled ? 3 : 0}
        sx={{ 
          background: scrolled 
            ? "linear-gradient(180deg, rgba(13, 110, 253, 0.97) 0%, rgba(25, 118, 253, 0.97) 100%)"
            : "linear-gradient(180deg, #0d6efd 0%, #1976fd 100%)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(10px)",
          boxShadow: scrolled 
            ? "0 6px 24px rgba(13, 110, 253, 0.25)"
            : "0 4px 20px rgba(13, 110, 253, 0.2)",
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 4 },
            py: scrolled ? 1.3 : 1.8,
            transition: 'padding 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Box 
              sx={{ 
                display: "flex", 
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2.5,
                  background: "rgba(255, 255, 255, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1.5,
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                <Typography 
                  sx={{ 
                    fontWeight: 900,
                    fontSize: "1.3rem",
                    color: "#fff",
                    textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  IZ
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ 
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: 0.5,
                  display: { xs: "none", sm: "block" },
                  textShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                IZIEL HEALTHCARE
              </Typography>
            </Box>
          </motion.div>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Button
                    onClick={() => navigate(item.path)}
                    startIcon={<item.icon size={18} strokeWidth={2.5} />}
                    sx={{
                      color: location.pathname === item.path ? "#fff" : "rgba(255, 255, 255, 0.9)",
                      fontWeight: location.pathname === item.path ? 700 : 600,
                      px: 3,
                      py: 1.3,
                      borderRadius: 2.5,
                      textTransform: "none",
                      bgcolor: location.pathname === item.path ? "rgba(255, 255, 255, 0.25)" : "transparent",
                      border: "1px solid",
                      borderColor: location.pathname === item.path ? "rgba(255, 255, 255, 0.4)" : "transparent",
                      backdropFilter: location.pathname === item.path ? "blur(10px)" : "none",
                      boxShadow: location.pathname === item.path ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.2)",
                        color: "#fff",
                        borderColor: "rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isMobile && (
              <>
                {isAuthenticated ? (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={handleProfileMenuOpen}
                      endIcon={
                        <motion.div
                          animate={{ rotate: Boolean(anchorEl) ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown size={16} />
                        </motion.div>
                      }
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.25)",
                        border: "2px solid rgba(255, 255, 255, 0.4)",
                        color: "#fff",
                        px: 2.5,
                        py: 1,
                        borderRadius: 3,
                        backdropFilter: "blur(10px)",
                        textTransform: "none",
                        fontWeight: 700,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.35)",
                          boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <Avatar 
                        sx={{ 
                          bgcolor: "#fff",
                          color: "#0d6efd",
                          width: 32,
                          height: 32,
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          mr: 1.5,
                        }}
                      >
                        {getUserInitials()}
                      </Avatar>
                      <Box sx={{ textAlign: "left" }}>
                        <Typography sx={{ fontSize: "0.9rem", lineHeight: 1.2 }}>
                          {account?.name?.split(' ')[0] || 'User'}
                        </Typography>
                      </Box>
                    </Button>

                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleProfileMenuClose}
                      TransitionComponent={Fade}
                      PaperProps={{
                        sx: {
                          mt: 1.5,
                          minWidth: 260,
                          borderRadius: 3,
                          boxShadow: "0 12px 48px rgba(0,0,0,0.2)",
                          overflow: "visible",
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 20,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                    >
                      <Box sx={{ px: 2.5, py: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                          <Avatar 
                            sx={{ 
                              background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                              width: 48,
                              height: 48,
                              fontWeight: 700,
                              fontSize: "1.2rem",
                            }}
                          >
                            {getUserInitials()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#212529" }}>
                              {account?.name || 'User'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#6c757d", display: "block" }}>
                              {account?.username}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label="Microsoft Account" 
                          size="small"
                          icon={<MicrosoftLogo size={14} />}
                          sx={{ 
                            mt: 1,
                            bgcolor: "#e7f1ff",
                            color: "#0d6efd",
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      
                      <Divider />
                      
                      <MenuItem 
                        onClick={handleProfile} 
                        sx={{ 
                          gap: 2,
                          py: 1.5,
                          mx: 1,
                          my: 0.5,
                          borderRadius: 2,
                          transition: 'all 0.2s ease',
                          "&:hover": {
                            bgcolor: "#f8f9fa",
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <UserCircle size={20} color="#0d6efd" strokeWidth={2} />
                        <Typography sx={{ fontWeight: 600 }}>View Profile</Typography>
                      </MenuItem>
                      
                      <Divider />
                      
                      <MenuItem 
                        onClick={handleLogout} 
                        sx={{ 
                          gap: 2,
                          py: 1.5,
                          mx: 1,
                          my: 0.5,
                          borderRadius: 2,
                          color: "#dc3545",
                          transition: 'all 0.2s ease',
                          "&:hover": {
                            bgcolor: "rgba(220, 53, 69, 0.1)",
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <LogOut size={20} strokeWidth={2} />
                        <Typography sx={{ fontWeight: 600 }}>Sign Out</Typography>
                      </MenuItem>
                    </Menu>
                  </motion.div>
                ) : (
                  <PremiumMicrosoftButton onClick={handleLoginModalOpen} />
                )}
              </>
            )}

            {isMobile && (
              <motion.div 
                animate={{ rotate: mobileOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    border: "2px solid rgba(255, 255, 255, 0.3)",
                    transition: 'all 0.3s ease',
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </IconButton>
              </motion.div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            background: "#fff",
            boxShadow: "-4px 0 24px rgba(0,0,0,0.1)",
          }
        }}
      >
        {drawer}
      </Drawer>

      <MicrosoftLoginModal 
        open={loginModalOpen} 
        onClose={handleLoginModalClose} 
      />
    </>
  );
}