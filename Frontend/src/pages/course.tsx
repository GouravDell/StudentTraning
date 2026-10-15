
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  Add,
  Search,
  School,
  AccessTime,
  MenuBook,
  Close,
  EditOutlined,
  VisibilityOutlined,
  AutoStories,
  DeleteOutlined
} from "@mui/icons-material";

import {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useLazyGetCourseByIdQuery,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  type CourseApiItem,
} from "../redux/slices/services/courseApi";

type CourseStatus = "pending" | "approved" | "rejected" | "completed";

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  status: CourseStatus;
  color: string;
  iconColor: string;
}

interface CourseForm {
  title: string;
  description: string;
  category: string;
  duration: string;
}

const statusStyles: Record<
  CourseStatus,
  { color: "success" | "warning" | "error" | "info"; label: string }
> = {
  approved: { color: "success", label: "Approved" },
  pending: { color: "warning", label: "Pending" },
  rejected: { color: "error", label: "Rejected" },
  completed: { color: "info", label: "Completed" },
};

const emptyForm: CourseForm = {
  title: "",
  description: "",
  category: "",
  duration: "",
};

const cardColors = [
  { color: "#E8EAFE", iconColor: "#5656D8" },
  { color: "#E0F7F1", iconColor: "#099779" },
  { color: "#FFF0DF", iconColor: "#D97706" },
  { color: "#FCE7F3", iconColor: "#BE185D" },
];

const categories = [
  "Web Development",
  "Web Designing",
  "Frontend Developer",
  "Backend Developer",
  "UI/UX Developer",
  "Database Developer",
  "Full Stack Developer",
];

const mapApiCourse = (item: CourseApiItem, index: number): Course => {
  const palette = cardColors[index % cardColors.length];

  return {
    _id: item._id,
    title: item.title,
    description: item.description,
    category: item.category,
    duration: item.duration,
    status: item.status ?? "pending",
    color: palette.color,
    iconColor: palette.iconColor,
  };
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null);

  const [form, setForm] = useState<CourseForm>({ ...emptyForm });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    data: coursesResponse,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
    refetch,
  } = useGetAllCoursesQuery();

  const [createCourse, { isLoading: isCreating }] =
    useCreateCourseMutation();

  const [updateCourse, { isLoading: isUpdating }] =
    useUpdateCourseMutation();

  const [deleteCourse, { isLoading: isDeleting }] =
    useDeleteCourseMutation();

  const [fetchCourseById, { isLoading: isFetchingDetails }] =
    useLazyGetCourseByIdQuery();

  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    if (coursesResponse?.data) {
      setCourses(
        coursesResponse.data.map((item, index) =>
          mapApiCourse(item, index)
        )
      );
    }
  }, [coursesResponse]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || course.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || course.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [courses, search, statusFilter, categoryFilter]);

  const stats = [
    {
      label: "Total Courses",
      value: courses.length,
      icon: <School />,
      color: "#5755D9",
      bg: "#EEEEFF",
    },
    {
      label: "Approved",
      value: courses.filter((course) => course.status === "approved").length,
      icon: <AutoStories />,
      color: "#059669",
      bg: "#DDF8EC",
    },
    {
      label: "Pending Review",
      value: courses.filter((course) => course.status === "pending").length,
      icon: <AccessTime />,
      color: "#D97706",
      bg: "#FFF0D6",
    },
    {
      label: "Rejected",
      value: courses.filter((course) => course.status === "rejected").length,
      icon: <MenuBook />,
      color: "#DC4562",
      bg: "#FFE6EB",
    },
  ];

  const openCreateForm = () => {
    setSelectedCourse(null);
    setForm({ ...emptyForm });
    setError("");
    setSuccess("");
    setFormOpen(true);
  };

  const openEditForm = (course: Course) => {
    setSelectedCourse(course);
    setForm({
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
    });
    setError("");
    setDetailsOpen(false);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) return;

    setFormOpen(false);
    setSelectedCourse(null);
    setForm({ ...emptyForm });
    setError("");
  };

  const handleSave = async () => {
    debugger
    setError("");
    setSuccess("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.category ||
      !form.duration
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      duration: form.duration,
    };

    try {
      if (selectedCourse) {
        await updateCourse({
          id: selectedCourse._id,
          body,
        }).unwrap();

        setSuccess("Course updated successfully.");
      } else {
        const response = await createCourse(body).unwrap();

        setSuccess(response.message || "Course created successfully.");
      }

      setFormOpen(false);
      setSelectedCourse(null);
      setForm({ ...emptyForm });

      await refetch();
    } catch (err: unknown) {
      const apiError = err as {
        status?: number | string;
        data?: { message?: string; error?: string };
      };

      const message =
        apiError.data?.message ||
        apiError.data?.error ||
        "Unable to save course. Please try again.";

      if (
        apiError.status === 409 ||
        apiError.status === 11000 ||
        message.toLowerCase().includes("already exists") ||
        message.includes("E11000")
      ) {
        setError("A course with this title already exists.");
      } else {
        setError(message);
      }
    }
  };

  const handleViewCourse = async (course: Course) => {
    setError("");

    try {
      const response = await fetchCourseById(course._id).unwrap();

      setSelectedCourse(mapApiCourse(response.data, 0));
      setDetailsOpen(true);
    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string; error?: string };
      };

      setError(
        apiError.data?.message ||
          apiError.data?.error ||
          "Unable to load course details."
      );
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteTarget) return;

    setError("");

    try {
      await deleteCourse(deleteTarget._id).unwrap();

      setCourses((previous) =>
        previous.filter((course) => course._id !== deleteTarget._id)
      );

      setSuccess("Course deleted successfully.");
      setDeleteTarget(null);

      await refetch();
    } catch (err: unknown) {
      const apiError = err as {
        data?: { message?: string; error?: string };
      };

      setError(
        apiError.data?.message ||
          apiError.data?.error ||
          "Unable to delete course."
      );

      setDeleteTarget(null);
    }
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0, boxSizing: "border-box" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 800, color: "#172033", letterSpacing: "-0.5px" }}
          >
            Courses
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 0.5, fontSize: 14 }}>
            Manage your courses and monitor approval status.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openCreateForm}
          sx={{
            alignSelf: { xs: "stretch", sm: "auto" },
            px: 2.5,
            py: 1.2,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 700,
            bgcolor: "#5755D9",
            "&:hover": { bgcolor: "#4140B8" },
          }}
        >
          Add New Course
        </Button>
      </Stack>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {isCoursesError && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        >
          Unable to load courses. Check your server and try again.
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid #EAECF2",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", justifyContent: "space-between" }}
                >
                  <Box>
                    <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                      {stat.label}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 28, fontWeight: 800, mt: 1, color: "#172033" }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>

                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: stat.bg,
                      color: stat.color,
                      borderRadius: 2.5,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card
        elevation={0}
        sx={{ border: "1px solid #EAECF2", borderRadius: 3, mb: 3 }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search courses..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "#9299AA" }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Filter by category"
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Stack
        direction="row"
        sx={{ mb: 2, alignItems: "center", justifyContent: "space-between" }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: "#172033" }}>
          All Courses
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          {filteredCourses.length} results
        </Typography>
      </Stack>

      {isCoursesLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {filteredCourses.map((course) => {
            const status = statusStyles[course.status];

            return (
              <Grid key={course._id} size={{ xs: 12, sm: 6, xl: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #EAECF2",
                    borderRadius: 3,
                    transition: "all .2s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 10px 30px rgba(23,32,51,0.07)",
                      borderColor: "#D6D6F8",
                    },
                  }}
                >
                  <Box
                    sx={{
                      minHeight: 125,
                      px: 2.5,
                      py: 2,
                      bgcolor: course.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        width: 58,
                        height: 58,
                        bgcolor: "#FFFFFF",
                        color: course.iconColor,
                        borderRadius: 2.5,
                      }}
                    >
                      <School sx={{ fontSize: 31 }} />
                    </Avatar>

                    <Chip
                      label={status.label}
                      color={status.color}
                      size="small"
                      sx={{ fontWeight: 700, bgcolor: "white" }}
                    />
                  </Box>

                  <CardContent
                    sx={{
                      p: 2.5,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      "&:last-child": { pb: 2.5 },
                    }}
                  >
                    <Typography sx={{ fontSize: 17, fontWeight: 800, color: "#172033", mb: 1 }}>
                      {course.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 13,
                        lineHeight: 1.7,
                        color: "text.secondary",
                        mb: 2,
                        flexGrow: 1,
                      }}
                    >
                      {course.description}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
                    >
                      <Chip label={course.category} size="small" variant="outlined" />
                      <Chip
                        icon={<AccessTime sx={{ fontSize: "16px !important" }} />}
                        label={course.duration}
                        size="small"
                        variant="outlined"
                      />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Stack direction="row" sx={{ justifyContent: "flex-end", alignItems: "center" }}>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          aria-label={`View ${course.title}`}
                          onClick={() => handleViewCourse(course)}
                          sx={{ color: "#5755D9", bgcolor: "#F0F0FF", borderRadius: 2 }}
                        >
                          <VisibilityOutlined fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          aria-label={`Edit ${course.title}`}
                          onClick={() => openEditForm(course)}
                          sx={{ color: "#D97706", bgcolor: "#FFF5E7", borderRadius: 2 }}
                        >
                          <EditOutlined fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          aria-label={`Delete ${course.title}`}
                          onClick={() => setDeleteTarget(course)}
                          sx={{ color: "#DC4562", bgcolor: "#FFE6EB", borderRadius: 2 }}
                        >
                         <DeleteOutlined />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {!isCoursesLoading && !isCoursesError && filteredCourses.length === 0 && (
        <Card
          elevation={0}
          sx={{
            mt: 2,
            py: 7,
            textAlign: "center",
            border: "1px dashed #D9DCE5",
            borderRadius: 3,
          }}
        >
          <School sx={{ fontSize: 46, color: "#A5A9B8", mb: 1 }} />
          <Typography sx={{ fontWeight: 700 }}>No courses found</Typography>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
            Try another search or change your filters.
          </Typography>
        </Card>
      )}

      {/* Create / Edit dialog */}
      <Dialog
        open={formOpen}
        onClose={closeForm}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: 3, m: 2 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
          {selectedCourse ? "Edit Course" : "Add New Course"}
          <IconButton
            onClick={closeForm}
            aria-label="Close"
            disabled={isSaving}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Course title"
              required
              fullWidth
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />

            <TextField
              label="Description"
              required
              fullWidth
              multiline
              minRows={3}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />

            <TextField
              select
              label="Category"
              required
              fullWidth
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Duration"
              select
              required
              fullWidth
              value={form.duration}
              onChange={(event) => setForm({ ...form, duration: event.target.value })}
            >
              <MenuItem value="5 Months">5 Months</MenuItem>
              <MenuItem value="6 Months">6 Months</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={closeForm} disabled={isSaving} sx={{ textTransform: "none", color: "text.secondary" }}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              bgcolor: "#5755D9",
              "&:hover": { bgcolor: "#4140B8" },
            }}
          >
            {isSaving ? "Saving..." : selectedCourse ? "Save Changes" : "Add Course"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Course details dialog */}
      <Dialog
        open={detailsOpen && Boolean(selectedCourse)}
        onClose={() => setDetailsOpen(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{ paper: { sx: { borderRadius: 3, m: 2 } } }}
      >
        {selectedCourse && (
          <>
            <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
              Course Details
              <IconButton
                onClick={() => setDetailsOpen(false)}
                aria-label="Close"
                sx={{ position: "absolute", right: 12, top: 12 }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              {isFetchingDetails && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={26} />
                </Box>
              )}

              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                {selectedCourse.title}
              </Typography>

              <Typography sx={{ color: "text.secondary", lineHeight: 1.8, mb: 2 }}>
                {selectedCourse.description}
              </Typography>

              <Stack spacing={1}>
                <Typography>Category: {selectedCourse.category}</Typography>
                <Typography>Duration: {selectedCourse.duration}</Typography>
                <Typography>
                  Status: {statusStyles[selectedCourse.status].label}
                </Typography>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button variant="contained" onClick={() => openEditForm(selectedCourse)}>
                Edit Course
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete confirmation */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => {
          if (!isDeleting) setDeleteTarget(null);
        }}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Delete Course?</DialogTitle>

        <DialogContent>
          Are you sure you want to delete{" "}
          <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteCourse}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
