import {
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export type CourseStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "completed";

export interface UserInfo {
    _id: string;
    name?: string;
    fullName?: string;
    email?: string;
}

export interface CourseApiItem {
    _id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    status: CourseStatus;
    price?: number;
    level?: "Beginner" | "Intermediate" | "Advanced";
    createdBy?: UserInfo | string;
    reviewedBy?: UserInfo | string;
    rejectionReason?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CourseFormRequest {
    title: string;
    description: string;
    category: string;
    duration: string;
}

interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: boolean | string;
}

export const courseApi = createApi({
    reducerPath: "courseApi",

    baseQuery: fetchBaseQuery({
        baseUrl: "https://student-traning-4k2u.vercel.app/course/",

        prepareHeaders: (headers) => {
            const token = localStorage.getItem("token");

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),

    tagTypes: ["Course"],

    endpoints: (builder) => ({
        // CREATE COURSE
        createCourse: builder.mutation<
            ApiResponse<CourseApiItem>,
            CourseFormRequest
        >({
            query: (body) => ({
                url: "createCourse",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Course", id: "LIST" }],
        }),

        // GET ALL COURSES
        getAllCourses: builder.query<
            ApiResponse<CourseApiItem[]>,
            { status?: string; category?: string; search?: string } | void
        >({
            query: (params) => ({
                url: "getAllCourse",
                params: params || undefined,
            }),
            providesTags: (result) => [
                { type: "Course", id: "LIST" },
                ...(result?.data ?? []).map(({ _id }) => ({
                    type: "Course" as const,
                    id: _id,
                })),
            ],
        }),

        // GET ALL USERS' COURSE REQUESTS - ADMIN ONLY
        getAllCourseRequests: builder.query<
            ApiResponse<CourseApiItem[]>,
            void
        >({
            query: () => "requests",
            providesTags: (result) => [
                { type: "Course", id: "REQUESTS" },
                ...(result?.data ?? []).map(({ _id }) => ({
                    type: "Course" as const,
                    id: _id,
                })),
            ],
        }),

        // GET COURSE BY ID
        getCourseById: builder.query<
            ApiResponse<CourseApiItem>,
            string
        >({
            query: (id) => id,
            providesTags: (_result, _error, id) => [
                { type: "Course", id },
            ],
        }),

        // UPDATE COURSE - ADMIN
        updateCourse: builder.mutation<
            ApiResponse<CourseApiItem>,
            {
                id: string;
                body: Partial<CourseFormRequest> & {
                    status?: CourseStatus;
                };
            }
        >({
            query: ({ id, body }) => ({
                url: id,
                method: "PUT",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Course", id },
                { type: "Course", id: "LIST" },
            ],
        }),

        // APPROVE OR REJECT COURSE - ADMIN ONLY
        updateCourseStatus: builder.mutation<
            ApiResponse<CourseApiItem>,
            {
                id: string;
                status: "approved" | "rejected";
                rejectionReason?: string;
            }
        >({
            query: ({ id, ...body }) => ({
                url: `${id}/status`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Course", id },
                { type: "Course", id: "LIST" },
            ],
        }),

        // DELETE COURSE - ADMIN
        deleteCourse: builder.mutation<
            ApiResponse<CourseApiItem>,
            string
        >({
            query: (id) => ({
                url: id,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "Course", id },
                { type: "Course", id: "LIST" },
            ],
        }),
    }),
});

export const {
    useCreateCourseMutation,
    useGetAllCoursesQuery,
    useGetAllCourseRequestsQuery,
    useGetCourseByIdQuery,
    useLazyGetCourseByIdQuery,
    useUpdateCourseMutation,
    useUpdateCourseStatusMutation,
    useDeleteCourseMutation,
} = courseApi;