
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Tooltip,
} from "@mui/material";

import {
  Logout,
  NotificationsNone,
  Menu,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { DRAWER_WIDTH } from "../Main/sidebar";
import type { RootState } from "../../redux/slices/store";
import { logout as logoutAction } from "../../redux/slices/authSlice";

interface HeaderProps {
  onMenuClick: () => void;
}

function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux se logged-in user lena
  const user:any = useSelector((state: RootState) => state.auth.user);
  
  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin";

  const displayName =
    user?.name ||
    user?.email ||
    (isAdmin ? "Admin" : "User");

  const displayRole = isAdmin ? "Administrator" : "User";

  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = () => {
    // Redux auth state clear karo
    dispatch(logoutAction());

    // Sirf authentication keys clear karo
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          xs: "100%",
          md: `calc(100% - ${DRAWER_WIDTH}px)`,
        },
        ml: {
          xs: 0,
          md: `${DRAWER_WIDTH}px`,
        },
        bgcolor: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid #e5e7eb",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: "70px !important",
          px: { xs: 1.5, sm: 3 },
          gap: { xs: 0.5, sm: 1 },
        }}
      >
        {/* Mobile menu */}
        <IconButton
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          sx={{
            display: { xs: "inline-flex", md: "none" },
            mr: { xs: 0.5, sm: 1 },
          }}
        >
          <Menu />
        </IconButton>

        {/* Dynamic page title */}
        <Typography
          noWrap
          sx={{
            fontWeight: 750,
            fontSize: { xs: 15, sm: 19, md: 20 },
            minWidth: 0,
          }}
        >
          {isAdmin ? "Admin Panel" : "User Panel"}
        </Typography>

        <Box sx={{ flexGrow: 1, minWidth: 4 }} />

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            aria-label="Notifications"
            sx={{ color: "#64748b" }}
          >
            <NotificationsNone />
          </IconButton>
        </Tooltip>

        {/* Dynamic user profile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            ml: { xs: 0.5, sm: 1 },
            minWidth: 0,
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              flexShrink: 0,
              bgcolor: isAdmin ? "#2563eb" : "#0d9488",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {avatarLetter}
          </Avatar>

          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              minWidth: 0,
              maxWidth: 180,
            }}
          >
            <Typography
              noWrap
              sx={{
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {displayName}
            </Typography>

            <Typography
              noWrap
              sx={{
                fontSize: 11,
                color: "text.secondary",
              }}
            >
              {displayRole}
            </Typography>
          </Box>
        </Box>

        {/* Logout */}
        <Tooltip title="Logout">
          <IconButton
            onClick={handleLogout}
            aria-label="Logout"
            sx={{
              ml: { xs: 0.3, sm: 1 },
              color: "#64748b",
            }}
          >
            <Logout />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

export default Header;