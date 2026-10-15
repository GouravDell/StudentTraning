const express = require("express");
const router = express.Router();
const { createCourse, getAllCourses, getCourseById, updateCourse, deleteCourse, updateCourseStatus, getAllCourseRequests } = require("../controllers/courseController");
const verifyToken = require("../utils/verifyToekn");
const isAdmin = require("../middleware/isAdmin");

router.post("/createCourse", verifyToken, createCourse);
router.get("/getAllCourse", verifyToken, getAllCourses);
router.get(
    "/requests",
    verifyToken,
    getAllCourseRequests
);
router.get(
    "/:id",
    verifyToken,
    getCourseById
);

router.patch(
    "/:id/status",
    verifyToken,
    isAdmin,
    updateCourseStatus
);

// UPDATE COURSE - Admin only
router.put(
    "/:id",
    verifyToken,
    isAdmin,
    updateCourse
);

// DELETE COURSE - Admin only
router.delete(
    "/:id",
    verifyToken,
    isAdmin,
    deleteCourse
);

module.exports = router;