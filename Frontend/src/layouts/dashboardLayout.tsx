
import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Main/header";
import Sidebar from "./Main/sidebar";

function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Fixed Header */}
      <Header onMenuClick={handleMenuClick} />

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleClose}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          width: {
            xs: "100%",
            md: "calc(100% - 260px)",
          },

          ml: {
            xs: 0,
            md: "260px",
          },

          // Header ke neeche content start hoga
          mt: "70px",

          minHeight: "calc(100vh - 70px)",

          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },

          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;