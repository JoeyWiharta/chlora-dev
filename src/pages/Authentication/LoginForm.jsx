import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import toast from "react-hot-toast";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import SmallIcon from "../../assets/images/SmallIcon.png"
import { useAuth } from "../../context/AuthContext";
import { loginApi } from "../../utils/ListApi";

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate()

    // Form and UI Controller
    const isSubmittingRef = useRef(false)
    const [isPending, setIsPending] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (values) => {
        const response = await loginApi({
            user_id_or_email: values.username,
            password: values.password
        })
        return response
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Email or Username is required."),
            password: Yup.string().required("Password is required."),
        }),
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            toast.dismiss()
            if (isSubmittingRef.current) return
            isSubmittingRef.current = true
            setSubmitting(true)
            setIsPending(true)
            const toastId = toast.loading("Logging in...")

            try {
                const response = await handleLogin(values)
                login(response.data.data)
                toast.success("Logged in successfully.", { id: toastId })
                setTimeout(() => {
                    resetForm()
                    navigate("/")
                }, 1000)
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message, { id: toastId })
                } else {
                    toast.error("System is Unavailable. Please Try Again Later.", { id: toastId })
                }
                    isSubmittingRef.current = false
                    setIsPending(false)
                    setSubmitting(false)
            }
        },
    });

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader className="text-center gap-1">
                    <div className="flex justify-center">
                        <img src={SmallIcon} className="w-10 h-10" />
                    </div>
                    <CardTitle className="text-xl">Welcome back to Chlora</CardTitle>
                    <CardDescription>
                        Monitor your plantation, anytime.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <form
                        className="flex flex-col gap-6"
                        onSubmit={formik.handleSubmit}
                    >
                        <FieldGroup className="gap-2">
                            <Field className="flex flex-col gap-2">
                                <FieldLabel htmlFor="username">Email or user id</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter your email or user id"
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-invalid={formik.touched.username && !!formik.errors.username}
                                    />
                                </InputGroup>

                                {formik.touched.username && formik.errors.username && (
                                    <FieldDescription className="text-xs text-destructive">{formik.errors.username}</FieldDescription>
                                )}

                            </Field>

                            <Field className="flex flex-col gap-2">
                                <FieldLabel htmlFor="password">Password</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-invalid={formik.touched.password && !!formik.errors.password}
                                    />
                                    <InputGroupAddon align="inline-end" onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                                    </InputGroupAddon>
                                </InputGroup>

                                {formik.touched.password && formik.errors.password && (
                                    <FieldDescription className="text-xs text-destructive">{formik.errors.password}</FieldDescription>
                                )}
                            </Field>

                            <Button type="submit" disabled={isPending} className="w-full mt-4">
                                {isPending ? "Signing in..." : "Login"}
                            </Button>
                        </FieldGroup>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="underline underline-offset-4 hover:text-primary">
                            Sign up
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginForm;