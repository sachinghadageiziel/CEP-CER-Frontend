import { Box, Typography, Card, Chip, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import BreadcrumbsBar from "../components/BreadcrumbsBar";

export default function PrimaryResultDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return null;

  return (
    <Box sx={{ p: 3 }}>
      <BreadcrumbsBar
        items={[
          { label: "Home", link: "/" },
          { label: "Primary Search", link: -1 },
          { label: state.PMID },
        ]}
      />

      <Typography variant="h5" fontWeight={600}>
        {state.Title || "Article Details"}
      </Typography>

      <Box sx={{ mt: 1 }}>
        <Chip label={state.Decision} color="success" sx={{ mr: 1 }} />
        <Chip label={state.Category} variant="outlined" />
      </Box>

      <Card sx={{ p: 3, mt: 3 }}>
        <Typography fontWeight={600}>Abstract</Typography>
        <Typography sx={{ mt: 1 }}>{state.Abstract}</Typography>
      </Card>

      <Card sx={{ p: 3, mt: 2 }}>
        <Typography fontWeight={600}>Rationale</Typography>
        <Typography sx={{ mt: 1 }}>{state.Rationale}</Typography>
      </Card>

      <Button sx={{ mt: 3 }} onClick={() => navigate(-1)}>
        ← Back to Results
      </Button>
    </Box>
  );
}
