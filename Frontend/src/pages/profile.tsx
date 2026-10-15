import { useState } from "react";
import { useSelector } from "react-redux";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import type { RootState } from "../redux/slices/store";


interface ProfileData {
  fullName: string;
  email: string;
  designation: string;
}

const Profile = () => {
  // Get logged-in user directly from Redux
  const user: any = useSelector(
    (state: RootState) => state.auth.user
  );

  const role = user?.role?.toLowerCase();

  const isAdmin = role === "admin";
  const roleLabel = isAdmin ? "Administrator" : "User";

  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    fullName: user?.fullName || user?.name || "",
    email: user?.email || "",
    designation: user?.designation || roleLabel
  });

  const initials =
    profile.fullName
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleChange = (
    field: keyof ProfileData,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setProfile({
      fullName: user?.fullName || user?.name || "",
      email: user?.email || "",
      designation: user?.designation || roleLabel
    });

    setEditing(false);
  };

  const handleSave = () => {
    // TODO: Connect your update-profile RTK Query mutation here.
    // Local component state alone does not update Redux or MongoDB.
    setEditing(false);
    setSaved(true);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      bgcolor: "#FFFFFF",
    },
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          User information not found. Please log in again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        bgcolor: "#F7F9FC",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: 25, sm: 30 },
            fontWeight: 800,
          }}
        >
          My Profile
        </Typography>

        <Typography sx={{ color: "#64748B", mt: 0.75 }}>
          View and manage your personal information.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "300px minmax(0, 1fr)",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* Profile summary */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E8ECF2",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 2,
                bgcolor:
                  role === "admin" ? "#4F46E5" : "#0891B2",
                fontSize: 34,
                fontWeight: 800,
              }}
            >
              {initials}
            </Avatar>

            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {profile.fullName || "Your Name"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                mt: 0.5,
                overflowWrap: "anywhere",
              }}
            >
              {profile.email || "Email not available"}
            </Typography>

            <Chip
              label={roleLabel}
              size="small"
              sx={{
                mt: 2,
                fontWeight: 700,
                bgcolor:
                  role === "admin" ? "#EEF2FF" : "#E0F2FE",
                color:
                  role === "admin" ? "#4338CA" : "#0369A1",
              }}
            />

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: "left" }}>
              <Typography
                variant="caption"
                sx={{ color: "#64748B", fontWeight: 700 }}
              >
                DESIGNATION
              </Typography>

              <Typography sx={{ fontWeight: 600, mt: 0.5 }}>
                {profile.designation || roleLabel}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Personal information */}
        <Card
          elevation={0}
          sx={{
            border: "1px solid #E8ECF2",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Personal Information
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: "#64748B", mt: 0.5 }}
                >
                  Manage your account details.
                </Typography>
              </Box>

              {!editing && (
                <Button
                  variant="outlined"
                  onClick={() => setEditing(true)}
                  sx={{ textTransform: "none", borderRadius: 2 }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              component="form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSave();
              }}
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                },
                gap: 2.5,
              }}
            >
              <TextField
                label="Full Name"
                value={profile.fullName}
                onChange={(e) =>
                  handleChange("fullName", e.target.value)
                }
                disabled={!editing}
                required
                fullWidth
                sx={fieldSx}
              />

              <TextField
                label="Email Address"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                disabled={!editing}
                required
                fullWidth
                sx={fieldSx}
              />


              <TextField
                label="Designation"
                value={profile.designation}
                onChange={(e) =>
                  handleChange("designation", e.target.value)
                }
                disabled={!editing}
                fullWidth
                sx={fieldSx}
              />





              <TextField
                label="Account Role"
                value={roleLabel}
                disabled
                fullWidth
                sx={fieldSx}
              />

              {editing && (
                <Box
                  sx={{
                    gridColumn: "1 / -1",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    flexWrap: "wrap",
                    mt: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      bgcolor: "#4F46E5",
                      boxShadow: "none",
                      "&:hover": {
                        bgcolor: "#4338CA",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity="success"
          onClose={() => setSaved(false)}
        >
          Profile changes saved in this session.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;