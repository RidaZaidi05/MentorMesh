import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentUser = ({ user, picturePath, palette }) => {
  const dark = palette.text.primary;
  const { firstName, lastName, email, rollNo, degree, passingyear } = user;

  return (
    <WidgetWrapper>
      {/* Image */}
      <Box display="flex" justifyContent="center" alignItems="center" pb="2rem">
        <UserImage image={picturePath} size="100px" />
      </Box>

      {/* Name */}
      <Typography
        variant="h4"
        color={dark}
        fontWeight="500"
        textAlign="center"
        pb="1rem"
        // sx={{
        //   "&:hover": {
        //     color: palette.primary.light,
        //     cursor: "pointer",
        //   },
        // }}
      >
        {firstName} {lastName}
      </Typography>

      <Divider sx={{ mb: "1rem" }} />

      {/* Email */}
      <Box>
        <FlexBetween gap="1rem" justifyContent="flex-start">
          <Typography color={dark} fontWeight="bold">Email:</Typography>
          <Typography color={dark}>{email}</Typography>
        </FlexBetween>
      </Box>
      <Divider sx={{ mb: "1rem" }} />

      {/* Roll No */}
      <Box>
        <FlexBetween gap="0.2rem" justifyContent="flex-start" alignItems="center">
          <Typography color={dark} fontWeight="bold" >Roll No:</Typography>
          <Typography color={dark}>{rollNo}</Typography>
        </FlexBetween>
      </Box>
      <Divider sx={{ mb: "1rem" }} />

      {/* Degree */}
      <Box>
        <FlexBetween gap="0.2rem" justifyContent="flex-start">
          <Typography color={dark} fontWeight="bold" sx={{ minWidth: "120px" }}>Degree:</Typography>
          <Typography color={dark}>{degree}</Typography>
        </FlexBetween>
      </Box>
      <Divider sx={{ mb: "1rem" }} />

      {/* Passing Year */}
      <Box>
        <FlexBetween gap="0.2rem" justifyContent="flex-start">
          <Typography color={dark} fontWeight="bold" sx={{ minWidth: "120px" }}>Passing Year:</Typography>
          <Typography color={dark}>{passingyear}</Typography>
        </FlexBetween>
      </Box>
      <Divider sx={{ mb: "1rem" }} />

    </WidgetWrapper>
  );
}

const TeacherUser = ({ user, picturePath, palette  , userID}) => {
  const navigate = useNavigate();
  const dark = palette.text.primary;
  const { firstName, lastName, email, areaofInterest, designation, education, researches } = user;

  const renderArrayData = (data) => {
    if (!data || data.length === 0) {
      return "N/A";
    } else {
      return (
        <ul style={{ margin: 0, paddingInlineStart: "1rem" }}>
          {data.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
  };

  return (
    <WidgetWrapper>
      {/* Image */}
      <Box display="flex" justifyContent="center" alignItems="center" pb="2rem">
        <UserImage image={user.picturePath} size="100px" />
      </Box>

      <Box
          onClick={() => {
           
            navigate(`/profile/${userID}`);
          }}
          >
      <Typography
        variant="h4"
        color={dark}
        fontWeight="500"
        textAlign="center"
        pb="0.5rem"
        sx={{
          "&:hover": {
            color: palette.primary.light,
            cursor: "pointer",
          },
        }}
      >
        {firstName} {lastName}
      </Typography>
      </Box>

      {/* Designation */}
      <Typography
        variant="subtitle1"
        color={dark}
        textAlign="center"
        pb="1rem"
      >
        {designation}
      </Typography>

      <Divider sx={{ mb: "1rem" }} />

      {/* Email */}
      <Box>
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          <Typography color={dark} fontWeight="bold" mr="1rem">Email:</Typography>
          <Typography color={dark}>{email}</Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: "1rem" }} />

      {/* Education */}
      <Box>
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
          <Typography color={dark} fontWeight="bold" mb="0.5rem">Education:</Typography>
          <Typography color={dark}>{renderArrayData(education)}</Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: "1rem" }} />

      {/* Area of Interest */}
      <Box>
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
          <Typography color={dark} fontWeight="bold" mb="0.5rem">Area of Interest:</Typography>
          <Typography color={dark}>{renderArrayData(areaofInterest)}</Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: "1rem" }} />

      {/* Researches */}
      <Box>
        <Box display="flex" flexDirection="column" justifyContent="flex-start" alignItems="flex-start">
          <Typography color={dark} fontWeight="bold" mb="0.5rem">Researches:</Typography>
          <Typography color={dark}>{renderArrayData(researches)}</Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: "1rem" }} />

    </WidgetWrapper>
  );
}



const UserWidget = ({ userId, picturePath, userType }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  // const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  


  const getUser = async () => {
    const queryParams = new URLSearchParams({ userType }); // Create query parameters
    const url = `${process.env.BACKEND_URL}/users/${userId}?${queryParams.toString()}`; // Append userType to the URL
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, [userId]);

  if (!user) {
    return null;
  }
  return (
    <Box>
      {userType === "Student" ? (

        <StudentUser user={user} picturePath={picturePath} palette={palette} />
      ) : (

        <TeacherUser user={user} picturePath={picturePath} palette={palette} userID={userId} />
      )}
    </Box>
  );
};






export default UserWidget;
