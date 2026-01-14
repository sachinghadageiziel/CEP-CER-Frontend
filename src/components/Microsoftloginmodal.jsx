import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  Fade,
  CircularProgress,
  Divider,
} from "@mui/material";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig"; // MAKE SURE THIS PATH IS CORRECT

// Microsoft Logo SVG Component
const MicrosoftLogo = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="10" height="10" fill="#F25022"/>
    <rect x="11" width="10" height="10" fill="#7FBA00"/>
    <rect y="11" width="10" height="10" fill="#00A4EF"/>
    <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
  </svg>
);

export default function MicrosoftLoginModal({ open, onClose }) {
  const { instance } = useMsal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Login with Microsoft popup
      const response = await instance.loginPopup(loginRequest);
      console.log("✅ Login successful:", response);
      
      // Step 2: Get access token
      const tokenResponse = await instance.acquireTokenSilent({
        ...loginRequest,
        account: response.account,
      });

      console.log("🔑 Access Token acquired");

      // Step 3: Send token to backend
      const backendResponse = await fetch("http://localhost:5000/api/auth/microsoft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenResponse.accessToken}`,
        },
        body: JSON.stringify({
          accessToken: tokenResponse.accessToken,
          account: {
            name: response.account.name,
            username: response.account.username,
            localAccountId: response.account.localAccountId,
          },
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json();
        throw new Error(errorData.detail || "Failed to authenticate with backend");
      }

      const userData = await backendResponse.json();
      console.log("✅ User authenticated with backend:", userData);

      // Step 4: Close modal and refresh
      onClose();
      
      // Optional: Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData.user));
      
      // Reload to update UI
      window.location.reload();

    } catch (error) {
      console.error("❌ Login error:", error);
      
      // Handle specific error types
      if (error.errorCode === "user_cancelled") {
        setError("Login cancelled. Please try again.");
      } else if (error.errorCode === "popup_window_error") {
        setError("Popup blocked. Please allow popups for this site.");
      } else {
        setError(error.message || "Failed to sign in with Microsoft. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? null : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
          overflow: "visible",
        },
      }}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <Box
              sx={{
                bgcolor: "#1a1a1a",
                color: "#fff",
                p: 2.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "0.9rem",
                  }}
                >
                  IZ
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  Sign in to IZIEL HEALTHCARE
                </Typography>
              </Box>
              <IconButton
                onClick={onClose}
                disabled={loading}
                sx={{
                  color: "#fff",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            {/* Content */}
            <DialogContent sx={{ p: 4 }}>
              <Fade in timeout={400}>
                <Box>
                  {/* User Icon */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 24px",
                      boxShadow: "0 8px 24px rgba(13, 110, 253, 0.3)",
                    }}
                  >
                    <Typography sx={{ fontSize: "2rem", color: "#fff", fontWeight: 700 }}>
                      U
                    </Typography>
                  </Box>

                  {/* Welcome Text */}
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: "center",
                      fontWeight: 700,
                      color: "#1a1a1a",
                      mb: 1,
                    }}
                  >
                    Welcome Back
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#666",
                      mb: 4,
                    }}
                  >
                    Sign in with your Microsoft account to continue
                  </Typography>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Box
                        sx={{
                          mb: 3,
                          p: 2,
                          bgcolor: "rgba(220, 53, 69, 0.1)",
                          borderRadius: 2,
                          border: "1px solid rgba(220, 53, 69, 0.3)",
                        }}
                      >
                        <Typography variant="body2" sx={{ color: "#dc3545", fontSize: "0.875rem" }}>
                          {error}
                        </Typography>
                      </Box>
                    </motion.div>
                  )}

                  {/* Microsoft Sign In Button */}
                  <motion.div
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                  >
                    <Button
                      fullWidth
                      onClick={handleMicrosoftLogin}
                      disabled={loading}
                      sx={{
                        bgcolor: "#2563eb",
                        color: "#fff",
                        py: 1.8,
                        borderRadius: 2.5,
                        textTransform: "none",
                        fontSize: "1rem",
                        fontWeight: 700,
                        boxShadow: "0 4px 16px rgba(37, 99, 235, 0.3)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "#1d4ed8",
                          boxShadow: "0 8px 24px rgba(37, 99, 235, 0.4)",
                        },
                        "&:disabled": {
                          bgcolor: "#94a3b8",
                          color: "#cbd5e1",
                        },
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <CircularProgress size={20} sx={{ color: "#fff" }} />
                          <span>Signing in...</span>
                        </Box>
                      ) : (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <MicrosoftLogo />
                          <span>Continue with Microsoft</span>
                        </Box>
                      )}
                    </Button>
                  </motion.div>

                  {/* Divider */}
                  <Box sx={{ my: 3, display: "flex", alignItems: "center", gap: 2 }}>
                    <Divider sx={{ flex: 1 }} />
                    <Typography variant="caption" sx={{ color: "#999", fontWeight: 600 }}>
                      SECURE SIGN IN
                    </Typography>
                    <Divider sx={{ flex: 1 }} />
                  </Box>

                  {/* Info Text */}
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign: "center",
                      color: "#666",
                      lineHeight: 1.6,
                      fontSize: "0.8rem",
                    }}
                  >
                    To create your account, Microsoft will share your name, email address, and profile picture with IZIEL HEALTHCARE. See IZIEL HEALTHCARE's{" "}
                    <Box component="span" sx={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }}>
                      privacy policy
                    </Box>{" "}
                    and{" "}
                    <Box component="span" sx={{ color: "#2563eb", cursor: "pointer", fontWeight: 600 }}>
                      terms of service
                    </Box>
                    .
                  </Typography>
                </Box>
              </Fade>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}