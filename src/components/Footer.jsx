import React from "react";
import { Box, Grid, Typography, Divider } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: "#0d47a1",
        color: "white",
        mt: 6,
        pt: 6,
        pb: 2,
      }}
    >
      <Grid container spacing={4} sx={{ px: { xs: 3, md: 8 } }}>
        
        {/* ============= INDIA OFFICES ============= */}
        <Grid item xs={12} md={4}>
          {/* <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            India Offices
          </Typography> */}

          {/* <Typography variant="subtitle1" fontWeight={600}>
            Pune
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            601/ 604, Pentagon P1, Magarpatta City,<br />
            Hadapsar, Pune 411028.<br />
            Phone: +91 72762 12555
          </Typography> */}

          {/* <Typography variant="subtitle1" fontWeight={600}>
            Bangalore
          </Typography>
          <Typography variant="body2">
            A15, iSprout Business Center Shilpitha Tech Park,<br />
            SY NO: 55/3 & 55/4, Sakra World Hospital,<br />
            Devarabisanahalli, Bengaluru 560103, Karnataka.<br />
            Phone: +91 72762 12555
          </Typography> */}
        </Grid>

        {/* ============= USA OFFICE ============= */}
        <Grid item xs={12} md={4}>
          {/* <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            USA Office
          </Typography>
          <Typography variant="body2">
            121 Washington Avenue North, Suite 306<br />
            Minneapolis, MN 55401<br />
            Office Phone: +1 (612) 445-8764
          </Typography> */}
        </Grid>

        {/* ============= CONTACT ============= */}
        <Grid item xs={12} md={4}>
          {/* <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Contact
          </Typography>
          <Typography variant="body2">
            Email: sales@iziel.com
          </Typography> */}
        </Grid>

      </Grid>

      {/* <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.3)" }} /> */}

      {/* Bottom small footer */}
      <Box sx={{ textAlign: "center", pb: 1 }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          © {new Date().getFullYear()} Iziel Healthcare. All Rights Reserved.
        </Typography>
      </Box>
    </Box>
  );
}
