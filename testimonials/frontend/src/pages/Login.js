import React from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const Login = () => {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}>
        <Typography variant="h4" color="primary" gutterBottom>
          Login
        </Typography>
        <TextField label="Email" variant="outlined" fullWidth margin="normal" />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
