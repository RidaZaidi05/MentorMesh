import React  , { useState , useEffect} from 'react'
import { Box, useMediaQuery } from "@mui/material";
import { useSelector  } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";


import AdvertWidget from "scenes/widgets/AdvertWidget";

import TeacherList from './TeacherList'; 
import { useLocation } from 'react-router-dom';

import Posts from './Posts';

const StudentHomePage = ({ _id, picturePath , teachers , posts }) => {
    const navigate = useNavigate();
    const color = { color: "red" };
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const handleSelectTeacher = (teacherName) => {
        // setSelectedTeacher(teacherName); // Update the selectedGroup state with the selected group name
     
         const lastSpaceIndex = teacherName.lastIndexOf(' ');
         const firstName = teacherName.substring(0, lastSpaceIndex);
         const lastName = teacherName.substring(lastSpaceIndex + 1);
     
         const teacherObject = teachers.find(obj => obj.firstName === firstName && obj.lastName === lastName);
     
         if (teacherObject) {
           const userId = teacherObject._id;
           
           navigate(`/profile/${userId}`);
         }
     };

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
            <TeacherList teachers={teachers} onSelectTeacher={handleSelectTeacher}/>
            <Posts posts = {posts}/>
            {/* // Write code here  */}
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
  
  const TeacherHomePage = ({ _id, picturePath , teachers , posts}) => {
    const navigate = useNavigate();
    const handleSelectTeacher = (teacherName) => {
        // setSelectedTeacher(teacherName); // Update the selectedGroup state with the selected group name
     
         const lastSpaceIndex = teacherName.lastIndexOf(' ');
         const firstName = teacherName.substring(0, lastSpaceIndex);
         const lastName = teacherName.substring(lastSpaceIndex + 1);
     
         const teacherObject = teachers.find(obj => obj.firstName === firstName && obj.lastName === lastName);
     
         if (teacherObject) {
           const userId = teacherObject._id;
           
           navigate(`/profile/${userId}`);
         }
     };
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
            <TeacherList teachers={teachers} onSelectTeacher={handleSelectTeacher} />
            <Posts posts = {posts}/>
            
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


const PeopleAndPosts = () => {
    const { _id, picturePath } = useSelector((state) => state.user);
    const role = useSelector((state) => state.userType);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    const [teachers, setTeachers] = useState([]);
    const [posts , setPosts] = useState([]);
        
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/chats/users`);
                if (!response.ok) {
                    throw new Error('Failed to fetch teachers');
                }
                const data = await response.json();
                
                setTeachers(data); // Assuming the response has a 'teachers' array
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/posts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchTeachers();
        fetchPosts();
    }, []);

    

    const filterTeachers = (teachers, searchQuery) => {
        if (!searchQuery) {
            return teachers; // Return all teachers if no search query provided
        }
    
        return teachers.filter((teacher) => {
            // Check if the search query exists in any of the specified fields
            const includesSearchQuery = [
                ...teacher.areaofInterest,
                ...teacher.researches,
                ...teacher.education,
            ].some((field) => field.toLowerCase().includes(searchQuery.toLowerCase()));
    
            return includesSearchQuery;
        });
    };

    const filterPosts = (posts, searchQuery) => {
        if (!searchQuery) {
            return posts; // Return all posts if no search query provided
        }
    
        return posts.filter((post) => {
            // Check if the search query exists in any of the specified fields
            const includesSearchQuery =
                (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (post.title && post.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
            return includesSearchQuery;
        });
    };
    

    

    

    const filteredTeachers = filterTeachers(teachers, searchQuery);
    const filteredPosts = filterPosts(posts, searchQuery);
    return role === 'student' ? (
        <StudentHomePage _id={_id} picturePath={picturePath} teachers={filteredTeachers} posts = {filteredPosts} />
    ) : (
        <TeacherHomePage _id={_id} picturePath={picturePath} teachers={filteredTeachers} posts = {filteredPosts}/>
    );
}

export default PeopleAndPosts
