
import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/authlayout";
import ProtectedRoutes from "../layouts/protectedRoutes";
import DashboardLayout from "../layouts/dashboardLayout";

import { Box, CircularProgress, Typography } from "@mui/material";

// Lazy-loaded pages
const Login = lazy(() => import("../pages/login"));
const Signup = lazy(() => import("../pages/signup"));

const Dashboard = lazy(() => import("../pages/dashboard"));
const User = lazy(() => import("../pages/user"));
const Courses = lazy(() => import("../pages/course"));
const Profile = lazy(() => import("../pages/profile"));
const Settings = lazy(() => import("../pages/setting"));

// Loading component
const PageLoader = () => {
  return (
    <Box
      sx={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        Loading page...
      </Typography>
    </Box>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Default route */}
          <Route
            path="/"
            element={<Navigate to="/login" replace />}
          />

          {/* Public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<User />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Invalid URL */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;