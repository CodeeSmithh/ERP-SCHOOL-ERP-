const express = require('express');
const router = express.Router();
const axios = require('axios');

const Class = require('../models/classe');
const User = require('../models/user_login_info');
const UserMoreInfo = require("../models/user_more_info");
const AllPosts = require("../models/post");
const tweet = require("../models/tweet");
const Assigment_Data = require('../models/Assigment_Schema.js');
const Attandance_sumary = require("../models/Attandance_sumary");
const Attendance = require("../models/Attandance");
const StressData = require("../models/Student_stress");

const upload = require("../middleware/uploads");
const ensureAuth = require("../middleware/auth");
const getStressPrediction = require("../middleware/StressPredict");

const timeAgo = (date) => {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hrs ago`;
    return `${days} days ago`;
};

const today = new Date();
const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });

router.use(ensureAuth, (req, res, next) => {
    req.userId = req.session.userId;
    req.registrationId = req.session.registrationId;
    req.className = req.session.className;
    next();
});

router.get("/Student/profile", async (req, res) => {
    try {
        const user = await User.findOne({ Registration_Id: req.registrationId }).lean();
        if (!user) {
            return res.status(404).send("User not found");
        }
        const user_info = await UserMoreInfo.findOne({ User_id: user._id }).lean();

        if (dayName === 'Monday') {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);

            const todaysEntries = await StressData.find({
                user_id: req.userId,
                createdAt: { $gte: todayStart, $lte: todayEnd }
            });

            if (todaysEntries.length === 0) {
                return res.render('Student_Stress_Survey.ejs', { userId: req.userId });
            } else {
                return res.render("Student_profile.ejs", { user, user_info, timeAgo });
            }
        } else {
            return res.render("Student_profile.ejs", { user, user_info, timeAgo });
        }
    } catch (err) {
        console.error("Error in profile route:", err);
        return res.status(500).send("Server Error");
    }
});

router.get("/student/profile/profileEdit", async (req, res) => {
    try {
        const OwnerInfo = await User.findById(req.userId).lean();
        const Owner_2 = await UserMoreInfo.findOne({ User_id: req.userId }).lean();
        res.render("Student_profileEdit.ejs", { OwnerInfo, Owner_2 });
    } catch (err) {
        console.error("Error fetching profile for editing:", err);
        res.status(500).send("Server error.");
    }
});

router.get("/Student/tweets", async (req, res) => {
    try {
        const { registrationId, className, userId } = req;
        const classUsers = await User.find({ class: className }, '_id').lean();
        const classTeacher = await User.find({ ClassTeacher: className }, '_id').lean();
        const userIds = [
            ...classUsers.map(user => user._id.toString()),
            ...classTeacher.map(teacher => teacher._id.toString())
        ];

        const [tweets, userInfos, user_role] = await Promise.all([
            tweet.find({ User_id: { $in: userIds } }).sort({ date: -1 }).lean(),
            UserMoreInfo.find({ User_id: { $in: userIds } }).lean(),
            User.findOne({ Registration_Id: registrationId }).lean()
        ]);

        const userInfoMap = new Map(userInfos.map(info => [info.User_id.toString(), info]));

        const enrichedTweets = tweets.map(t => {
            const info = userInfoMap.get(t.User_id.toString()) || {};
            return {
                ...t,
                username: info.username || "Unknown",
                profile_img: info.profile_img || "default.png"
            };
        });

        res.render("Student_tweet.ejs", {
            Tweets: enrichedTweets,
            registrationId,
            className,
            userId,
            user_role,
            timeAgo
        });
    } catch (err) {
        console.error("Error fetching tweets:", err);
        res.status(500).send("Server error.");
    }
});

router.get('/Student/subjects', async (req, res) => {
    try {
        const student = await User.findById(req.userId).lean();
        if (!student) {
            return res.status(404).send("Student not found.");
        }
        const classDoc = await Class.findOne({ name: student.class }).lean();
        res.render('Student_Subject.ejs', {
            className: student.class,
            classDoc
        });
    } catch (err) {
        console.error("Error fetching subjects:", err);
        res.status(500).send('Server error.');
    }
});

router.get('/Student/Posts', async (req, res) => {
    try {
        const { userId, className } = req;
        const classUsers = await User.find({ class: className }, '_id').lean();
        const classTeacher = await User.find({ ClassTeacher: className }, '_id').lean();
        const userIds = [
            ...classUsers.map(user => user._id.toString()),
            ...classTeacher.map(teacher => teacher._id.toString())
        ];

        const [Posts, userInfos, user] = await Promise.all([
            AllPosts.find({ User_id: { $in: userIds } }).sort({ date: -1 }).lean(),
            UserMoreInfo.find({ User_id: { $in: userIds } }).lean(),
            User.findById(userId).lean()
        ]);
        res.render('Student_posts.ejs', { Posts, timeAgo, user, userInfos });
    } catch (err) {
        console.error("Error fetching posts:", err);
        res.status(500).send("Server error.");
    }
});

router.get('/student/add-post', async (req, res) => {
    try {
        const { registrationId, className, userId } = req;
        const [userInfo, user_role] = await Promise.all([
            UserMoreInfo.findOne({ User_id: userId }).lean(),
            User.findOne({ Registration_Id: registrationId }).lean()
        ]);
        res.render('Student_AddPost', {
            registrationId,
            className,
            userId,
            userInfo,
            user_role
        });
    } catch (err) {
        console.error("Error loading add-post page:", err);
        res.status(500).send("Server error.");
    }
});

router.get('/Student/Attandance', async (req, res) => {
    try {
        const { registrationId, className } = req;
        const [summary, result] = await Promise.all([
            Attandance_sumary.find({ student_id: registrationId }).lean(),
            Attendance.aggregate([
                { $match: { "students.student_Id": registrationId } },
                {
                    $project: {
                        date: 1,
                        class: 1,
                        student: {
                            $filter: {
                                input: "$students",
                                as: "stu",
                                cond: { $eq: ["$$stu.student_Id", registrationId] }
                            }
                        }
                    }
                }
            ])
        ]);
        res.render("Student_Attandance.ejs", { summary, className, result });
    } catch (err) {
        console.error("Error loading attendance:", err);
        res.status(500).send("Server error.");
    }
});

router.get('/Student/Assigment', async (req, res) => {
    try {
        const Assigments = await Assigment_Data.find({ className: req.className }).lean();
        res.render('Student_Assigment.ejs', { Assigments, className: req.className });
    } catch (err) {
        console.error("Error fetching assignments:", err);
        res.status(500).send("Server error.");
    }
});

router.get('/Student/Stress-Data', async (req, res) => {
    try {
        const latestEntry = await StressData.find({ user_id: req.userId });
        if (!latestEntry) {
            return res.render("Student_Stress_data", { data: null });
        }
        res.render("Student_Stress_data", { entries: latestEntry });
    } catch (err) {
        console.error("Error fetching stress data/prediction:", err);
        res.status(500).send("Server error.");
    }
});

router.post('/stress-predictor', async (req, res) => {
    const { studentId, sleepHours, studyHours, exerciseDays, socialMediaHours } = req.body;
    if (!studentId || !sleepHours || !studyHours || !exerciseDays || !socialMediaHours) {
        return res.status(400).send('Missing required survey data.');
    }

    try {
        const FLASK_API_URL = "https://cb680af6b10f.ngrok-free.app/predict-stress";
 
        const apiPayload = {
            sleepHours,
            studyHours,
            exerciseDays,
            socialMediaHours
        };

        const response = await axios.post(FLASK_API_URL, apiPayload);
        const predictedStressLevel = response.data.stressLevel;

        const newData = new StressData({
            user_id: studentId,
            sleepHours,
            studyHours,
            exerciseDays,
            socialMediaHours,
            stressLevel: predictedStressLevel
        });

        await newData.save();
        return res.redirect('/Student/Stress-Data');
    } catch (err) {
        console.error('Error in stress predictor route:', err.message);
        return res.status(500).send('An error occurred while processing your request.');
    }
});

module.exports = router;