import { Breadcrumbs, Typography, Link, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

export default function BreadcrumbsBar({ items = [] }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs
        separator={
          <ChevronRight 
            size={16} 
            style={{ 
              color: "#adb5bd",
              strokeWidth: 2.5,
            }} 
          />
        }
        sx={{
          "& .MuiBreadcrumbs-ol": {
            flexWrap: "wrap",
          }
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = item.label === "Home";

          if (isHome) {
            return (
              <Link
                key="home"
                component={RouterLink}
                to={item.to}
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  transition: "all 0.2s ease",
                  color: "#6c757d",
                  bgcolor: "transparent",
                  border: "1px solid transparent",
                  "&:hover": {
                    bgcolor: "#f8f9fa",
                    color: "#0d6efd",
                    border: "1px solid #e9ecef",
                    transform: "translateY(-1px)",
                  }
                }}
              >
                <Home size={16} strokeWidth={2.5} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  Home
                </Typography>
              </Link>
            );
          }

          if (isLast || !item.to) {
            return (
              <Box
                key={index}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: 2,
                  background: "linear-gradient(135deg, #0d6efd 0%, #0654c4 100%)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  boxShadow: "0 2px 12px rgba(13, 110, 253, 0.25)",
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: "0.875rem",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          }

          return (
            <Link
              key={index}
              component={RouterLink}
              to={item.to}
              underline="none"
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                transition: "all 0.2s ease",
                color: "#6c757d",
                bgcolor: "transparent",
                border: "1px solid transparent",
                display: "inline-block",
                "&:hover": {
                  bgcolor: "#f8f9fa",
                  color: "#0d6efd",
                  border: "1px solid #e9ecef",
                  transform: "translateY(-1px)",
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                {item.label}
              </Typography>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}