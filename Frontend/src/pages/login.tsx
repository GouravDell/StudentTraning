import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography,
} from "@mui/material";

import {
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../redux/slices/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";

const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email"),

    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormData) => {

        try {
            const response: any = await login(data).unwrap();
            if (response?.status) {
                dispatch(
                    setCredentials({
                        token: response.data.accessToken,
                        user: response.data.user,
                    })
                );
                navigate("/dashboard", { replace: true });
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f7fb",
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
                {/* Header */}
                <Box
                    sx={{
                        textAlign: "center",
                        mb: 4,
                    }}
                >
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                        }}
                    >
                        Welcome Back
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                        }}
                    >
                        Sign in to continue to your account
                    </Typography>
                </Box>

                {/* Form */}
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        placeholder="Enter your email"
                        margin="normal"
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
                        {...register("password")}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            type="button"
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

                    {/* Remember + Forgot */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mt: 1,
                        }}
                    >
                        <FormControlLabel
                            control={<Checkbox />}
                            label="Remember me"
                        />

                        <Link
                            to="/forgot-password"
                            style={{
                                textDecoration: "none",
                                color: "#1976d2",
                                fontSize: "14px",
                            }}
                        >
                            Forgot password?
                        </Link>
                    </Box>

                    {/* Login Button */}
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
                            fontWeight: 600,
                        }}
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                </Box>

                {/* Signup */}
                <Box
                    sx={{
                        textAlign: "center",
                        mt: 3,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                        }}
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            style={{
                                color: "#1976d2",
                                fontWeight: 600,
                                textDecoration: "none",
                            }}
                        >
                            Create Account
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;