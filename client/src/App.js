import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "scenes/homePage";
import NotifyPage from "scenes/notifyPage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import RequestPage from "scenes/requestPage";
import OpenChat from "scenes/chatPage";
import PeopleAndPosts from "scenes/PeopleAndPost/PeopleAndPosts";
import RequestApproval from "scenes/approveRequest";
import StudentNotifyPage from "scenes/notifyStudentPage";

// import OpenChat from "scenes/chatPage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import ForgotPassword from "scenes/Forgot-Password/forgot-password";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
    
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/Notification"
              element={isAuth ? <NotifyPage /> : <Navigate to="/" />}
            />
            {/* RequestApproval */}

            <Route
              path="/StudentNotification"
              element={isAuth ? <StudentNotifyPage /> : <Navigate to="/" />}
            />

            <Route
              path="/RequestApproval"
              element={isAuth ? <RequestApproval /> : <Navigate to="/" />}
            />
            
            <Route
              path="/OpenChat"
              element={isAuth ? <OpenChat /> : <Navigate to="/" />}
            /> 

            <Route
              path="/PeopleAndPosts"
              element={isAuth ? <PeopleAndPosts /> : <Navigate to="/" />}
            /> 

            
            <Route
              path="/request_form"
              element={isAuth ? <RequestPage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage userType={"None"}/> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
     
    </div>
  );
}

export default App;
