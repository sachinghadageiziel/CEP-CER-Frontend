// ProjectCard.jsx - Updated with IFU download and backend data integration
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import { 
  ArrowRight, 
  FileSearch, 
  Filter, 
  ClipboardCheck,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  FileText,
} from "lucide-react";

export default function ProjectCard({ project, onLaunch, onEdit, onDelete, onDownloadIFU }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    handleMenuClose();
    if (onEdit) onEdit(project);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    handleMenuClose();
    if (onDelete) onDelete(project);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    handleMenuClose();
    if (onDownloadIFU) onDownloadIFU(project.id);
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate duration
  const getDuration = () => {
    if (!project.start_date || !project.end_date) return "Duration not set";
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.round(diffDays / 30)} months`;
    return `${Math.round(diffDays / 365)} years`;
  };

  // Get status color
  const getStatusColor = () => {
    switch (project.status) {
      case "Active":
        return { bg: "#d1e7dd", color: "#0f5132", border: "#95c9a8" };
      case "Completed":
        return { bg: "#cfe2ff", color: "#084298", border: "#9ec5fe" };
      case "On Hold":
        return { bg: "#fff3cd", color: "#664d03", border: "#ffdf7e" };
      case "Archived":
        return { bg: "#e2e3e5", color: "#41464b", border: "#c4c8cc" };
      default:
        return { bg: "#f8f9fa", color: "#495057", border: "#dee2e6" };
    }
  };

  const statusColors = getStatusColor();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        border: "2px solid #f1f3f5",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        bgcolor: "#fff",
        "&:hover": {
          transform: "translateY(-12px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          borderColor: "#e7f1ff",
          "& .launch-button": {
            transform: "translateX(6px)",
          },
          "& .project-bg": {
            transform: "scale(1.2) rotate(-15deg)",
            opacity: 0.12,
          },
          "& .main-icon": {
            transform: "rotate(5deg) scale(1.05)",
          }
        },
      }}
    >
      {/* Gradient Background Decoration */}
      <Box
        className="project-bg"
        sx={{
          position: "absolute",
          top: -70,
          right: -70,
          width: 200,
          height: 200,
          background: "linear-gradient(135deg, #e7f1ff 0%, #c4d0ff 100%)",
          borderRadius: "50%",
          opacity: 0.6,
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Header */}
      <Box 
        sx={{ 
          p: 3,
          pb: 2.5,
          borderBottom: "2px solid #f8f9fa",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box
            className="main-icon"
            sx={{
              width: 60,
              height: 60,
              borderRadius: 3,
              background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(13, 110, 253, 0.35)",
              transition: "all 0.3s ease",
            }}
          >
            <FileSearch size={30} color="#fff" strokeWidth={2.5} />
          </Box>
          
          {/* Three Dot Menu */}
          <IconButton 
            size="small"
            onClick={handleMenuClick}
            sx={{
              color: "#adb5bd",
              bgcolor: "transparent",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                bgcolor: "#f8f9fa",
                color: "#0d6efd",
                transform: "rotate(90deg)",
              }
            }}
          >
            <MoreVertical size={20} strokeWidth={2.5} />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid #e9ecef",
                minWidth: 180,
                mt: 1,
              }
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              onClick={handleEdit}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#e7f1ff",
                  "& .MuiListItemIcon-root": {
                    color: "#0d6efd",
                  }
                }
              }}
            >
              <ListItemIcon>
                <Edit size={18} strokeWidth={2.5} />
              </ListItemIcon>
              <ListItemText 
                primary="Edit Project"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}
              />
            </MenuItem>
            
            {/* Download IFU option - only show if IFU exists */}
            <MenuItem 
              onClick={handleDownload}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#e7f1ff",
                  "& .MuiListItemIcon-root": {
                    color: "#0d6efd",
                  }
                }
              }}
            >
              <ListItemIcon>
                <Download size={18} strokeWidth={2.5} />
              </ListItemIcon>
              <ListItemText 
                primary="Download IFU"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}
              />
            </MenuItem>
            
            <Divider sx={{ my: 0.5 }} />
            <MenuItem 
              onClick={handleDelete}
              sx={{
                py: 1.5,
                px: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "#ffebee",
                  "& .MuiListItemIcon-root": {
                    color: "#dc3545",
                  },
                  "& .MuiListItemText-primary": {
                    color: "#dc3545",
                  }
                }
              }}
            >
              <ListItemIcon>
                <Trash2 size={18} strokeWidth={2.5} />
              </ListItemIcon>
              <ListItemText 
                primary="Delete Project"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}
              />
            </MenuItem>
          </Menu>
        </Box>

        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            color: "#212529",
            mb: 1.5,
            lineHeight: 1.3,
            fontSize: "1.15rem"
          }}
        >
          {project.title}
        </Typography>

        {/* Status Chip */}
        <Chip
          label={project.status}
          size="small"
          sx={{
            bgcolor: statusColors.bg,
            color: statusColors.color,
            border: `2px solid ${statusColors.border}`,
            fontWeight: 700,
            fontSize: "0.75rem",
            px: 1,
          }}
        />
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, p: 3, pt: 2.5 }}>
        {/* Meta Info */}
        <Box sx={{ mb: 3 }}>
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1.5, 
              mb: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#f8f9fa",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#e7f1ff",
                transform: "translateX(4px)"
              }
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              <Calendar size={16} color="#0d6efd" strokeWidth={2.5} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.7rem", fontWeight: 600, display: "block" }}>
                START DATE
              </Typography>
              <Typography variant="body2" sx={{ color: "#212529", fontSize: "0.875rem", fontWeight: 600 }}>
                {formatDate(project.start_date)}
              </Typography>
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1.5,
              mb: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#f8f9fa",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#e7f1ff",
                transform: "translateX(4px)"
              }
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              <Calendar size={16} color="#0d6efd" strokeWidth={2.5} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.7rem", fontWeight: 600, display: "block" }}>
                END DATE
              </Typography>
              <Typography variant="body2" sx={{ color: "#212529", fontSize: "0.875rem", fontWeight: 600 }}>
                {formatDate(project.end_date)}
              </Typography>
            </Box>
          </Box>

          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 1.5,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "#f8f9fa",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#e7f1ff",
                transform: "translateX(4px)"
              }
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              <FileText size={16} color="#0d6efd" strokeWidth={2.5} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.7rem", fontWeight: 600, display: "block" }}>
                DURATION
              </Typography>
              <Typography variant="body2" sx={{ color: "#212529", fontSize: "0.875rem", fontWeight: 600 }}>
                {getDuration()}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Workflow Status Chips */}
        <Box 
          sx={{ 
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg, #e7f1ff 0%, #c4d0ff 100%)",
              border: "2px solid #b8d4ff",
              textAlign: "center",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px) scale(1.05)",
                boxShadow: "0 8px 20px rgba(13, 110, 253, 0.25)",
                borderColor: "#0d6efd",
              }
            }}
          >
            <FileSearch size={22} color="#0d6efd" strokeWidth={2.5} style={{ marginBottom: 6 }} />
            <Typography 
              variant="caption" 
              sx={{ 
                display: "block",
                color: "#0654c4",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.5px"
              }}
            >
              Literature
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)",
              border: "2px solid #ffdf7e",
              textAlign: "center",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px) scale(1.05)",
                boxShadow: "0 8px 20px rgba(253, 126, 20, 0.25)",
                borderColor: "#fd7e14",
              }
            }}
          >
            <Filter size={22} color="#fd7e14" strokeWidth={2.5} style={{ marginBottom: 6 }} />
            <Typography 
              variant="caption" 
              sx={{ 
                display: "block",
                color: "#dc6c13",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.5px"
              }}
            >
              Primary
            </Typography>
          </Box>

          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: "linear-gradient(135deg, #d1e7dd 0%, #a3cfbb 100%)",
              border: "2px solid #95c9a8",
              textAlign: "center",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-4px) scale(1.05)",
                boxShadow: "0 8px 20px rgba(25, 135, 84, 0.25)",
                borderColor: "#198754",
              }
            }}
          >
            <ClipboardCheck size={22} color="#198754" strokeWidth={2.5} style={{ marginBottom: 6 }} />
            <Typography 
              variant="caption" 
              sx={{ 
                display: "block",
                color: "#157347",
                fontWeight: 700,
                fontSize: "0.7rem",
                letterSpacing: "0.5px"
              }}
            >
              Secondary
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Launch Button */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          onClick={() => onLaunch(project)}
          endIcon={
            <ArrowRight 
              className="launch-button"
              size={20} 
              strokeWidth={3}
              style={{ 
                transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            />
          }
          sx={{
            py: 1.8,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: "1rem",
            textTransform: "none",
            background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
            color: "#fff",
            boxShadow: "0 6px 20px rgba(13, 110, 253, 0.35)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
              transition: "left 0.5s ease",
            },
            "&:hover": {
              background: "linear-gradient(135deg, #0654c4 0%, #0545a8 100%)",
              transform: "translateY(-3px)",
              boxShadow: "0 12px 32px rgba(13, 110, 253, 0.45)",
              "&::before": {
                left: "100%",
              }
            },
            "&:active": {
              transform: "translateY(-1px)",
            }
          }}
        >
          Launch Project
        </Button>
      </Box>
    </Card>
  );
}