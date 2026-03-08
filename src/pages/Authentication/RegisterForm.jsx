import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { EyeIcon, EyeOffIcon, Sprout } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from "@/components/ui/card";
import SmallIcon from "../../assets/images/SmallIcon.png"
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../utils/ListApi";
import toast from "react-hot-toast";

const RegisterForm = () => {
    const navigate = useNavigate()
    const isSubmittingRef = useRef(false)
    const [isPending, setIsPending] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    const handleRegister = async (values) => {
        const response = await registerApi({
            name: values.username,
            email: values.email,
            password: values.password,
            confirm_password: values.rePassword
        })
        return response;
    };

    // Validation Form
    const formik = useFormik({
        initialValues:
        {
            username: "",
            email: "",
            password: "",
            rePassword: "",
        },
        validationSchema: Yup.object
            ({
                username: Yup.string()
                    .required("Name is required.")
                    .min(4, "Name must be at least 4 characters.")
                    .max(20, "Name must not exceed 20 characters.")
                    .matches(
                        /^[A-Za-z\s]+$/,
                        "Name can only contain letters and spaces."
                    ),
                email: Yup.string()
                    .required("Email is required.")
                    .matches(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        "Please enter a valid email address."
                    ),
                password: Yup.string()
                    .required("Password is required.")
                    .min(8, "Password must be at least 8 characters.")
                    .max(64, "Password must not exceed 64 characters.")
                    .matches(/[a-z]/, "Password must contain at least one lowercase letter.")
                    .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
                    .matches(/[0-9]/, "Password must contain at least one number."),
                rePassword: Yup.string()
                    .required("Please confirm your password.")
                    .oneOf([Yup.ref("password"), null], "Password do not match"),
            }),

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            toast.dismiss()
            if (isSubmittingRef.current) return
            isSubmittingRef.current = true
            setSubmitting(true)
            setIsPending(true)
            const toastId = toast.loading("Creating account...")

            try {
                const response = await handleRegister(values)
                toast.success(response?.data?.message || "Account created successfully.", { id: toastId })
                setTimeout(() => {
                    toast.loading("Redirecting to login...", { id: toastId })
                    setTimeout(() => {
                        resetForm()
                        setShowPassword(false)
                        setShowRePassword(false)
                        navigate("/login")
                        toast.dismiss()
                    }, 1000)
                }, 1500)
            } catch (error) {
                toast.error(error?.response?.data?.message || "System is Unavailable. Please Try Again Later.", { id: toastId })
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
                    <CardTitle className="text-xl">Create your account</CardTitle>
                    <CardDescription>
                        Start monitoring your plantation today.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <form
                        className="flex flex-col gap-6"
                        onSubmit={formik.handleSubmit}
                    >
                        <FieldGroup className="gap-2">
                            <Field className="flex flex-col gap-2">
                                <FieldLabel htmlFor="username">Name</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="username"
                                        name="username"
                                        type="text"
                                        placeholder="Enter your full name"
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
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="email"
                                        name="email"
                                        type="text"
                                        placeholder="Enter your email address"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-invalid={formik.touched.email && !!formik.errors.email}
                                    />
                                </InputGroup>

                                {formik.touched.email && formik.errors.email && (
                                    <FieldDescription className="text-xs text-destructive">{formik.errors.email}</FieldDescription>
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

                            <Field className="flex flex-col gap-2">
                                <FieldLabel htmlFor="rePassword">Confirm Password</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="rePassword"
                                        name="rePassword"
                                        type={showRePassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formik.values.rePassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-invalid={formik.touched.rePassword && !!formik.errors.rePassword}
                                    />
                                    <InputGroupAddon align="inline-end" onClick={() => setShowRePassword(!showRePassword)}>
                                        {showRePassword ? <EyeIcon /> : <EyeOffIcon />}
                                    </InputGroupAddon>
                                </InputGroup>

                                {formik.touched.rePassword && formik.errors.rePassword && (
                                    <FieldDescription className="text-xs text-destructive">{formik.errors.rePassword}</FieldDescription>
                                )}
                            </Field>

                            <Button type="submit" disabled={isPending} className="w-full mt-4">
                                {isPending ? "Creating account..." : "Create account"}
                            </Button>
                        </FieldGroup>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterForm;