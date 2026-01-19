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

const PremiumMicrosoftButton = ({ onClick, isMobile = false }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ width: isMobile ? '100%' : 'auto' }}
    >
      <Button
        onClick={onClick}
        fullWidth={isMobile}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)',
          color: '#fff',
          fontWeight: 700,
          borderRadius: { xs: 2, sm: 2.5, md: 3 },
          px: { xs: 2.5, sm: 3.5, md: 4.5 },
          py: { xs: 1, sm: 1.2, md: 1.5 },
          textTransform: 'none',
          fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.95rem' },
          boxShadow: '0 6px 24px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.3)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 100%)',
            boxShadow: '0 10px 40px rgba(255, 255, 255, 0.3), 0 0 0 3px rgba(255, 255, 255, 0.15)',
            border: '2px solid rgba(255, 255, 255, 0.6)',
            transform: 'translateY(-2px)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
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
          gap: { xs: 1, sm: 1.5, md: 2 },
          position: 'relative',
          zIndex: 1,
          justifyContent: isMobile ? 'center' : 'flex-start',
        }}>
          <motion.div
            animate={{
              rotate: hovered ? 360 : 0,
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <MicrosoftLogo size={isMobile ? 18 : 22} />
          </motion.div>
          
          <Typography sx={{ 
            fontWeight: 700, 
            fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.95rem' },
            lineHeight: 1,
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}>
            Sign in with Microsoft
          </Typography>

          <motion.div
            animate={{
              x: hovered ? 3 : 0,
              opacity: hovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles size={isMobile ? 14 : 16} color="#fff" />
          </motion.div>
        </Box>

        {/* Shimmer effect */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
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
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    <Box sx={{ 
      width: { xs: '85vw', sm: 320, md: 360 },
      maxWidth: 400,
      pt: 2, 
      height: "100%",
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Box sx={{ px: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
          <Box
            sx={{
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: { xs: 1.5, sm: 2 },
              background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              color: "#fff",
              boxShadow: '0 4px 12px rgba(13, 110, 253, 0.3)',
            }}
          >
            IZ
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
              background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.2,
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
          <Box sx={{ px: { xs: 2, sm: 3 }, mb: 2, pb: 2, borderBottom: "2px solid #e9ecef" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, mb: 1.5 }}>
              <Avatar 
                sx={{ 
                  background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                  width: { xs: 44, sm: 52 },
                  height: { xs: 44, sm: 52 },
                  fontWeight: 700,
                  fontSize: { xs: "1.1rem", sm: "1.3rem" },
                  boxShadow: "0 4px 12px rgba(13, 110, 253, 0.3)",
                }}
              >
                {getUserInitials()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    fontWeight: 700, 
                    color: "#212529", 
                    mb: 0.5,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {account?.name || 'User'}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "#6c757d", 
                    display: "block",
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {account?.username}
                </Typography>
                <Chip 
                  label="Microsoft Account" 
                  size="small"
                  icon={<MicrosoftLogo size={12} />}
                  sx={{ 
                    mt: 0.5,
                    height: { xs: 18, sm: 20 },
                    fontSize: { xs: "0.65rem", sm: "0.7rem" },
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

      <Box sx={{ flex: 1, overflowY: 'auto' }}>
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
                    mx: { xs: 1.5, sm: 2 },
                    borderRadius: { xs: 2, sm: 2.5 },
                    mb: 0.5,
                    bgcolor: location.pathname === item.path ? "#e7f1ff" : "transparent",
                    borderLeft: location.pathname === item.path ? "4px solid #0d6efd" : "4px solid transparent",
                    py: { xs: 1, sm: 1.2 },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      bgcolor: location.pathname === item.path ? "#e7f1ff" : "#f8f9fa",
                      transform: "translateX(6px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, width: "100%" }}>
                    <item.icon 
                      size={isSmallMobile ? 20 : 22} 
                      color={location.pathname === item.path ? "#0d6efd" : "#6c757d"} 
                      strokeWidth={location.pathname === item.path ? 2.5 : 2}
                    />
                    <ListItemText 
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: location.pathname === item.path ? 700 : 600,
                        color: location.pathname === item.path ? "#0d6efd" : "#495057",
                        fontSize: { xs: '0.85rem', sm: '0.95rem' },
                      }}
                    />
                  </Box>
                </ListItemButton>
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Box>

      <Box sx={{ p: { xs: 1.5, sm: 2 }, borderTop: '1px solid #e9ecef' }}>
        {isAuthenticated ? (
          <>
            <ListItemButton 
              onClick={handleProfile}
              sx={{
                borderRadius: { xs: 2, sm: 2.5 },
                border: "2px solid #0d6efd",
                color: "#0d6efd",
                mb: 1.5,
                py: { xs: 1, sm: 1.2 },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: "#e7f1ff",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(13, 110, 253, 0.2)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, justifyContent: "center", width: "100%" }}>
                <UserCircle size={isSmallMobile ? 18 : 20} strokeWidth={2.5} />
                <ListItemText 
                  primary="My Profile"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    textAlign: "center",
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  }}
                />
              </Box>
            </ListItemButton>

            <ListItemButton 
              onClick={handleLogout}
              sx={{
                borderRadius: { xs: 2, sm: 2.5 },
                background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                color: "#fff",
                py: { xs: 1, sm: 1.2 },
                boxShadow: "0 4px 12px rgba(220, 53, 69, 0.3)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  background: "linear-gradient(135deg, #c82333 0%, #bd2130 100%)",
                  boxShadow: "0 6px 16px rgba(220, 53, 69, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, sm: 2 }, justifyContent: "center", width: "100%" }}>
                <LogOut size={isSmallMobile ? 18 : 20} strokeWidth={2.5} />
                <ListItemText 
                  primary="Sign Out"
                  primaryTypographyProps={{
                    fontWeight: 700,
                    textAlign: "center",
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  }}
                />
              </Box>
            </ListItemButton>
          </>
        ) : (
          <PremiumMicrosoftButton onClick={handleLoginModalOpen} isMobile />
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={scrolled ? 4 : 0}
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
            px: { xs: 1.5, sm: 3, md: 4 },
            py: scrolled ? { xs: 0.8, sm: 1, md: 1.3 } : { xs: 1.2, sm: 1.5, md: 1.8 },
            minHeight: { xs: 56, sm: 64, md: 70 },
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
                gap: { xs: 0.8, sm: 1, md: 1.5 },
              }}
              onClick={() => navigate("/")}
            >
              <Box
                sx={{
                  width: { xs: 36, sm: 42, md: 48 },
                  height: { xs: 36, sm: 42, md: 48 },
                  borderRadius: { xs: 1.8, sm: 2, md: 2.5 },
                  background: "rgba(255, 255, 255, 0.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                  border: "2px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
                }}
              >
                <Typography 
                  sx={{ 
                    fontWeight: 900,
                    fontSize: { xs: "1rem", sm: "1.15rem", md: "1.3rem" },
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
                  letterSpacing: { xs: 0.3, sm: 0.4, md: 0.5 },
                  fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
                  display: { xs: isSmallMobile ? "none" : "block", sm: "block" },
                  textShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                {isTablet ? "IZIEL" : "IZIEL HEALTHCARE"}
              </Typography>
            </Box>
          </motion.div>

          {!isMobile && (
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: { sm: 0.8, md: 1.2, lg: 1.5 },
              flex: 1,
              justifyContent: 'center',
              maxWidth: '600px',
            }}>
              {navItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Button
                    onClick={() => navigate(item.path)}
                    startIcon={<item.icon size={16} strokeWidth={2.5} />}
                    sx={{
                      color: location.pathname === item.path ? "#fff" : "rgba(255, 255, 255, 0.9)",
                      fontWeight: location.pathname === item.path ? 700 : 600,
                      px: { sm: 2, md: 2.5, lg: 3 },
                      py: { sm: 0.9, md: 1.1, lg: 1.3 },
                      borderRadius: { sm: 2, md: 2.5 },
                      textTransform: "none",
                      fontSize: { sm: '0.8rem', md: '0.85rem', lg: '0.9rem' },
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

          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5, md: 2 } }}>
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
                          <ChevronDown size={14} />
                        </motion.div>
                      }
                      sx={{
                        bgcolor: "rgba(255, 255, 255, 0.25)",
                        border: "2px solid rgba(255, 255, 255, 0.4)",
                        color: "#fff",
                        px: { sm: 1.8, md: 2.2, lg: 2.5 },
                        py: { sm: 0.7, md: 0.9, lg: 1 },
                        borderRadius: { sm: 2.5, md: 3 },
                        backdropFilter: "blur(10px)",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: { sm: '0.8rem', md: '0.85rem', lg: '0.9rem' },
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
                          width: { sm: 28, md: 30, lg: 32 },
                          height: { sm: 28, md: 30, lg: 32 },
                          fontWeight: 700,
                          fontSize: { sm: '0.75rem', md: '0.8rem', lg: '0.9rem' },
                          mr: { sm: 1, md: 1.2, lg: 1.5 },
                        }}
                      >
                        {getUserInitials()}
                      </Avatar>
                      <Box sx={{ textAlign: "left" }}>
                        <Typography sx={{ 
                          fontSize: { sm: '0.8rem', md: '0.85rem', lg: '0.9rem' }, 
                          lineHeight: 1.2,
                          display: { sm: 'none', lg: 'block' }
                        }}>
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
                          minWidth: { sm: 240, md: 260 },
                          borderRadius: { sm: 2.5, md: 3 },
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
                      <Box sx={{ px: { sm: 2, md: 2.5 }, py: { sm: 1.5, md: 2 } }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: { sm: 1.5, md: 2 }, mb: 1 }}>
                          <Avatar 
                            sx={{ 
                              background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                              width: { sm: 42, md: 48 },
                              height: { sm: 42, md: 48 },
                              fontWeight: 700,
                              fontSize: { sm: '1rem', md: '1.2rem' },
                            }}
                          >
                            {getUserInitials()}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: 700, 
                                color: "#212529",
                                fontSize: { sm: '0.85rem', md: '0.95rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {account?.name || 'User'}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: "#6c757d", 
                                display: "block",
                                fontSize: { sm: '0.7rem', md: '0.75rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {account?.username}
                            </Typography>
                          </Box>
                        </Box>
                        <Chip 
                          label="Microsoft Account" 
                          size="small"
                          icon={<MicrosoftLogo size={14} />}
                          sx={{ 
                            mt: 0.8,
                            bgcolor: "#e7f1ff",
                            color: "#0d6efd",
                            fontWeight: 600,
                            fontSize: { sm: '0.7rem', md: '0.75rem' },
                          }}
                        />
                      </Box>
                      
                      <Divider />
                      
                      <MenuItem 
                        onClick={handleProfile} 
                        sx={{ 
                          gap: { sm: 1.5, md: 2 },
                          py: { sm: 1.2, md: 1.5 },
                          mx: 1,
                          my: 0.5,
                          borderRadius: 2,
                          fontSize: { sm: '0.85rem', md: '0.9rem' },
                          transition: 'all 0.2s ease',
                          "&:hover": {
                            bgcolor: "#f8f9fa",
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <UserCircle size={18} color="#0d6efd" strokeWidth={2} />
                        <Typography sx={{ fontWeight: 600, fontSize: 'inherit' }}>View Profile</Typography>
                      </MenuItem>
                      
                      <Divider />
                      
                      <MenuItem 
                        onClick={handleLogout} 
                        sx={{ 
                          gap: { sm: 1.5, md: 2 },
                          py: { sm: 1.2, md: 1.5 },
                          mx: 1,
                          my: 0.5,
                          borderRadius: 2,
                          color: "#dc3545",
                          fontSize: { sm: '0.85rem', md: '0.9rem' },
                          transition: 'all 0.2s ease',
                          "&:hover": {
                            bgcolor: "rgba(220, 53, 69, 0.1)",
                            transform: 'translateX(4px)',
                          }
                        }}
                      >
                        <LogOut size={18} strokeWidth={2} />
                        <Typography sx={{ fontWeight: 600, fontSize: 'inherit' }}>Sign Out</Typography>
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
                    width: { xs: 40, sm: 44 },
                    height: { xs: 40, sm: 44 },
                    transition: 'all 0.3s ease',
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.3)",
                    },
                  }}
                >
                  {mobileOpen ? <X size={isSmallMobile ? 20 : 24} /> : <MenuIcon size={isSmallMobile ? 20 : 24} />}
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