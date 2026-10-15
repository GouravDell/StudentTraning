import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";

interface AppSettings {
  darkMode: boolean;
  emailNotifications: boolean;
  courseNotifications: boolean;
  approvalNotifications: boolean;
  language: string;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  emailNotifications: true,
  courseNotifications: true,
  approvalNotifications: true,
  language: "en",
};

const loadSettings = (): AppSettings => {
  try {
    const stored = localStorage.getItem("master-panel-settings");

    if (stored) {
      return {
        ...defaultSettings,
        ...JSON.parse(stored),
      };
    }
  } catch {
    // Invalid stored settings ke case mein defaults use honge.
  }

  return defaultSettings;
};

const Settings = () => {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSave = () => {
    try {
      localStorage.setItem(
        "master-panel-settings",
        JSON.stringify(settings)
      );
      setSaved(true);
    } catch {
      window.alert("Settings save nahi ho paayi. Browser storage check karein.");
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);

    try {
      localStorage.setItem(
        "master-panel-settings",
        JSON.stringify(defaultSettings)
      );
    } catch {
      // UI defaults phir bhi apply ho jayenge.
    }
  };

  const switchSx = {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#4F46E5",
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      bgcolor: "#4F46E5",
    },
  };

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
          sx={{ fontSize: { xs: 25, sm: 30 }, fontWeight: 800 }}
        >
          Settings
        </Typography>

        <Typography sx={{ color: "#64748B", mt: 0.75 }}>
          Customize your Master Panel preferences.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 900 }}>
        {/* Appearance */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #E8ECF2",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Appearance
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              Customize how the admin panel looks.
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  Dark Mode
                </Typography>

                <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
                  Save your preferred appearance.
                </Typography>
              </Box>

              <FormControlLabel
                label={settings.darkMode ? "Dark" : "Light"}
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={(e) =>
                      updateSetting("darkMode", e.target.checked)
                    }
                    sx={switchSx}
                  />
                }
              />
            </Box>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #E8ECF2",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Notifications
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              Choose which updates you want to receive.
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                py: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  Email Notifications
                </Typography>

                <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
                  General account and system updates.
                </Typography>
              </Box>

              <Switch
                checked={settings.emailNotifications}
                onChange={(e) =>
                  updateSetting("emailNotifications", e.target.checked)
                }
                sx={switchSx}
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                py: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  New Course Requests
                </Typography>

                <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
                  Updates when users submit course requests.
                </Typography>
              </Box>

              <Switch
                checked={settings.courseNotifications}
                onChange={(e) =>
                  updateSetting("courseNotifications", e.target.checked)
                }
                sx={switchSx}
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                py: 1,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  Approval Updates
                </Typography>

                <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
                  Updates when requests are approved or rejected.
                </Typography>
              </Box>

              <Switch
                checked={settings.approvalNotifications}
                onChange={(e) =>
                  updateSetting("approvalNotifications", e.target.checked)
                }
                sx={switchSx}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Language */}
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #E8ECF2",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Language & Region
            </Typography>

            <Typography variant="body2" sx={{ color: "#64748B", mt: 0.5 }}>
              Choose your preferred dashboard language.
            </Typography>

            <Divider sx={{ my: 2.5 }} />

            <Box sx={{ maxWidth: 350 }}>
              <Typography sx={{ fontWeight: 700, mb: 1 }}>
                Display Language
              </Typography>

              <FormControl fullWidth size="small">
                <Select
                  value={settings.language}
                  onChange={(e) =>
                    updateSetting("language", e.target.value)
                  }
                  sx={{ bgcolor: "#FFFFFF", borderRadius: 2 }}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">Hindi</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Reset Defaults
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              bgcolor: "#4F46E5",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#4338CA",
                boxShadow: "none",
              },
            }}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={saved}
        autoHideDuration={3000}
        onClose={() => setSaved(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setSaved(false)}>
          Settings saved successfully.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;