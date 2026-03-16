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

const validationSchema = Yup.object({
    userIdOrEmail: Yup.string().required("Email or UserID is required."),
    password: Yup.string().required("Password is required."),
})

const initialValues = {
    userIdOrEmail: "",
    password: "",
}

const LoginForm = () => {
    const { login } = useAuth();
    const navigate = useNavigate()
    const isSubmittingRef = useRef(false)
    const [isPending, setIsPending] = useState(false)
    const [showPassword, setShowPassword] = useState(false);

    const handleBeforeLogin = (setSubmitting) => {
        toast.dismiss()
        if (isSubmittingRef.current) return false
        isSubmittingRef.current = true
        setSubmitting(true)
        setIsPending(true)
        return true
    }

    const handleLogin = async (values) => {
        const response = await loginApi(values)
        return response
    }

    const handleLoginSuccess = (data, resetForm) => {
        login(data)
        setTimeout(() => {
            resetForm()
            navigate("/")
            isSubmittingRef.current = false
            setIsPending(false)
        }, 1000)
    }

    const handleLoginError = (setSubmitting) => {
        isSubmittingRef.current = false
        setIsPending(false)
        setSubmitting(false)
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            if (!handleBeforeLogin(setSubmitting)) return
            const toastId = toast.loading("Logging in...")
            try {
                const response = await handleLogin(values)
                toast.success(response?.data?.message, { id: toastId })
                handleLoginSuccess(response.data.data, resetForm)
            } catch (error) {
                toast.error(error?.response?.data?.message || "Service unavailable. Please try again later.", { id: toastId })
                handleLoginError(setSubmitting)
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
                                <FieldLabel htmlFor="userIdOrEmail">Email or user id</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="userIdOrEmail"
                                        name="userIdOrEmail"
                                        type="text"
                                        placeholder="Enter your email or user id"
                                        value={formik.values.userIdOrEmail}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-invalid={formik.touched.userIdOrEmail && !!formik.errors.userIdOrEmail}
                                    />
                                </InputGroup>

                                {formik.touched.userIdOrEmail && formik.errors.userIdOrEmail && (
                                    <FieldDescription className="text-xs text-destructive">{formik.errors.userIdOrEmail}</FieldDescription>
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