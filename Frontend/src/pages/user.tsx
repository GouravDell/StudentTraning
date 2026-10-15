
import { useState } from "react";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  useGetAllCourseRequestsQuery,
  useUpdateCourseStatusMutation,
  type CourseApiItem,
  type UserInfo,
} from "../redux/slices/services/courseApi";

type CourseStatus = "pending" | "approved" | "rejected";
type ReviewStatus = "approved" | "rejected";

export default function Users() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAllCourseRequestsQuery();

  const requests: CourseApiItem[] = data?.data ?? [];

  const [
    updateCourseStatus,
    { isLoading: isUpdating },
  ] = useUpdateCourseStatusMutation();

  const [updatingCourseId, setUpdatingCourseId] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] =
    useState<"success" | "error">("success");

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] =
    useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] =
    useState<ReviewStatus | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const pendingCount = requests.filter(
    (course) => (course.status ?? "pending") === "pending"
  ).length;

  const approvedCount = requests.filter(
    (course) => course.status === "approved"
  ).length;

  const rejectedCount = requests.filter(
    (course) => course.status === "rejected"
  ).length;

  const getUser = (
    createdBy?: UserInfo | string
  ): UserInfo | null => {
    if (!createdBy || typeof createdBy === "string") {
      return null;
    }

    return createdBy;
  };

  const getStatusColor = (
    status: CourseStatus
  ): "warning" | "success" | "error" => {
    if (status === "approved") return "success";
    if (status === "rejected") return "error";
    return "warning";
  };

  const openReviewDialog = (
    courseId: string,
    status: ReviewStatus
  ) => {
    setMessage("");
    setSelectedCourseId(courseId);
    setSelectedStatus(status);
    setRejectionReason("");
    setDialogOpen(true);
  };

  const closeReviewDialog = () => {
    if (isUpdating) return;

    setDialogOpen(false);
    setSelectedCourseId(null);
    setSelectedStatus(null);
    setRejectionReason("");
  };

  const handleStatusChange = async (
    courseId: string,
    status: ReviewStatus
  ) => {
    const reason =
      status === "rejected" ? rejectionReason.trim() : "";

    if (status === "rejected" && !reason) {
      setMessageType("error");
      setMessage("Please enter the reason for rejection.");
      return;
    }

    try {
      setMessage("");
      setUpdatingCourseId(courseId);

      await updateCourseStatus({
        id: courseId,
        status,
        ...(reason ? { rejectionReason: reason } : {}),
      }).unwrap();

      setMessageType("success");
      setMessage(`Course ${status} successfully.`);

      setDialogOpen(false);
      setSelectedCourseId(null);
      setSelectedStatus(null);
      setRejectionReason("");
    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string };
        error?: string;
      };

      setMessageType("error");
      setMessage(
        apiError.data?.message ??
        apiError.error ??
        "Unable to update course status. Please try again."
      );
    } finally {
      setUpdatingCourseId(null);
    }
  };

  // Initial loading
  if (isLoading && !data) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={36} />
        <Typography color="text.secondary">
          Loading course requests...
        </Typography>
      </Box>
    );
  }

  // Initial API error
  if (isError && !data) {
    const apiError = error as {
      data?: { message?: string };
      error?: string;
    };

    return (
      <Box sx={{ p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          }
        >
          {apiError?.data?.message ??
            apiError?.error ??
            "Could not load course requests. Check your connection and admin permissions."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {/* Page Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            Users & Course Requests
          </Typography>

          <Typography color="text.secondary">
            View user details and manage course approval requests.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => refetch()}
          disabled={isFetching}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      {isFetching && !isLoading && <LinearProgressBar />}

      {isError && data && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Could not refresh the latest requests. Showing the previously
          loaded data.
        </Alert>
      )}

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
          mt: isFetching && !isLoading ? 2 : 0,
        }}
      >
        <SummaryCard
          title="Pending Requests"
          count={pendingCount}
          color="#b7791f"
          background="#fffbeb"
        />

        <SummaryCard
          title="Approved Courses"
          count={approvedCount}
          color="#15803d"
          background="#f0fdf4"
        />

        <SummaryCard
          title="Rejected Courses"
          count={rejectedCount}
          color="#b91c1c"
          background="#fef2f2"
        />
      </Box>

      {/* Success / Error Message */}
      {message && (
        <Alert
          severity={messageType}
          onClose={() => setMessage("")}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      {/* Course Requests Table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #e5e7eb",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            All Course Requests
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {requests.length} total requests
          </Typography>
        </Box>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell>
                  <b>User</b>
                </TableCell>
                <TableCell>
                  <b>Email</b>
                </TableCell>
                <TableCell>
                  <b>Course</b>
                </TableCell>
                <TableCell>
                  <b>Category</b>
                </TableCell>
                <TableCell>
                  <b>Duration</b>
                </TableCell>
                <TableCell>
                  <b>Request Date</b>
                </TableCell>
                <TableCell>
                  <b>Status</b>
                </TableCell>
                <TableCell align="right">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {requests.map((course) => {
                const user = getUser(course.createdBy);
                const status: any =
                  course.status ?? "pending";

                const displayName =
                  user?.name ?? user?.fullName ?? "Unknown User";

                const rowUpdating =
                  isUpdating &&
                  updatingCourseId === course._id;

                return (
                  <TableRow key={course._id} hover>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.2}
                        sx={{ alignItems: "center" }}
                      >
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            bgcolor: "#e0e7ff",
                            color: "#4338ca",
                            fontWeight: 700,
                          }}
                        >
                          {displayName.charAt(0).toUpperCase()}
                        </Avatar>

                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: 13,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {displayName}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {user?.email ?? "—"}
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{ fontWeight: 600, fontSize: 13 }}
                      >
                        {course.title}
                      </Typography>

                      {course.price != null && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          ₹{course.price}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {course.category || "—"}
                    </TableCell>

                    <TableCell>
                      {course.duration || "—"}
                    </TableCell>

                    <TableCell>
                      {course.createdAt
                        ? new Date(
                          course.createdAt
                        ).toLocaleDateString("en-IN")
                        : "—"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={status.toUpperCase()}
                        color={getStatusColor(status)}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: 11,
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      {status === "pending" ? (
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ justifyContent: "flex-end" }}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            disabled={isUpdating}
                            onClick={() =>
                              openReviewDialog(
                                course._id,
                                "approved"
                              )
                            }
                            sx={{
                              textTransform: "none",
                              minWidth: 85,
                            }}
                          >
                            Approve
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={isUpdating}
                            onClick={() =>
                              openReviewDialog(
                                course._id,
                                "rejected"
                              )
                            }
                            sx={{
                              textTransform: "none",
                              minWidth: 75,
                            }}
                          >
                            Reject
                          </Button>

                          {rowUpdating && (
                            <CircularProgress
                              size={18}
                              sx={{ alignSelf: "center" }}
                            />
                          )}
                        </Stack>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Reviewed
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {requests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Box
                      sx={{
                        py: 6,
                        textAlign: "center",
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        No course requests found
                      </Typography>

                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{ mt: 0.5 }}
                      >
                        Requests will appear here when users submit
                        courses.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Approve / Reject Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeReviewDialog}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              p: 1,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            pb: 1,
          }}
        >
          {selectedStatus === "approved"
            ? "Approve Course?"
            : "Reject Course?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {selectedStatus === "approved"
              ? "Are you sure you want to approve this course request?"
              : "Please provide a reason for rejecting this course request."}
          </DialogContentText>

          {selectedStatus === "rejected" && (
            <TextField
              autoFocus
              fullWidth
              required
              multiline
              minRows={3}
              label="Rejection Reason"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(event.target.value)
              }
              disabled={isUpdating}
              slotProps={{
                htmlInput: {
                  maxLength: 500,
                },
              }}
              helperText={`${rejectionReason.length}/500 characters`}
            />
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 2,
            pb: 2,
            gap: 1,
          }}
        >
          <Button
            onClick={closeReviewDialog}
            disabled={isUpdating}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color={
              selectedStatus === "approved"
                ? "success"
                : "error"
            }
            disabled={
              isUpdating ||
              !selectedCourseId ||
              !selectedStatus ||
              (selectedStatus === "rejected" &&
                !rejectionReason.trim())
            }
            onClick={() => {
              if (selectedCourseId && selectedStatus) {
                void handleStatusChange(
                  selectedCourseId,
                  selectedStatus
                );
              }
            }}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              minWidth: 120,
            }}
          >
            {isUpdating ? (
              <CircularProgress size={20} color="inherit" />
            ) : selectedStatus === "approved" ? (
              "Yes, Approve"
            ) : (
              "Yes, Reject"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function LinearProgressBar() {
  return (
    <Box
      sx={{
        height: 3,
        width: "100%",
        overflow: "hidden",
        bgcolor: "#e5e7eb",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          height: "100%",
          width: "35%",
          bgcolor: "primary.main",
          borderRadius: 2,
          animation:
            "loadingSlide 1.2s ease-in-out infinite alternate",
          "@keyframes loadingSlide": {
            from: { transform: "translateX(0)" },
            to: { transform: "translateX(185%)" },
          },
        }}
      />
    </Box>
  );
}

interface SummaryCardProps {
  title: string;
  count: number;
  color: string;
  background: string;
}

function SummaryCard({
  title,
  count,
  color,
  background,
}: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        background,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color,
          fontWeight: 600,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          color,
          fontWeight: 800,
        }}
      >
        {count}
      </Typography>
    </Paper>
  );
}
