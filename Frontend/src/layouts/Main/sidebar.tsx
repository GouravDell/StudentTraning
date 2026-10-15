
import {
  Dashboard,
  Group,
  Person,
  Settings,
  Logout,
  Close,
  School,
} from "@mui/icons-material";

import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { RootState } from "../../redux/slices/store";
import { logout as logoutAction } from "../../redux/slices/authSlice";

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export const DRAWER_WIDTH = 260;

interface MenuItem {
  label: string;
  path: string;
  icon: ReactNode;
}

function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Read logged-in user from Redux
  const user: any = useSelector((state: RootState) => state.auth.user);

  const role = user?.role?.toLowerCase();
  const isAdmin = role === "admin";

  // Main menu depends on the user's role
  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      icon: <Dashboard />,
      path: "/dashboard",
    },
    ...(isAdmin
      ? [
        {
          label: "Users",
          icon: <Group />,
          path: "/users",
        },
      ]
      : []),

    // Courses dono roles ke liye
    {
      label: "Courses",
      icon: <School />,
      path: "/courses",
    },
  ];

  // Shared menu for both roles
  const accountItems: MenuItem[] = [
    {
      label: "Profile",
      icon: <Person />,
      path: "/profile",
    },
    {
      label: "Settings",
      icon: <Settings />,
      path: "/settings",
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    // Clear Redux authentication state
    dispatch(logoutAction());

    // Remove persisted authentication data if present
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    onClose();
    navigate("/login", { replace: true });
  };

  const renderMenuItems = (items: MenuItem[]) =>
    items.map((item) => {
      const active = isActive(item.path);

      return (
        <ListItemButton
          key={item.path}
          selected={active}
          onClick={() => handleNavigation(item.path)}
          sx={{
            minHeight: 46,
            px: 1.5,
            mb: 0.6,
            borderRadius: 2,
            color: active ? "#2563eb" : "#64748b",
            transition: "all 0.2s ease",

            "&.Mui-selected": {
              bgcolor: "#eff6ff",
              color: "#2563eb",

              "&:hover": {
                bgcolor: "#dbeafe",
              },

              "& .MuiListItemIcon-root": {
                color: "#2563eb",
              },
            },

            "&:hover": {
              bgcolor: "#f8fafc",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "inherit",
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.label}
            slotProps={{
              primary: {
                sx: {
                  fontSize: 14,
                  fontWeight: active ? 700 : 500,
                },
              },
            }}
          />
        </ListItemButton>
      );
    });

  const drawerContent = (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#ffffff",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          minHeight: 70,
          flexShrink: 0,
          px: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              bgcolor: "#2563eb",
              color: "#fff",
              display: "grid",
              placeItems: "center",
            }}
          >
            <School />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 17,
                fontWeight: 800,
              }}
            >
              Master Panel
            </Typography>

            <Typography
              sx={{
                fontSize: 11,
                color: "text.secondary",
              }}
            >
              {isAdmin ? "Administration" : "User Portal"}
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          aria-label="Close sidebar"
          sx={{
            display: { xs: "inline-flex", md: "none" },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <Divider />

      {/* Scrollable navigation */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1.5,
          py: 2,
        }}
      >
        <Typography
          sx={{
            px: 1.5,
            mb: 1.2,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.2,
            color: "#94a3b8",
          }}
        >
          MAIN MENU
        </Typography>

        <List disablePadding>
          {renderMenuItems(menuItems)}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography
          sx={{
            px: 1.5,
            mb: 1.2,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: 1.2,
            color: "#94a3b8",
          }}
        >
          ACCOUNT
        </Typography>

        <List disablePadding>
          {renderMenuItems(accountItems)}
        </List>
      </Box>

      {/* Logout */}
      <Box
        sx={{
          p: 1.5,
          flexShrink: 0,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <ListItemButton
          onClick={handleLogout}
          sx={{
            minHeight: 46,
            borderRadius: 2,
            color: "#dc2626",

            "&:hover": {
              bgcolor: "#fef2f2",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: "inherit",
            }}
          >
            <Logout />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            slotProps={{
              primary: {
                sx: {
                  fontSize: 14,
                  fontWeight: 600,
                },
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid #e5e7eb",
            bgcolor: "#fff",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Mobile sidebar */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            maxWidth: "85vw",
            boxSizing: "border-box",
            bgcolor: "#fff",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default Sidebar;