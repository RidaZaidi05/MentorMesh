import { subtle } from "crypto";
import Request from "../models/Request.js";
import Student from "../models/Student.js";
import path from 'path';
export const createRequest = async (req, res) => {
    
    try {
        
        const { postId, teacherId, title, member1Data, member2Data, member3Data } = req.body;
         
        // Construct an array of member data
        const membersData = [member1Data, member2Data, member3Data];
        

        const existingStudents = [];
        const nonExistingStudents = [];
        for (const memberData of membersData) {
            if (memberData) {
                const memberData_ = JSON.parse(memberData);
                
                const rollNumber  = memberData_.rollNumber;
                const student = await Student.findOne({ rollNo: rollNumber });
                
                if (student) {
                    existingStudents.push(student);
                } else {
                    nonExistingStudents.push(rollNumber);
                }
            }
        }
        
        // Handle the response
        if (nonExistingStudents.length === 0) {
            // console.log("All students exist");


            const newMembers = existingStudents.map((student, index) => {
                const memberData = membersData[index];
                const memberData_ = JSON.parse(memberData);
                
                
                return {
                    userId: student._id,
                    rollNo: student.rollNo,
                    firstName: student.firstName,
                    lastName: student.lastName,
                    email: student.email,
                    transcript: memberData_.transcript || '',
                    previousProjects: memberData_.previousProjects || '',
                    batch: student.batch,
                    degree: student.degree || '',
                    
                };
            });

            // Create a new Request object
            // const request = new Request({
            //     postId,
            //     teacherId,
            //     title,
            //     member1: newMembers[0],
            //     member2: newMembers[1],
            //     member3: newMembers[2],
            // });

            //  console.log(request);

            // // Save the request to the database
            //  await request.save();
            //  console.log("successfull");

            // Send a success response
            
            res.status(200).json({ message: 'Request created successfully'});
        } else {
            // console.log("Some students do not exist");
            res.status(400).json({ message: 'Some students do not exist', nonExistingStudents });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const createtrans = async (req, res) => {
    res.status(200).json({ message: 'transcript uploaded successfully' });
        
}
