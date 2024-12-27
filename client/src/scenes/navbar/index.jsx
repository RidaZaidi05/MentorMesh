import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
  Margin,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state"; // Import setSelectedGroupObject action
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { useToast } from "@chakra-ui/toast";
import { Badge } from "@mui/material";
import GroupsSearch from '../widgets/GroupWidget';
import SearchList from "./dropDown";
import FlexBetweenColumn from "../../components/FlexBetweenColumn";
import OpenChat from "../chatPage/index";
import { setSelectedGroupObject } from "../../state/index";


import io from 'socket.io-client';
var unreadNotifications;
var unreadforStudents;
const socket = io(`${process.env.SOCKET_URL}`);
const Navbar = (props) => {

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const [type, setType] = useState(props.searchType);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [currentMemberGroups, setCurrentMemberGroups] = useState([]);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  const toast = useToast();
  const fullName = `${user.firstName} ${user.lastName}`;
  const token = useSelector((state) => state.token);
  const [GroupObject, setGroupObject] = useState(null); // State to hold the selected group object
  const [messagesCount, setMessagesCount] = useState(0);
  const [messageNotify, setMessageNotify] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedTecher, setSelectedTeacher] = useState(null);
  const role = useSelector((state) => state.userType);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");



  const [notificationCount, setNotificationCount] = useState(0);

  let tooltipTitle = '';
  if (type === 'chat' || type === undefined) {
    tooltipTitle = 'Search your groups';
  }
  if (type === 'home' || type === 'profile') {
    tooltipTitle = 'Explore other instructors';
  }
  const handleNotificationClick = () => {

    if (role === "teacher") {
      navigate(`/Notification`, { state: { unreadNotifications: unreadNotifications } });
    }
    else {
      navigate(`/StudentNotification`, { state: { unreadNotifications: unreadforStudents } });
    }

  };

  const handleMessageClick = () => {
    //   const groupedNotifications = messageNotify.reduce((acc, notification) => {
    //     const key = `${notification.userId}_${notification.conversationId}_${notification.groupName}`;
    //     if (!acc[key]) {
    //         acc[key] = { ...notification, count: 1 };
    //     } else {
    //         acc[key].count++;
    //     }
    //     return acc;
    // }, {});

    //console.log('gorup count is : ' , groupedNotifications);

    const deleteMessageNotifications = async () => {
      try {
        const userId = user._id;
        const requestBody = {
          userId: userId
        };

        const response = await fetch(`${process.env.BACKEND_URL}/chats/message/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error("Failed to delete message notifications");
        }

        const res = await response.json();
      } catch (error) {
        console.error("Error deleting message notifications:", error.message);
      }
    };

    deleteMessageNotifications();


    setMessagesCount(0);

    navigate(`/OpenChat`);

  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuToggled(!isMobileMenuToggled);
  };

  const renderMobileMenu = () => (
    <Box
      position="absolute"
      top="80px"
      left="0"
      width="100%"
      backgroundColor={alt}
      zIndex={999}
      boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
      borderRadius="0.5rem"
      marginTop="0.5rem"
    >

      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        flexWrap={isSmallScreen ? "wrap" : "nowrap"}
      >
        <IconButton onClick={() => dispatch(setMode())}>
          {theme.palette.mode === "dark" ? (
            <DarkMode sx={{ fontSize: "25px" }} />
          ) : (
            <LightMode sx={{ color: dark, fontSize: "25px" }} />
          )}
        </IconButton>
        <MenuItem onClick={handleMessageClick}>
          <Badge badgeContent={messagesCount} color="error">
            <Message sx={{ fontSize: "25px" }} />
          </Badge>
        </MenuItem>
        <MenuItem onClick={handleNotificationClick}>
          <Badge badgeContent={notificationCount} color="error">
            <Notifications sx={{ fontSize: "25px" }} />
          </Badge>
        </MenuItem>
        <MenuItem>
          <Help sx={{ fontSize: "25px" }} />
        </MenuItem>
        <MenuItem>
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>
      </Box>

      <Box padding="0.5rem 1rem" display="flex" justifyContent="center">

        <SearchList searchData={searchResult} onSelectGroup={handleSelectGroup} onSelectTeacher={handleSelectTeacher} pageType={type} />
      </Box>
      {/* Include the search functionality */}

    </Box>
  );





  const handleSelectGroup = (groupName) => {
    setSelectedGroup(groupName); // Update the selectedGroup state with the selected group name
    const GroupObject = currentMemberGroups.find(group => group.groupName === groupName);
    if (GroupObject) {
      setGroupObject(GroupObject); // Pass the selected group object to the state
      dispatch(setSelectedGroupObject(GroupObject));
    }
  };

  const handleSelectTeacher = (teacherName) => {
    setSelectedTeacher(teacherName); // Update the selectedGroup state with the selected group name

    const lastSpaceIndex = teacherName.lastIndexOf(' ');
    const firstName = teacherName.substring(0, lastSpaceIndex);
    const lastName = teacherName.substring(lastSpaceIndex + 1);

    const teacherObject = teachers.find(obj => obj.firstName === firstName && obj.lastName === lastName);

    if (teacherObject) {
      const userId = teacherObject._id;

      navigate(`/profile/${userId}`);
    }
  };





  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  const goForSearch = async () => {

    setLoading(true); // Set loading state to true while fetching

    try {
      // Make a fetch request to the backend API to search for users
      if (type === 'home' || type === undefined || type === 'profile') {
        const response = await fetch(`${process.env.BACKEND_URL}/chats/users`, {
          method: 'GET'

        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setTeachers(data);

        const teacherNames = data.map(person => `${person.firstName} ${person.lastName}`);


        const filteredData = teacherNames.filter(name => {
          // Check if the search term exists in any part of the name, ignoring case sensitivity
          return name.toLowerCase().includes(search.toLowerCase());
        });
        setSearchResult(filteredData);
      }
      else if (type === 'chat') {
        const response = await fetch(`${process.env.BACKEND_URL}/chats/groups`, {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch groups');
        }

        const data = await response.json();

        // Filter groups based on whether user._id is included in the members array
        const filteredData = data.filter(group => {
          return group.members.includes(user._id);
        });

        setCurrentMemberGroups(filteredData);


        // Extract only the group names from the filtered data
        const groupNames = filteredData.map(group => group.groupName);

        const filteredAccordingToSearch = groupNames.filter(group => {
          // Check if the search term exists in any part of the group name, ignoring case sensitivity
          return group.toLowerCase().includes(search.toLowerCase());
        });



        setSearchResult(filteredAccordingToSearch);

      }



    } catch (error) {
      console.error('Error searching for users:', error.message);

    }

    setLoading(false); // Reset loading state after fetching
  };

  useEffect(() => {
    goForSearch(); // Call goForSearch function when the component mounts

  }, [SearchList]);


  useEffect(() => {
    const fetchMessageNotifications = async () => {
      try {
        // Fetch all message notifications
        const response = await fetch(`${process.env.BACKEND_URL}/chats/message/`, {
          method: 'GET'

        });
        if (!response.ok) {
          throw new Error("Failed to fetch message notifications");
        }
        const messageNotifications = await response.json();



        const filteredMessageNotifications = messageNotifications.filter(
          (notification) => notification.userId === user._id
        );

        setMessageNotify(filteredMessageNotifications);
        // Update the notification count state with the count of filtered message notifications
        setMessagesCount(filteredMessageNotifications.length);


      } catch (error) {
        console.error("Error fetching message notifications:", error.message);
      }
    };

    fetchMessageNotifications();
  }, []);


  useEffect(() => {
    // Define the fetchNotifications function

    const fetchNotifications = async () => {
      try {
        // Make a fetch request to get notifications for the logged-in user
        const response = await fetch(`${process.env.BACKEND_URL}/notification/${user._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const notifications = await response.json();

        // Calculate the number of unread notifications
        unreadNotifications = notifications.filter(
          (notification) => !notification.read
        );
        const unreadCount = unreadNotifications.length;

        // Update the notification count state
        setNotificationCount(unreadCount);

        // Log the received notification
      } catch (error) {
        console.error("Error fetching notifications:", error.message);
      }
    };


    const fetchStudentNotifications = async () => {
      try {

        const response = await fetch(`${process.env.BACKEND_URL}/studentnotification/${user._id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student notifications");
        }
        const notifications = await response.json();


        unreadforStudents = notifications.filter(notification => !notification.read);


        setNotificationCount(unreadforStudents.length);
      } catch (error) {
        console.error("Error fetching student notifications:", error.message);
      }
    };






    if (role === "teacher") {
      fetchNotifications();
    } else if (role === "student") {
      fetchStudentNotifications();
    }

    socket.on('notification', () => {
      if (role === "teacher") {
        fetchNotifications();
      } else if (role === "student") {
        fetchStudentNotifications();
      }
    });


    return () => {
      socket.off('notification');
    };

  }, [user._id, role, socket]);

  return (
    <>
      <FlexBetweenColumn backgroundColor={alt}>
        <FlexBetween padding="1rem 6%" backgroundColor={alt}>
          <FlexBetween gap="1.75rem" alignItems="center"  >
            <Typography
              fontWeight="bold"
              fontSize="clamp(1rem, 2rem, 2.25rem)"
              color="primary"
              onClick={() => navigate("/home")}
              sx={{
                "&:hover": {
                  color: primaryLight,
                  cursor: "pointer",
                },
              }}
            >
              MentorMesh
            </Typography>
            {isNonMobileScreens && (

              <SearchList searchData={searchResult} onSelectGroup={handleSelectGroup} onSelectTeacher={handleSelectTeacher} pageType={type} />

            )

            }

          </FlexBetween>

          {/* Remaining Navbar Content */}
          {/* DESKTOP NAV */}

          {isNonMobileScreens ? (
            <FlexBetween gap="2rem">
              <IconButton onClick={() => dispatch(setMode())}>
                {theme.palette.mode === "dark" ? (
                  <DarkMode sx={{ fontSize: "25px" }} />
                ) : (
                  <LightMode sx={{ color: dark, fontSize: "25px" }} />
                )}
              </IconButton>

              {/* My chat icon is here */}
              <IconButton onClick={handleMessageClick}>
                <Badge badgeContent={messagesCount} color="error">
                  <Message sx={{ fontSize: "25px" }} />
                </Badge>
              </IconButton>

              <IconButton onClick={handleNotificationClick}>
                <Badge badgeContent={notificationCount} color="error">
                  <Notifications sx={{ fontSize: "25px" }} />
                </Badge>
              </IconButton>
              <Help sx={{ fontSize: "25px" }} />
              <FormControl variant="standard" value={fullName}>
                <Select
                  value={fullName}
                  sx={{
                    backgroundColor: neutralLight,
                    width: "150px",
                    borderRadius: "0.25rem",
                    p: "0.25rem 1rem",
                    "& .MuiSvgIcon-root": {
                      pr: "0.25rem",
                      width: "3rem",
                    },
                    "& .MuiSelect-select:focus": {
                      backgroundColor: neutralLight,
                    },
                  }}
                  input={<InputBase />}
                >
                  <MenuItem value={fullName}>
                    <Typography>{fullName}</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
                </Select>
              </FormControl>
            </FlexBetween>
          ) : (

            <>
              {!isMobileMenuToggled ? (
                <FlexBetween padding="1rem 6%" backgroundColor={alt}>
                  <IconButton onClick={handleMobileMenuToggle}>
                    <Menu />
                  </IconButton>
                </FlexBetween>
              ) : (
                <FlexBetween flexDirection="column" padding="1rem 6%" backgroundColor={alt}>
                  <IconButton onClick={handleMobileMenuToggle}>
                    <Close />
                  </IconButton>
                  {renderMobileMenu()}
                </FlexBetween>
              )}
            </>
          )}




        </FlexBetween>
      </FlexBetweenColumn >

    </>
  );

};

export default Navbar;
