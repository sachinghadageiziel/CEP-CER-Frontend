import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  Tab,
  Tabs,
  Paper,
  Tooltip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Mail,
  MapPin,
  Calendar,
  Edit,
  Settings,
  Share2,
  Shield,
  CheckCircle,
  Clock,
  Activity,
  Briefcase,
  TrendingUp,
  Award,
  Star,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMsal } from '@azure/msal-react';

const MicrosoftLogo = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <rect width="10" height="10" fill="#F25022"/>
    <rect x="11" width="10" height="10" fill="#7FBA00"/>
    <rect y="11" width="10" height="10" fill="#00A4EF"/>
    <rect x="11" y="11" width="10" height="10" fill="#FFB900"/>
  </svg>
);

const BackgroundOrb = ({ delay = 0, duration = 20, style }) => (
  <motion.div
    style={{
      position: 'absolute',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
      filter: 'blur(60px)',
      ...style,
    }}
    animate={{
      x: [0, 100, -100, 0],
      y: [0, -100, 100, 0],
      scale: [1, 1.2, 0.8, 1],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

export default function ProfilePage() {
  const { accounts } = useMsal();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        if (accounts.length === 0) {
          setError("No user logged in. Please sign in with Microsoft.");
          setLoading(false);
          return;
        }

        const account = accounts[0];
        
        const user = {
          name: account.name || "User",
          email: account.username || "email@example.com",
          accountId: account.localAccountId || account.homeAccountId || "N/A",
          tenantId: account.tenantId || "N/A",
          avatar: getInitials(account.name),
          joinDate: getFormattedDate(account.idTokenClaims?.iat),
          role: account.idTokenClaims?.jobTitle || "Team Member",
          department: account.idTokenClaims?.department || "General",
          location: account.idTokenClaims?.officeLocation || "Not specified",
          bio: `Professional user authenticated via Microsoft Azure AD. Member since ${getFormattedDate(account.idTokenClaims?.iat)}.`,
          verified: true,
          accountType: "Microsoft Account",
        };

        const response = await fetch(`http://localhost:5000/api/users/${account.localAccountId}/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (response.ok) {
          const backendData = await response.json();
          setUserData({ ...user, ...backendData });
        } else {
          setUserData(user);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data. Using cached information.");
        
        if (accounts.length > 0) {
          const account = accounts[0];
          setUserData({
            name: account.name || "User",
            email: account.username || "email@example.com",
            accountId: account.localAccountId || "N/A",
            avatar: getInitials(account.name),
            joinDate: "Recently",
            role: "Team Member",
            department: "General",
            location: "Not specified",
            bio: "Professional user authenticated via Microsoft Azure AD.",
            verified: true,
            accountType: "Microsoft Account",
          });
        }
        
        setLoading(false);
      }
    };

    fetchUserData();
  }, [accounts]);

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const getFormattedDate = (timestamp) => {
    if (!timestamp) return "Recently";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const stats = [
    { 
      label: "Projects Completed", 
      value: userData?.projectsCompleted || "0", 
      icon: CheckCircle, 
      color: "#28a745",
      gradient: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
    },
    { 
      label: "Active Projects", 
      value: userData?.activeProjects || "0", 
      icon: Activity, 
      color: "#0d6efd",
      gradient: "linear-gradient(135deg, #0d6efd 0%, #8b5cf6 100%)",
    },
    { 
      label: "Papers Published", 
      value: userData?.papersPublished || "0", 
      icon: Award, 
      color: "#ffc107",
      gradient: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
    },
    { 
      label: "Team Members", 
      value: userData?.teamMembers || "0", 
      icon: Briefcase, 
      color: "#17a2b8",
      gradient: "linear-gradient(135deg, #17a2b8 0%, #138496 100%)",
    },
  ];

  const achievements = [
    { title: "Verified User", description: "Authenticated via Microsoft", icon: Shield, color: "#8b5cf6" },
    { title: "Active Member", description: "Regular platform usage", icon: Star, color: "#ffc107" },
    { title: "Secure Login", description: "Azure AD Protection", icon: Zap, color: "#0d6efd" },
    { title: "Contributor", description: "Platform contributor", icon: TrendingUp, color: "#28a745" },
  ];

  const recentActivity = [
    { action: "Profile Updated", name: "Account information synced", time: "Now", icon: CheckCircle, color: "#28a745" },
    { action: "Logged In", name: "Successful authentication", time: "Today", icon: Activity, color: "#0d6efd" },
    { action: "Security Check", name: "Multi-factor authentication", time: "Today", icon: Shield, color: "#ffc107" },
    { action: "Session Started", name: "New session initiated", time: "Just now", icon: Clock, color: "#17a2b8" },
  ];

  const skills = [
    { name: "Microsoft Integration", level: 100 },
    { name: "Data Security", level: 95 },
    { name: "Cloud Services", level: 90 },
    { name: "Authentication", level: 100 },
    { name: "Professional Tools", level: 85 },
  ];

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
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        bgcolor: "#f8f9fa",
      }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#495057" }}>
            Loading your profile...
          </Typography>
          <Typography variant="body2" sx={{ color: "#6c757d", mt: 1 }}>
            Fetching data from Microsoft
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error && !userData) {
    return (
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        bgcolor: "#f8f9fa",
        p: 3,
      }}>
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Authentication Required</Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      bgcolor: "#f8f9fa",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <BackgroundOrb delay={0} duration={20} style={{ width: 400, height: 400, top: -100, left: -100 }} />
      <BackgroundOrb delay={2} duration={25} style={{ width: 500, height: 500, bottom: -150, right: -150 }} />
      <BackgroundOrb delay={4} duration={30} style={{ width: 300, height: 300, top: '40%', right: -50 }} />

      <Box
        sx={{
          background: "linear-gradient(135deg, #0d6efd 0%, #8b5cf6 100%)",
          pt: 8,
          pb: 12,
          position: 'relative',
          overflow: 'hidden',
          "&::before": {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: "#fff", 
                  fontWeight: 800,
                  textShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                My Profile
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip title="Share Profile">
                    <IconButton
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        backdropFilter: "blur(10px)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.3)",
                        },
                      }}
                    >
                      <Share2 size={20} />
                    </IconButton>
                  </Tooltip>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip title="Settings">
                    <IconButton
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "#fff",
                        backdropFilter: "blur(10px)",
                        border: "2px solid rgba(255,255,255,0.3)",
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,0.3)",
                        },
                      }}
                    >
                      <Settings size={20} />
                    </IconButton>
                  </Tooltip>
                </motion.div>
              </Box>
            </Box>

            {error && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card
              sx={{
                borderRadius: 5,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                overflow: 'hidden',
                mb: 4,
                background: "linear-gradient(135deg, #fff 0%, #f8f9fa 100%)",
                border: '2px solid rgba(13, 110, 253, 0.1)',
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={12} md="auto">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                          sx={{
                            width: 140,
                            height: 140,
                            background: "linear-gradient(135deg, #0d6efd 0%, #8b5cf6 100%)",
                            fontSize: "3rem",
                            fontWeight: 800,
                            boxShadow: "0 12px 40px rgba(13, 110, 253, 0.4)",
                            border: '6px solid #fff',
                          }}
                        >
                          {userData?.avatar}
                        </Avatar>
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              bgcolor: '#28a745',
                              border: '4px solid #fff',
                              boxShadow: '0 0 16px rgba(40, 167, 69, 0.6)',
                            }}
                          />
                        </motion.div>
                      </Box>
                    </motion.div>
                  </Grid>
                  <Grid item xs={12} md>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#212529' }}>
                          {userData?.name}
                        </Typography>
                        {userData?.verified && (
                          <Chip
                            icon={<Shield size={14} fill="#28a745" stroke="#fff" />}
                            label="Verified"
                            size="small"
                            sx={{
                              bgcolor: '#d4edda',
                              color: '#155724',
                              fontWeight: 700,
                              border: '2px solid #c3e6cb',
                            }}
                          />
                        )}
                        <Chip
                          icon={<MicrosoftLogo size={14} />}
                          label={userData?.accountType}
                          size="small"
                          sx={{
                            bgcolor: '#e7f1ff',
                            color: '#0d6efd',
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                      <Typography variant="h6" sx={{ color: '#6c757d', fontWeight: 600, mb: 0.5 }}>
                        {userData?.role}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#868e96', mb: 2 }}>
                        {userData?.department}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#495057', lineHeight: 1.8, mb: 3 }}>
                        {userData?.bio}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Mail size={18} color="#6c757d" />
                          <Typography variant="body2" sx={{ color: '#495057', fontWeight: 600 }}>
                            {userData?.email}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MapPin size={18} color="#6c757d" />
                          <Typography variant="body2" sx={{ color: '#495057', fontWeight: 600 }}>
                            {userData?.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Calendar size={18} color="#6c757d" />
                          <Typography variant="body2" sx={{ color: '#495057', fontWeight: 600 }}>
                            Joined {userData?.joinDate}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="contained"
                          startIcon={<Edit size={18} />}
                          sx={{
                            background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 700,
                            textTransform: 'none',
                            boxShadow: '0 8px 24px rgba(13, 110, 253, 0.3)',
                            "&:hover": {
                              boxShadow: '0 12px 32px rgba(13, 110, 253, 0.4)',
                            },
                          }}
                        >
                          Edit Profile
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outlined"
                          startIcon={<BarChart3 size={18} />}
                          sx={{
                            borderColor: '#0d6efd',
                            color: '#0d6efd',
                            px: 4,
                            py: 1.5,
                            borderRadius: 3,
                            fontWeight: 700,
                            textTransform: 'none',
                            borderWidth: 2,
                            "&:hover": {
                              borderWidth: 2,
                              borderColor: '#0654c4',
                              bgcolor: 'rgba(13, 110, 253, 0.05)',
                            },
                          }}
                        >
                          View Analytics
                        </Button>
                      </motion.div>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                        overflow: 'hidden',
                        position: 'relative',
                        background: '#fff',
                        border: `2px solid ${stat.color}15`,
                        "&:hover": {
                          boxShadow: `0 12px 40px ${stat.color}30`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -20,
                          right: -20,
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          background: `${stat.color}10`,
                          filter: 'blur(30px)',
                        }}
                      />
                      <CardContent sx={{ p: 3, position: 'relative' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: 3,
                              background: stat.gradient,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: `0 8px 24px ${stat.color}40`,
                            }}
                          >
                            <stat.icon size={28} color="#fff" strokeWidth={2.5} />
                          </Box>
                          <motion.div
                            animate={{
                              y: [0, -5, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <TrendingUp size={20} color={stat.color} />
                          </motion.div>
                        </Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: stat.color, mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 600 }}>
                          {stat.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <motion.div variants={itemVariants}>
            <Card
              sx={{
                borderRadius: 5,
                boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                overflow: 'hidden',
                background: '#fff',
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{
                    "& .MuiTab-root": {
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1rem',
                      minHeight: 56,
                      "&.Mui-selected": {
                        color: '#0d6efd',
                      },
                    },
                    "& .MuiTabs-indicator": {
                      height: 3,
                      borderRadius: '3px 3px 0 0',
                      background: 'linear-gradient(90deg, #0d6efd 0%, #8b5cf6 100%)',
                    },
                  }}
                >
                  <Tab label="Skills & Expertise" />
                  <Tab label="Achievements" />
                  <Tab label="Recent Activity" />
                </Tabs>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <AnimatePresence mode="wait">
                  {activeTab === 0 && (
                    <motion.div
                      key="skills"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#212529' }}>
                        Professional Skills
                      </Typography>
                      <Grid container spacing={3}>
                        {skills.map((skill, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Box sx={{ mb: 2 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 700, color: '#495057' }}>
                                  {skill.name}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0d6efd' }}>
                                  {skill.level}%
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  height: 10,
                                  borderRadius: 5,
                                  bgcolor: '#e9ecef',
                                  overflow: 'hidden',
                                  position: 'relative',
                                }}
                              >
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.level}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  style={{
                                    height: '100%',
                                    borderRadius: 5,
                                    background: 'linear-gradient(90deg, #0d6efd 0%, #8b5cf6 100%)',
                                  }}
                                />
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </motion.div>
                  )}

                  {activeTab === 1 && (
                    <motion.div
                      key="achievements"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#212529' }}>
                        Achievements & Awards
                      </Typography>
                      <Grid container spacing={3}>
                        {achievements.map((achievement, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <motion.div
                              whileHover={{ scale: 1.03 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Paper
                                sx={{
                                  p: 3,
                                  borderRadius: 4,
                                  background: `linear-gradient(135deg, ${achievement.color}10 0%, ${achievement.color}05 100%)`,
                                  border: `2px solid ${achievement.color}30`,
                                  boxShadow: `0 4px 16px ${achievement.color}15`,
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                  <Box
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: 2.5,
                                      background: `linear-gradient(135deg, ${achievement.color} 0%, ${achievement.color}dd 100%)`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: `0 4px 12px ${achievement.color}40`,
                                    }}
                                  >
                                    <achievement.icon size={24} color="#fff" strokeWidth={2.5} />
                                  </Box>
                                  <Box>
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#212529', mb: 0.5 }}>
                                      {achievement.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 600 }}>
                                      {achievement.description}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Paper>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    </motion.div>
                  )}

                  {activeTab === 2 && (
                    <motion.div
                      key="activity"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, color: '#212529' }}>
                        Recent Activity
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {recentActivity.map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 8 }}
                          >
                            <Paper
                              sx={{
                                p: 3,
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 3,
                                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                border: '2px solid #f8f9fa',
                                transition: 'all 0.3s ease',
                                "&:hover": {
                                  boxShadow: `0 8px 24px ${activity.color}20`,
                                  borderColor: `${activity.color}30`,
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 2.5,
                                  background: `${activity.color}15`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <activity.icon size={22} color={activity.color} strokeWidth={2.5} />
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 600, mb: 0.5 }}>
                                  {activity.action}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#212529' }}>
                                  {activity.name}
                                </Typography>
                              </Box>
                              <Typography variant="caption" sx={{ color: '#868e96', fontWeight: 600 }}>
                                {activity.time}
                              </Typography>
                            </Paper>
                          </motion.div>
                        ))}
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}