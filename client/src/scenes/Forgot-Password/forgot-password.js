import React from "react";
import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom"; // Import Link
import Swal from "sweetalert2";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const { palette } = useTheme();

  const handleSubmit = async (values, onSubmitProps) => {
    try {
      const response = await fetch(`${process.env.BACKEND_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send password reset request");
      }

      const data = await response.json();
      

      if (data.status === "User Not Exists!!") {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "User does not exist.",
        });
        return;
      }
      else if (data.status==="User Exists!!"){

        Swal.fire({
          icon: "success",
          title: "Password Reset Email Sent",
          text: `An email has been sent to ${values.email}.`,
        });
      }

      onSubmitProps.resetForm();
    } catch (error) {
      console.error("Error sending password reset request:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Box maxWidth="400px" width="100%" p={4} boxShadow={2} borderRadius={4}>
        <Typography variant="h5" gutterBottom>
          Forgot Password
        </Typography>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                fullWidth
                variant="outlined"
                margin="normal"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: palette.primary.main,
                  color: "white",
                  marginBottom: "1rem",
                }}
              >
                Submit
              </Button>
              <Typography variant="body2">
                <Link to="/" style={{ 
              color: palette.primary.main,
              textDecoration: "underline",
              cursor: "pointer", // Add cursor effect
            }}
                  onMouseOver={(e) => (e.target.style.textDecoration = "none")} // Remove underline on hover
                  onMouseOut={(e) => (e.target.style.textDecoration = "underline")} // Add underline back on mouse out
                  >
                  Back to login
                </Link>
              </Typography>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
