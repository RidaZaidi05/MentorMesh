import React from 'react';
import { Typography, Avatar, Divider, useTheme } from '@mui/material';
import { Box } from '@mui/system'; // Import Box component for styling

const TeacherList = ({ teachers, onSelectTeacher }) => {
    const theme = useTheme(); // Access the theme object

    const handleClick = (name) => {
        onSelectTeacher(name);
    };

    return (
        <Box className="teacher-list" sx={{ padding: '16px', backgroundColor: theme.palette.background.paper }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}> {/* Make the word "Teachers" bold */}
                Teachers
            </Typography>
            <Divider />
            <Box className="teacher-list-content" sx={{ marginTop: '16px' }}>
                {teachers.slice(0, 7).map((teacher, index) => (
                    <Box
                        key={index}
                        className="teacher-item"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '8px',
                            borderRadius: '8px',
                            boxShadow: theme.palette.mode === 'dark' ? '0px 0px 10px rgba(255, 255, 255, 0.2)' : '0px 0px 10px rgba(0, 0, 0, 0.2)',
                            transformStyle: 'preserve-3d', // Apply 3D effect
                            transition: 'transform 0.3s ease', // Add transition effect
                            '&:hover': {
                                transform: 'scale(1.05) rotateX(5deg) rotateY(5deg)', // Apply rotation and scaling on hover
                            },
                            margin: '16px 0', // Add space downward
                        }}
                    >
                        <Avatar src= {`${process.env.BACKEND_URL}/assets/${teacher.picturePath}`} />
                        <Box sx={{ flex: 1 }}>
                            <Typography
                                variant="body1"
                                component="a"
                                href="#"
                                onClick={() => handleClick(`${teacher.firstName} ${teacher.lastName}`)}
                                sx={{
                                    width: '300px',
                                    textDecoration: 'none',
                                    color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.main,
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        color: theme.palette.primary.main, // Add underline effect on hover
                                    },
                                }}
                            >
                                {`${teacher.firstName} ${teacher.lastName}`}
                            </Typography>
                            <Typography
                                variant="body2"
                                className="teacher-interests"
                                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                            >
                                {Array.isArray(teacher.areaofInterest) && teacher.areaofInterest.length > 0
                                    ? teacher.areaofInterest.join(', ')
                                    : 'No interests listed'}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default TeacherList;
