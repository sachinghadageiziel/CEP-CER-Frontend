import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Home, Info, Mail } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const handleLogout = () => {
    console.log("Logout clicked");
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ px: 2, mb: 3 }}>
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
      <List>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton 
              onClick={() => handleNavClick(item.path)}
              sx={{
                mx: 1,
                borderRadius: 2,
                mb: 0.5,
                bgcolor: location.pathname === item.path ? "#e7f1ff" : "transparent",
                borderLeft: location.pathname === item.path ? "3px solid #0d6efd" : "3px solid transparent",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  bgcolor: "#f8f9fa",
                  transform: "translateX(4px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <item.icon size={20} color={location.pathname === item.path ? "#0d6efd" : "#6c757d"} />
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    color: location.pathname === item.path ? "#0d6efd" : "#495057",
                  }}
                />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              mx: 1,
              mt: 2,
              borderRadius: 2,
              background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
              color: "#fff",
              boxShadow: "0 4px 12px rgba(13, 110, 253, 0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                background: "linear-gradient(135deg, #0654c4 0%, #0545a8 100%)",
                boxShadow: "0 6px 16px rgba(13, 110, 253, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, justifyContent: "center", width: "100%" }}>
              <LogOut size={20} />
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 700,
                  textAlign: "center",
                }}
              />
            </Box>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: "linear-gradient(180deg, #0d6efd 0%, #1976fd 100%)",
          backdropFilter: "blur(20px)",
          boxShadow: "none",
      
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 4 },
            py: 1.5,
          }}
        >
          {/* Logo */}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "scale(1.05)",
              },
              "&:active": {
                transform: "scale(0.98)",
              }
            }}
            onClick={() => navigate("/")}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2.5,
                background: "rgba(255, 255, 255, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 1.5,
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255,255,255,0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <Typography 
                sx={{ 
                  fontWeight: 900,
                  fontSize: "1.25rem",
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

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  startIcon={<item.icon size={18} strokeWidth={2.5} />}
                  sx={{
                    color: location.pathname === item.path ? "#fff" : "rgba(255, 255, 255, 0.9)",
                    fontWeight: location.pathname === item.path ? 700 : 600,
                    px: 3,
                    py: 1.2,
                    borderRadius: 2.5,
                    textTransform: "none",
                    bgcolor: location.pathname === item.path ? "rgba(255, 255, 255, 0.25)" : "transparent",
                    border: "1px solid",
                    borderColor: location.pathname === item.path ? "rgba(255, 255, 255, 0.4)" : "transparent",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    backdropFilter: location.pathname === item.path ? "blur(10px)" : "none",
                    boxShadow: location.pathname === item.path ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.2)",
                      color: "#fff",
                      transform: "translateY(-2px)",
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isMobile && (
              <Button
                startIcon={<LogOut size={18} strokeWidth={2.5} />}
                onClick={handleLogout}
                sx={{
                  bgcolor: "#fff",
                  color: "#0d6efd",
                  fontWeight: 700,
                  borderRadius: 2.5,
                  px: 3.5,
                  py: 1.2,
                  textTransform: "none",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
                  border: "2px solid #fff",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: "#f8f9fa",
                    color: "#0654c4",
                    transform: "translateY(-3px)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  }
                }}
              >
                Logout
              </Button>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                    transform: "rotate(90deg)",
                  }
                }}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
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
    </>
  );
}