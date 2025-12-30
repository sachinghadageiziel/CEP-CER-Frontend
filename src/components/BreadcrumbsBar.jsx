import { Breadcrumbs, Typography, Link, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

export default function BreadcrumbsBar({ items = [] }) {
  return (
    <Breadcrumbs
      separator={
        <Typography sx={{ color: "text.disabled", mx: 0.5 }}>/</Typography>
      }
      sx={{ mb: 2 }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        if (item.label === "Home") {
          return (
            <Link
              key="home"
              component={RouterLink}
              to={item.to}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <HomeOutlinedIcon fontSize="small" />
            </Link>
          );
        }

        if (isLast || !item.to) {
          return (
            <Box
              key={index}
              sx={{
                px: 1,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "primary.main",
                color: "primary.main",
                fontSize: 13,
              }}
            >
              {item.label}
            </Box>
          );
        }

        return (
          <Link
            key={index}
            component={RouterLink}
            to={item.to}
            sx={{ fontSize: 13 }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
