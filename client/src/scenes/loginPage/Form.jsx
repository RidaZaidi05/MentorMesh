import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import Swal from "sweetalert2";


const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  rollNo: yup.string().required("required"),
  degree: yup.string().required("required"),
  picture: yup.string().required("required"),
  passingyear: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  rollNo: "",
  degree: "",
  picture: "",
  passingyear: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {

    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append("picturePath", values.picture.name);

    const savedUserResponse = await fetch(
      `${process.env.BACKEND_URL}/auth/register`,
      {
        method: "POST",
        body: formData,
      }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm();

    if (savedUser) {
      setPageType("login");
    }
  };

  const login = async (values, onSubmitProps) => {
    const loggedInResponse = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    

    if (loggedInResponse.status === 400) {
      const errorResponse = await loggedInResponse.json();
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorResponse.msg || "An error occurred while logging in.",
      });
    } else {
      const loggedIn = await loggedInResponse.json();
     
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
          userType: values.userType,
        })
      );
      navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="rollNo"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.rollNo}
                  name="rollNo"
                  error={Boolean(touched.rollNo) && Boolean(errors.rollNo)}
                  helperText={touched.rollNo && errors.rollNo}
                  sx={{ gridColumn: "span 4" }}
                />

                <TextField
                  label="degree"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.degree} // Assuming researches is a string
                  name="degree"

                  variant="outlined"
                  error={Boolean(touched.degree) && Boolean(errors.degree)}
                  helperText={touched.degree && errors.degree}
                  sx={{ gridColumn: "span 4", width: "100%" }} // Adjust the width as needed
                />

                <TextField
                  label="passingYear"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.passingyear} // Assuming researches is a string
                  name="passingyear"

                  variant="outlined"
                  error={Boolean(touched.passingyear) && Boolean(errors.passingyear)}
                  helperText={touched.passingyear && errors.passingyear}
                  sx={{ gridColumn: "span 4", width: "100%" }} // Adjust the width as needed
                />


                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>

              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            <RadioGroup
              aria-label="userType"
              name="userType"
              value={values.userType}
              onChange={handleChange}
              sx={{
                gridColumn: "span 4",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "1rem", // Adjust margin as needed
                marginRight: "1rem", // Adjust margin as needed
              }}
            >
              <FormControlLabel
                value="student"
                control={<Radio sx={{ color: palette.primary.main }} />}
                label="Student"
                sx={{ flexGrow: 1 }}
              />
              <FormControlLabel
                value="teacher"
                control={<Radio sx={{ color: palette.primary.main }} />}
                label="Teacher"
                sx={{ flexGrow: 1 }}
              />
            </RadioGroup>

          </Box>


          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
           {/* <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography> */}

            <Typography
            onClick={() => {
              // Navigate to the "Forgot Password" page
              navigate("/forgot-password");
            }}
            sx={{
              textDecoration: "underline",
              color: palette.primary.main,
              "&:hover": {
                cursor: "pointer",
                color: palette.primary.light,
              },
            }}
          >
            Forgot Password?
          </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
