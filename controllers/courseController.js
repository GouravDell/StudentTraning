const Course = require("../models/courseSchema");
const { responseObj } = require("../config/responseObj");
const AppError = require("../utils/customError");
const { sendSuccess } = require("../utils/responseHandler");
module.exports = {
    // ==========================================
    // CREATE COURSE - User
    // ==========================================

    createCourse: async (req, res, next) => {
        try {
            const {
                title,
                description,
                duration,
                category,
            } = req.body;

            // Only logged-in users can create course requests.
            if (req.user.role !== "user") {
                return next(
                    new AppError(
                        "Only users can create course requests",
                        403
                    )
                );
            }

            if (!title || !title.trim()) {
                return next(
                    new AppError("Course title is required", 400)
                );
            }

            if (!description || !description.trim()) {
                return next(
                    new AppError("Course description is required", 400)
                );
            }

            // Prevent duplicate course requests by the same user.
            const existingCourse = await Course.findOne({
                title: title.trim(),
                createdBy: req.user.id,
            });

            if (existingCourse) {
                return next(
                    new AppError(
                        "You have already created a course with this title",
                        409
                    )
                );
            }

            const course = await Course.create({
                title: title.trim(),
                description: description.trim(),
                duration,
                category,
                createdBy: req.user.id,
                status: "pending",
            });

            return sendSuccess(res, {
                ...responseObj.create_course,
                data: course,
            });
        } catch (error) {
            next(error);
        }
    },

    // GET ALL COURSES

    getAllCourses: async (req, res, next) => {
        try {
            const filter =
                req.user.role === "admin"
                    ? {}
                    : { createdBy: req.user.id };

            const courses = await Course.find(filter)
                .populate("createdBy", "name email")
                .sort({ createdAt: -1 });

            return sendSuccess(res, {
                ...responseObj.get_courses,
                data: courses,
            });
        } catch (error) {
            next(error);
        }
    },

    // GET COURSE BY ID


    getCourseById: async (req, res, next) => {
        try {
            const { id } = req.params;

            const filter =
                req.user.role === "admin"
                    ? { _id: id }
                    : { _id: id, createdBy: req.user.id };

            const course = await Course.findOne(filter)
                .populate("createdBy", "name email");

            if (!course) {
                return next(
                    new AppError("Course not found", 404)
                );
            }

            return sendSuccess(res, {
                ...responseObj.get_courses,
                data: course,
            });
        } catch (error) {
            next(error);
        }
    },


    // UPDATE COURSE - ADMIN

    updateCourse: async (req, res, next) => {
        try {
            const { id } = req.params;

            const course = await Course.findByIdAndUpdate(
                id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!course) {
                return next(new AppError("Course not found", 404));
            }

            return sendSuccess(res, {
                ...responseObj.update_course
            })
        } catch (error) {
            next(error);
        }
    },

    // DELETE COURSE - ADMIN

    deleteCourse: async (req, res, next) => {
        try {
            const { id } = req.params;

            const course = await Course.findByIdAndDelete(id);

            if (!course) {
                return next(new AppError("Course not found", 404));
            }

            return sendSuccess(res, {
                ...responseObj.delete_course
            })
        } catch (error) {
            next(error);
        }
    },

    updateCourseStatus: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status, rejectionReason } = req.body;

            if (!["approved", "rejected"].includes(status)) {
                return next(
                    new AppError(
                        "Status must be approved or rejected",
                        400
                    )
                );
            }

            if (status === "rejected" && !rejectionReason?.trim()) {
                return next(
                    new AppError(
                        "Rejection reason is required",
                        400
                    )
                );
            }

            const course = await Course.findByIdAndUpdate(
                id,
                {
                    status,
                    reviewedBy: req.user.id,
                    reviewedAt: new Date(),
                    rejectionReason:
                        status === "rejected"
                            ? rejectionReason.trim()
                            : null,
                },
                {
                    new: true,
                    runValidators: true,
                }
            );

            if (!course) {
                return next(new AppError("Course not found", 404));
            }

            return sendSuccess(res, {
                message: `Course ${status} successfully`,
                data: course,
            });
        } catch (error) {
            next(error);
        }
    },


    getAllCourseRequests: async (req, res, next) => {
        try {
            console.log("1. API called");

            const courses = await Course.find()
                .sort({ createdAt: -1 })
                .populate("createdBy", "name email")
                .populate("reviewedBy", "name email")
                .lean();

            console.log("2. Courses fetched:", courses.length);

            return sendSuccess(res, {
                ...responseObj.get_courses,
                data: courses,
            });
        } catch (error) {
            console.error("getAllCourseRequests ERROR:", error);
            next(error);
        }
    },

};