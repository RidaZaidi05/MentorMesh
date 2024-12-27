import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";


const StudentHomePage = ({ _id, picturePath }) => {
  const color = { color: "red" };
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  return (
    <Box>
      <Navbar searchType='home' />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath}  userType = "Student" />
        </Box>
        

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
          </Box>
        )}


      </Box>
    </Box>

  );
};

const TeacherHomePage = ({ _id, picturePath }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const color = { color: "red" };
  return (
    
    <Box>
      <Navbar searchType='home' />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
        <UserWidget userId={_id} picturePath={picturePath}  userType="Teacher"/>
      </Box>
      

        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
          </Box>
        )}



      </Box>
    </Box>
  );
};

const HomePage = () => {

  const { _id, picturePath } = useSelector((state) => state.user);
  const role = useSelector((state) => state.userType);
  
  return role === 'student' ? (
    <StudentHomePage _id={_id} picturePath={picturePath} />
  ) : (
    <TeacherHomePage _id={_id} picturePath={picturePath} />
  );
};

export default HomePage;
