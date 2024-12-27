import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  InputLabel,
  useTheme,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import { useLocation } from "react-router-dom";
import axios from "axios";
const RequestPage = () => {
  const [rollNumberValid, setRollNumberValid] = useState(true);
  const { palette } = useTheme();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const title = searchParams.get("title");
  const postUserId = searchParams.get("postUserId");
  const postId = searchParams.get("postId");

  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [member1Error, setMember1Error] = useState(false);
  const [member2Error, setMember2Error] = useState(false);
  const [member3Error, setMember3Error] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [file1, setFile1] = useState();
  const [file2, setFile2] = useState();
  const [file3, setFile3] = useState();

  const Submit = async () => {

    const teacherData = {
      postId: postId,
      teacherId: postUserId,
      title: title,
      member1Data: {
        firstName: member1Data.firstName,
        lastName: member1Data.lastName,
        rollNumber: member1Data.rollNumber,
        email: member1Data.email,
        transcript: file1.name,
        previousProjects: member1Data.previousProjects,
      },
      member2Data: {
        firstName: member2Data.firstName,
        lastName: member2Data.lastName,
        rollNumber: member2Data.rollNumber,
        email: member2Data.email,
        transcript: file2.name,
        previousProjects: member2Data.previousProjects,
      },
      member3Data: {
        firstName: member3Data.firstName,
        lastName: member3Data.lastName,
        rollNumber: member3Data.rollNumber,
        email: member3Data.email,
        transcript: file3.name,
        previousProjects: member3Data.previousProjects,
      },
    };

    const formData = new FormData();
    formData.append("postId", teacherData.postId);
    formData.append("teacherId", teacherData.teacherId);
    formData.append("title", teacherData.title);
    formData.append("member1Data", JSON.stringify(teacherData.member1Data));
    formData.append("member2Data", JSON.stringify(teacherData.member2Data));
    formData.append("member3Data", JSON.stringify(teacherData.member3Data));

    try {
      // Send teacherData to the backend using Axios POST request
      const savedReqResponse = await axios.post(
        `${process.env.BACKEND_URL}/teacherData/`,
        formData
      );

      formData.append("transcript1", file1);
      formData.append("transcript2", file2);
      formData.append("transcript3", file3);

      const savedTransResponse = await axios.post(
        `${process.env.BACKEND_URL}/transData/`,
        formData
      );

      const data = {
        postId: teacherData.postId,
        teacherId: teacherData.teacherId,
        title: teacherData.title,
        member1Data: teacherData.member1Data,
        member2Data: teacherData.member2Data,
        member3Data: teacherData.member3Data,
      };

      const savedRegisterNotificationResponse = await axios.post(
        `${process.env.BACKEND_URL}/posts/addnotify`,
        data
      );

      setMember1Data({
        firstName: "",
        lastName: "",
        rollNumber: "",
        email: "",
        transcript: null,
        previousProjects: "",
      });
      setMember2Data({
        firstName: "",
        lastName: "",
        rollNumber: "",
        email: "",
        transcript: null,
        previousProjects: "",
      });
      setMember3Data({
        firstName: "",
        lastName: "",
        rollNumber: "",
        email: "",
        transcript: null,
        previousProjects: "",
      });
      setFile1(null);
      setFile2(null);
      setFile3(null);
      setFormSubmitted(false);

      setMember1Data((prevState) => ({
        ...prevState,
        transcript: "",
      }));
      setMember2Data((prevState) => ({
        ...prevState,
        transcript: "",
      }));
      setMember3Data((prevState) => ({
        ...prevState,
        transcript: "",
      }));
    } catch (error) {
      console.error("Error sending form data:", error);
      if (error.response) {
        // If so, clear the roll number fields

        setRollNumberValid(false);
        setMember1Data((prevState) => ({ ...prevState, rollNumber: "" }));
        setMember2Data((prevState) => ({ ...prevState, rollNumber: "" }));
        setMember3Data((prevState) => ({ ...prevState, rollNumber: "" }));
      }
    }
  };

  const [member1Data, setMember1Data] = useState({
    firstName: "",
    lastName: "",
    rollNumber: "",
    email: "",
    transcript: null,
    previousProjects: "",
  });

  const [member2Data, setMember2Data] = useState({
    firstName: "",
    lastName: "",
    rollNumber: "",
    email: "",
    transcript: null,
    previousProjects: "",
  });

  const [member3Data, setMember3Data] = useState({
    firstName: "",
    lastName: "",
    rollNumber: "",
    email: "",
    transcript: null,
    previousProjects: "",
  });

  const isValidFileType = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    return file && allowedTypes.includes(file.type);
  };

  const handleInputChange = (e, setDataFunction, setErrorFunction, setFile) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      if (isValidFileType(file)) {
        const currentDate = new Date().toISOString().replace(/:/g, "-"); // Get current date and time
        const uniqueFileName = `${currentDate}_${file.name}`; // Append date and time to the filename
        const fileWithUniqueName = new File([file], uniqueFileName, {
          type: file.type,
        }); // Create a new File object with the unique filename
        setFile(fileWithUniqueName);
        setDataFunction((prevState) => ({
          ...prevState,
          transcript : value,
        }));
        
      } else {
        e.target.value = ""; // Reset the input field value
        setFile(null);
      }
    } else {
      setDataFunction((prevState) => ({
        ...prevState,
        [name]: value,
      }));
      setErrorFunction(false);
      setFormSubmitted(false);
      setRollNumberValid(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    // Check for empty fields in member data
    const isMember1DataValid = isValidMember(member1Data, file1);
    const isMember2DataValid = isValidMember(member2Data, file2);
    const isMember3DataValid = isValidMember(member3Data, file3);

    // Set error states for each member if their data is invalid
    setMember1Error(isMember1DataValid);
    setMember2Error(isMember2DataValid);
    setMember3Error(isMember3DataValid);

    // If any member data is invalid, return early and do not submit the form
    if (isMember1DataValid || isMember2DataValid || isMember3DataValid) {
      return;
    }

    // If all member data is valid, proceed with form submission

    Submit();
  };

  const isValidMember = (memberData, file) => {
    return (
      memberData.firstName.trim() === "" ||
      memberData.lastName.trim() === "" ||
      memberData.rollNumber.trim() === "" ||
      memberData.email.trim() === "" ||
      file === null
    );
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          textAlign: "center",
          color: "primary.main",
          backgroundColor: palette.background.alt,
          padding: "2px",

          margin: "0 0px", // Adjust the margin for inward spacing from left and right borders
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          {title}
        </h1>
      </Box>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 4 }} />
        <Grid
          container
          spacing={isNonMobileScreens ? 3 : 2}
          justifyContent="space-between"
        >
          {/* Member 1 Registration */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: palette.background.alt,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "primary.main",
                  mb: 2,
                }}
              >
                Member 1 Registration
              </Typography>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={member1Data.firstName}
                onChange={(e) =>
                  handleInputChange(e, setMember1Data, setMember1Error)
                }
                sx={{ mb: 2 }}
                error={formSubmitted && member1Data.firstName === ""}
                helperText={
                  formSubmitted && member1Data.firstName === ""
                    ? "First Name is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={member1Data.lastName}
                onChange={(e) =>
                  handleInputChange(e, setMember1Data, setMember1Error)
                }
                inputProps={{ accept: ".jpg, .jpeg, .png, .pdf" }}
                sx={{ mb: 2 }}
                error={formSubmitted && member1Data.lastName === ""}
                helperText={
                  formSubmitted && member1Data.lastName === ""
                    ? "Last Name is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Roll Number"
                name="rollNumber"
                value={member1Data.rollNumber}
                onChange={(e) =>
                  handleInputChange(e, setMember1Data, setMember1Error)
                }
                sx={{ mb: 2 }}
                error={
                  (formSubmitted && member1Data.rollNumber === "") ||
                  !rollNumberValid
                }
                helperText={
                  !rollNumberValid
                    ? "Invalid roll number"
                    : formSubmitted && member1Data.rollNumber === ""
                    ? "Roll Number is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                value={member1Data.email}
                onChange={(e) =>
                  handleInputChange(e, setMember1Data, setMember1Error)
                }
                sx={{ mb: 2 }}
                error={formSubmitted && member1Data.email === ""}
                helperText={
                  formSubmitted && member1Data.email === ""
                    ? "Email is required"
                    : ""
                }
              />

              <InputLabel sx={{ mt: 0, mb: 1 }}>
                Upload Transcript (jpg, png, jpeg,or pdf)
              </InputLabel>
              <TextField
                fullWidth
                name="transcript1"
                value={member1Data.transcript}
                type="file"
                onChange={
                  (e) =>
                    handleInputChange(
                      e,
                      setMember1Data,
                      setMember1Error,
                      setFile1
                    )
                  //setFile(e.target.files[0])
                }
                sx={{ mb: 2 }}
                error={formSubmitted && !file1}
                helperText={
                  formSubmitted && !file1 ? "Transcript is required" : ""
                }
              />

              <TextField
                fullWidth
                label="Previous Projects" // Label for the text field
                name="previousProjects" // Name attribute for the input
                multiline // Allows multiple lines of text
                rows={4} // Number of rows for the multiline input
                value={member1Data.previousProjects} // Value of the input, taken from the state
                onChange={(e) =>
                  handleInputChange(e, setMember1Data, setMember1Error)
                } // Handler for input changes
                sx={{ mb: 2 }} // Styling using the Material-UI sx prop
              />
            </Box>
          </Grid>

          {/* Member 2 Registration */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: palette.background.alt,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "primary.main",
                  mb: 2,
                }}
              >
                Member 2 Registration
              </Typography>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={member2Data.firstName}
                onChange={(e) =>
                  handleInputChange(e, setMember2Data, setMember2Error)
                }
                sx={{ mb: 2 }}
                error={formSubmitted && member2Data.firstName === ""}
                helperText={
                  formSubmitted && member2Data.firstName === ""
                    ? "First Name is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={member2Data.lastName}
                onChange={(e) =>
                  handleInputChange(e, setMember2Data, setMember2Error)
                }
                sx={{ mb: 2 }}
                error={formSubmitted && member2Data.lastName === ""}
                helperText={
                  formSubmitted && member2Data.lastName === ""
                    ? "Last Name is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Roll Number"
                name="rollNumber"
                value={member2Data.rollNumber}
                onChange={(e) =>
                  handleInputChange(e, setMember2Data, setMember2Error)
                }
                sx={{ mb: 2 }}
                error={
                  (formSubmitted && member2Data.rollNumber === "") ||
                  !rollNumberValid // Assuming you have a rollNumberValid2 state for member 2
                }
                helperText={
                  !rollNumberValid
                    ? "Invalid roll number"
                    : formSubmitted && member2Data.rollNumber === ""
                    ? "Roll Number is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                value={member2Data.email}
                onChange={(e) =>
                  handleInputChange(e, setMember2Data, setMember2Error)
                }
                sx={{ mb: 2 }}
                error={formSubmitted && member2Data.email === ""}
                helperText={
                  formSubmitted && member2Data.email === ""
                    ? "Email is required"
                    : ""
                }
              />

              <InputLabel id="transcript1-label" sx={{ mt: 0, mb: 1 }}>
                Upload Transcript (jpg, jpeg,png, or pdf)
              </InputLabel>
              <TextField
                fullWidth
                name="transcript2"
                type="file"
                value={member2Data.transcript}
                onChange={(e) =>
                  handleInputChange(
                    e,
                    setMember2Data,
                    setMember2Error,
                    setFile2
                  )
                }
                sx={{ mb: 2 }}
                error={formSubmitted && !file2}
                helperText={
                  formSubmitted && !file2 ? "Transcript is required" : ""
                }
              />

              <TextField
                fullWidth
                label="Previous Projects"
                name="previousProjects"
                multiline
                rows={4}
                value={member2Data.previousProjects}
                onChange={(e) =>
                  handleInputChange(e, setMember2Data, setMember2Error)
                }
                sx={{ mb: 2 }}
              />
            </Box>
          </Grid>

          {/* Member 3 Registration */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                backgroundColor: palette.background.alt,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "primary.main",
                  mb: 2,
                }}
              >
                Member 3 Registration
              </Typography>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={member3Data.firstName}
                onChange={(e) =>
                  handleInputChange(e, setMember3Data, setMember3Error)
                }
                sx={{ mb: 2 }}
                error={formSubmitted && member3Data.firstName === ""}
                helperText={
                  formSubmitted && member3Data.firstName === ""
                    ? "First Name is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={member3Data.lastName}
                onChange={(e) =>
                  handleInputChange(e, setMember3Data, setMember3Error)
                }
                sx={{ mb: 2 }}
                error={formSubmitted && member3Data.lastName === ""}
                helperText={
                  formSubmitted && member3Data.lastName === ""
                    ? "Last Name is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Roll Number"
                name="rollNumber"
                value={member3Data.rollNumber}
                onChange={(e) =>
                  handleInputChange(e, setMember3Data, setMember3Error)
                }
                sx={{ mb: 2 }}
                error={
                  (formSubmitted && member3Data.rollNumber === "") ||
                  !rollNumberValid // Assuming you have a rollNumberValid3 state for member 3
                }
                helperText={
                  !rollNumberValid
                    ? "Invalid roll number"
                    : formSubmitted && member3Data.rollNumber === ""
                    ? "Roll Number is required"
                    : ""
                }
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                value={member3Data.email}
                onChange={(e) =>
                  handleInputChange(e, setMember3Data, setMember3Error)
                }
                sx={{ mb: 2 }}
                error={formSubmitted && member3Data.email === ""}
                helperText={
                  formSubmitted && member3Data.email === ""
                    ? "Email is required"
                    : ""
                }
              />

              <InputLabel sx={{ mt: 0, mb: 1 }}>
                Upload Transcript (jpg, png, or pdf)
              </InputLabel>
              <TextField
                fullWidth
                name="transcript3"
                value={member3Data.transcript}
                type="file"
                onChange={(e) =>
                  handleInputChange(
                    e,
                    setMember3Data,
                    setMember3Error,
                    setFile3
                  )
                }
                sx={{ mb: 2 }}
                error={formSubmitted && !file3}
                helperText={
                  formSubmitted && !file3 ? "Transcript is required" : ""
                }
              />

              <TextField
                fullWidth
                label="Previous Projects"
                name="previousProjects"
                multiline
                rows={4}
                value={member3Data.previousProjects}
                onChange={(e) =>
                  handleInputChange(e, setMember3Data, setMember3Error)
                }
                sx={{ mb: 2 }}
              />
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 1, padding: "20px" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mx: "auto", display: "block", mb: 7 }} // Center the button horizontally
            // onClick={Submit}
          >
            Submit
          </Button>
        </Box>
      </form>
    </>
  );
};

export default RequestPage;
