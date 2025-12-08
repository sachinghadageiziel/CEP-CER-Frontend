import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ backgroundColor: "#1565c0" }}>
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: { xs: 2, sm: 4 },
                }}
            >
                {/* Left: Logo */}
                <Typography
                    variant="h6"
                    sx={{ cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => navigate("/")}
                >
                    IZIEL HEALTHCARE
                </Typography>

                {/* Center: Navigation */}
                <Box sx={{ display: "flex", gap: 3, flexGrow: 1, justifyContent: "center" }}>
                    <Button color="inherit" onClick={() => navigate("/")}>
                        Home
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/about")}>
                        About
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/contact")}>
                        Contact
                    </Button>
                </Box>

                <Button
                    sx={{
                        backgroundColor: "white",
                        color: "#1565c0",
                        fontWeight: "bold",
                        borderRadius: 2,
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#e3f2fd",
                        },
                    }}
                    onClick={() => {
                        console.log("Logout clicked");
                    }}
                >
                    Logout
                </Button>


            </Toolbar>
        </AppBar>
    );
}
