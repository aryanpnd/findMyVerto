const { Student } = require("../models/studentModels");

const getFriendList = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo})
        .populate("friends",{ password: 0, _id: 0})
        .select({_id:0,frinds:1})
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(500).send(`User doesn't exists in database, Login first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const getFriendRequests = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo})
        .populate("friendRequests",{ password: 0, _id: 0})
        .select({_id:0,friendRequests:1})
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(500).send(`User doesn't exists in database, Login first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const getSentFriendRequests = async (req, res) => {
    try {
        const user = await Student.findOne({ registrationNumber: req.regNo})
        .populate("sentFriendRequests",{ password: 0, _id: 0})
        .select({_id:0,sentFriendRequests:1})
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(500).send(`User doesn't exists in database, Login first`);
        }
    } catch (e) {
        res.status(500).send(e);
    }
}

const addFriend = async (req, res) => {
    const studentId = req.body.studentId;

    Student.findOne({ registrationNumber: req.regNo })
        .then(student => {
            // to check if the student (to whome send the friend req) is already present in his friend list or not 
            const isStudentInFriendList = student.friends.some(std => std.equals(studentId));

            // to check if the student (to whome send the friend req) is already present in his Sent list or not 
            const isStudentInSentList = student.sentFriendRequests.some(std => std.equals(studentId));
            
            console.log(isStudentInFriendList);
            console.log(isStudentInSentList);

            if (!isStudentInFriendList && !isStudentInSentList) {
                // searching the student to send request
                Student.findById(studentId)
                .then(toSendfrndReqStudent=>{
                    // saving the student into student request list to whome friend req will be send
                    toSendfrndReqStudent.friendRequests.push(student.id)
                    toSendfrndReqStudent.save()
                    .then(()=>{
                        // saving the student (to whome friend req will be send) into student sentrequest list
                        student.sentFriendRequests.push(toSendfrndReqStudent.id)
                        student.save()
                        .then(()=>{
                            res.send("Friend Request sent")
                        })
                        .catch((e)=>res.send("Error sending Friend request"))
                        return
                    })
                    .catch((e)=>res.send("Error sending Friend request"))
                    return
                })
            } 
            else if(isStudentInSentList){
                res.send({sent:false,msg:"Already sent"})
            }
            else {
                res.send('Already friends');
            }
        })
        .catch(error => {
            res.send({"error":error});
        });
}

module.exports = {getFriendList,getFriendRequests,getSentFriendRequests,addFriend}