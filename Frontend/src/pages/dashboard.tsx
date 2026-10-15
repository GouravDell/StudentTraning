import { useMemo } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";

import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircle";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";

import { useNavigate } from "react-router-dom";
import { useGetAllCourseRequestsQuery } from "../redux/slices/services/courseApi";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/slices/store";

interface CourseRequest {
  _id: string;
  title?: string;
  description?: string;
  category?: string;
  duration?: string;
  level?: string;
  status?: "pending" | "approved" | "rejected" | "completed";
  createdAt?: string;
  user?: {
    _id?: string;
    name?: string;
    fullName?: string;
    email?: string;
  };
}

interface CourseApiResponse {
  message?: string;
  data?: CourseRequest[];
}

interface StatCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  background: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  background,
}: StatCardProps) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid #E8ECF2",
        borderRadius: 3,
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 10px 28px rgba(20, 35, 70, 0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "#64748B", fontWeight: 600 }}
          >
            {title}
          </Typography>

          <Avatar
            variant="rounded"
            sx={{
              width: 46,
              height: 46,
              bgcolor: background,
              color,
              borderRadius: 2.5,
            }}
          >
            {icon}
          </Avatar>
        </Box>

        <Typography
          variant="h4"
          sx={{
            mt: 2,
            mb: 0.5,
            color: "#172033",
            fontWeight: 800,
          }}
        >
          {value}
        </Typography>

        <Typography variant="caption" sx={{ color: "#64748B" }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
};

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return {
        color: "#15803D",
        backgroundColor: "#DCFCE7",
      };

    case "rejected":
      return {
        color: "#B91C1C",
        backgroundColor: "#FEE2E2",
      };

    case "completed":
      return {
        color: "#6D28D9",
        backgroundColor: "#EDE9FE",
      };

    default:
      return {
        color: "#B45309",
        backgroundColor: "#FEF3C7",
      };
  }
};

const formatDate = (date?: string) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const user: any = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetAllCourseRequestsQuery(undefined);

  const courses: CourseRequest[] = useMemo(() => {
    const result = response as CourseApiResponse | CourseRequest[] | undefined;

    if (Array.isArray(result)) {
      return result;
    }

    if (result && Array.isArray(result.data)) {
      return result.data;
    }

    return [];
  }, [response]);

  const stats = useMemo(() => {
    return {
      total: courses.length,
      pending: courses.filter(
        (course) => course.status?.toLowerCase() === "pending"
      ).length,
      approved: courses.filter(
        (course) => course.status?.toLowerCase() === "approved"
      ).length,
      rejected: courses.filter(
        (course) => course.status?.toLowerCase() === "rejected"
      ).length,
    };
  }, [courses]);

  const recentCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;
        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return dateB - dateA;
      })
      .slice(0, 5);
  }, [courses]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography color="text.secondary">
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Data loading issue..
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        p: { xs: 2, sm: 2.5, md: 3 },
        bgcolor: "#F7F9FC",
        minHeight: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Welcome section */}
      <Box
        sx={{
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: 24, sm: 28 },
              fontWeight: 800,
              color: "#172033",
            }}
          >
            Dashboard
          </Typography>

          <Typography sx={{ color: "#64748B", mt: 0.75 }}>
            Welcome back! Here is your course management overview.
          </Typography>
        </Box>

        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          disabled={user?.role !== "admin"}
          onClick={() => navigate("/users")}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 1.2,
            borderRadius: 2,
            bgcolor: "#4F46E5",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#4338CA",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "#E5E7EB",
              color: "#9CA3AF",
              cursor: "not-allowed",
            },
          }}
        >
          Manage Requests
        </Button>
      </Box>

      {/* Statistics cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3.5,
        }}
      >
        <StatCard
          title="Total Requests"
          value={stats.total}
          subtitle="All course requests"
          icon={<SchoolOutlinedIcon />}
          color="#4F46E5"
          background="#EEF2FF"
        />

        <StatCard
          title="Pending Requests"
          value={stats.pending}
          subtitle="Awaiting your review"
          icon={<PendingActionsOutlinedIcon />}
          color="#D97706"
          background="#FEF3C7"
        />

        <StatCard
          title="Approved Requests"
          value={stats.approved}
          subtitle="Successfully approved"
          icon={<CheckCircleOutlineIcon />}
          color="#16A34A"
          background="#DCFCE7"
        />

        <StatCard
          title="Rejected Requests"
          value={stats.rejected}
          subtitle="Requests not approved"
          icon={<CancelOutlinedIcon />}
          color="#DC2626"
          background="#FEE2E2"
        />
      </Box>

      {/* Recent course requests */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #E8ECF2",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            p: { xs: 2, sm: 2.5 },
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: "#172033" }}
            >
              Recent Course Requests
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              Latest course requests submitted by users
            </Typography>
          </Box>

          <Button
            disabled={user?.role != "admin"}
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/users")}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "#4F46E5",
            }}
          >
            View All
          </Button>
        </Box>

        <Divider />

        {recentCourses.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              px: 2,
              py: 7,
            }}
          >
            <Avatar
              sx={{
                width: 60,
                height: 60,
                bgcolor: "#EEF2FF",
                color: "#4F46E5",
                mx: "auto",
                mb: 2,
              }}
            >
              <MenuBookOutlinedIcon fontSize="large" />
            </Avatar>

            <Typography sx={{ fontWeight: 700, color: "#172033" }}>
              No course requests yet
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#64748B", mt: 0.75 }}
            >
              New course requests will appear here.
            </Typography>
          </Box>
        ) : (
          <Box>
            {recentCourses.map((course, index) => {
              const statusStyle = getStatusColor(course.status);

              return (
                <Box key={course._id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: 2,
                      p: { xs: 2, sm: 2.5 },
                      flexDirection: { xs: "column", sm: "row" },
                      transition: "background-color 0.2s",
                      "&:hover": {
                        bgcolor: "#FAFBFF",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        flex: 1,
                        minWidth: 0,
                        width: "100%",
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          flexShrink: 0,
                          bgcolor: "#EEF2FF",
                          color: "#4F46E5",
                          borderRadius: 2,
                        }}
                      >
                        <MenuBookOutlinedIcon />
                      </Avatar>

                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          sx={{
                            fontWeight: 700,
                            color: "#172033",
                            overflowWrap: "anywhere",
                          }}
                        >
                          {course.title || "Untitled Course"}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: "#64748B",
                            mt: 0.5,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {course.category || "General"}
                          {course.duration ? ` • ${course.duration}` : ""}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: "#94A3B8",
                            display: "block",
                            mt: 0.5,
                          }}
                        >
                          Submitted: {formatDate(course.createdAt)}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        width: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <Chip
                        label={course.status || "pending"}
                        size="small"
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: 700,
                          color: statusStyle.color,
                          bgcolor: statusStyle.backgroundColor,
                        }}
                      />

                      <Button
                        disabled={user?.role != 'admin'}
                        size="small"

                        sx={{
                          textTransform: "none",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}
                      >
                        Review
                      </Button>
                    </Box>
                  </Box>

                  {index < recentCourses.length - 1 && <Divider />}
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Dashboard;