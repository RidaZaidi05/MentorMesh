import { Box, Typography, useTheme, useMediaQuery ,  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      {/* <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
        MentorMesh
        </Typography>
      </Box> */}



<Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        position="relative"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          MentorMesh
        </Typography>

        <IconButton
          onClick={handleOpen}
          color="primary"
          sx={{
            position: "absolute",
            right: "6%",
            fontSize: "2rem", // Increase icon size
          }}
        >
          <HelpOutlineIcon fontSize="large" />
        </IconButton>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Testing Credentials</DialogTitle>
        <DialogContent>
          <Typography>
            This system is currently for testing purposes only. To test the
            student end, use the credentials: <br />
            <strong>Email:</strong> l212100@lhr.nu.edu.pk <br />
            <strong>Password:</strong> 123456 <br />
            <br />
            To test the teacher end, use the credentials: <br />
            <strong>Email:</strong> test.teacher@nu.edu.pk <br />
            <strong>Password:</strong> 123456
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.background.alt}}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
        Welcome to MentorMesh, your guiding light through the journey of your Final Year Project!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
