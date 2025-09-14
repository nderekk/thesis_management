const asyncHandler = require("express-async-handler");
const {sequelize, users, blacklist, announcements, thesis_presentation,
  thesis, professor, student, thesis_topics
} = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op, fn, col, where } = require('sequelize');
const xmlparser = require("js2xmlparser");

// Helper function to format datetime as local time without timezone conversion
function formatLocalDateTime(dateTime) {
  if (!dateTime) return "";
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, '0');
  const day = String(dateTime.getDate()).padStart(2, '0');
  const hours = String(dateTime.getHours()).padStart(2, '0');
  const minutes = String(dateTime.getMinutes()).padStart(2, '0');
  const seconds = String(dateTime.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

//@desc Login User
//@route Post /api/user/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;
  if (!(email && password)){
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const loggedUser = await users.findOne({ where: {email: email} });
  // if (user && await bcrypt.compare(password, user.password)){
  if (loggedUser && password === loggedUser.password){
    const accessToken = jwt.sign({
      user: {
        role: loggedUser.role,
        email: loggedUser.email,
        id: loggedUser.id
      }
    }, 
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10h"}
    );
    let options = {
      maxAge: (20 * 60 * 1000)*100, // would expire in 20minutes
      httpOnly: true, // The cookie is only accessible by the web server
      secure: true,
    };
    res.cookie("SessionID", accessToken, options);
    res.status(200).json({
      "userRole": loggedUser.role, 
      "id": loggedUser.id,
      "email": loggedUser.email,
      "redirect": `/dashboard/${loggedUser.role}` 
    });
    console.log("mphkes bro");
  }else{
    res.status(401);
    throw new Error("Email or password incorrect");
  }
});

//@desc Logout User
//@route Post /api/user/logout
//@access Private
const logoutUser = asyncHandler(async (req, res) => {
  blacklist.create({
    token: req.token
  });
  res.status(200).json(`Antio ${req.user.role}`);
});

//@desc Get User
//@route Get /api/user/current
//@access Private
const getUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

//@desc Get announcements
//@route Get /api/user/announcements?from=yyyymmdd&to=yyyymmdd&format=type
//@access Public
const getAnnouncements = asyncHandler(async (req, res) => {
  const { from, to, format } = req.query;

  const anns = await announcements.findAll();

  const announcementsInfo = await Promise.all(anns.map(async ann => {
    const presentation_details = await thesis_presentation.findOne({
      attributes: ['date_time', 'presentation_type', 'venue'],
      where: { thesis_id: ann.thesis_id,
        [Op.and]: [
        where(fn('DATE', col('date_time')), {
          [Op.between]: [from, to]
      })
    ]
       }
    });

    if (!presentation_details) return null;
    
    const studentThesis = await thesis.findOne({where: {id: ann.thesis_id}});
    const topic = await thesis_topics.findOne({
      attributes: ['title'],
      where: {id: studentThesis.topic_id}
    });
    const stu = await student.findOne({
      attributes: ['first_name', 'last_name', 'am'], 
      where: {am: studentThesis.student_am}
    });
    // committee
    const supervisor = await professor.findOne({
      attributes: ["first_name" , "last_name", "am"],
      where: {am: studentThesis.supervisor_am}
    });
    const prof2 = await professor.findOne({
      attributes: ["first_name" , "last_name", "am"], 
      where: {am: studentThesis.prof2_am} 
    });
    const prof3 = await professor.findOne({
      attributes: ["first_name" , "last_name", "am"], 
      where: {am: studentThesis.prof3_am} 
    });
    const committeeMembers= [
      `${supervisor.first_name} ${supervisor.last_name}`,
      `${prof2.first_name} ${prof2.last_name}` ,
      `${prof3.first_name} ${prof3.last_name}` , 
    ];
    return {
      id: ann.id,
      announcementDate: formatLocalDateTime(ann.announcement_datetime),
      announcementContent: ann.announcement_content,
      presentation: {
        date: formatLocalDateTime(presentation_details.date_time),
        type: presentation_details.presentation_type,
        venue: presentation_details.venue,
      },
      student: {
        firstName: stu.first_name,
        lastName: stu.last_name,
        am: stu.am,
      },
      topic: {
        title: topic.title,
      },
      committee: committeeMembers,
    };
  }));

  const announcementList = announcementsInfo.filter(Boolean);


  if (announcementList && format === "json")
    res.status(200).json(announcementList);
  else if (announcementList && format === "xml"){
    const xml = xmlparser.parse("announcements",announcementList);
    res.set("Content-Type", "application/xml").send(xml);
  }
  else res.status(200).json({});
});


module.exports = { loginUser, logoutUser, getUser, getAnnouncements };