import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignupMutation } from "../redux/slices/services/authApi";

// Change this import to your actual RTK Query API file.
// import { useSignupMutation } from "../redux/api/authApi";

const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters"),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Enter a valid email"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [apiError, setApiError] = useState("");

  const [signup, { isLoading }] = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setApiError("");

    try {
      const { confirmPassword, ...signupData } = data;

      // Call backend signup API.
      await signup(signupData).unwrap();

      // Signup is complete; user can now sign in.
      navigate("/login", {
        replace: true,
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (error: unknown) {
      const err = error as {
        data?: { message?: string };
        message?: string;
      };

      setApiError(
        err.data?.message ||
          err.message ||
          "Unable to create account. Please try again."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F5F7FB",
        boxSizing: "border-box",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 430,
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, mb: 1 }}
          >
            Create Account
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Sign up to get started with your account
          </Typography>
        </Box>

        {apiError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setApiError("")}
          >
            {apiError}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            fullWidth
            label="Full Name"
            placeholder="Enter your name"
            margin="normal"
            autoComplete="name"
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            margin="normal"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            margin="normal"
            autoComplete="new-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            margin="normal"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="button"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: 2,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 700,
              bgcolor: "#4F46E5",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#4338CA",
                boxShadow: "none",
              },
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress
                  size={20}
                  color="inherit"
                  sx={{ mr: 1 }}
                />
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </Box>

        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#4F46E5",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Signup;