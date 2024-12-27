import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box sx={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      // boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)"
    }}>
      <img
       style={{
        width: "100%",
        height:"auto",
        objectFit: "cover",
      }}

        width={size}
        height={size}
        alt="user"
        src={`${process.env.BACKEND_URL}/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
