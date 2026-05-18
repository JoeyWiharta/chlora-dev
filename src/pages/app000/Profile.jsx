import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RootPageCustom from "../../components/common/RootPageCustom";
import { getProfile, updateProfile } from "../../utils/ListApi";
import PopupDeleteAndRestore from "../../components/common/PopupDeleteAndRestore";
import { Check, Loader2, Pencil, User, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { handleApiError } from "@/utils/ErrorHandler";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";


const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

    // Validation Form
    const profileForm = useFormik({
        initialValues:
        {
            userId: "",
            email: "",
            name: "",
            role: "",
            createdAt: "",
            updatedAt: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .required("Email is required.")
                .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address."),
            name: Yup.string()
                .required("Name is required.")
                .min(4, "Name must be at least 4 characters.")
                .max(20, "Name must not exceed 20 characters.")
                .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces."),
        }),

        onSubmit: async (values, { setSubmitting }) => {
            setLoadingSubmit(true);
            setSubmitting(true);
            try {
                await updateProfile({ email: values.email, name: values.name });
                toast.success("Profile updated successfully.");
                setIsEditing(false);
                fetchProfile();
            } catch (error) {
                if (handleApiError(error)) return;
            } finally {
                setLoadingSubmit(false);
                setSubmitting(false);
            }
        },
    });

    const fetchProfile = useCallback(async () => {
        debugger
        setLoading(true);
        try {
            const response = await getProfile();
            profileForm.setValues({
                userId: response?.data?.userId ?? "",
                email: response?.data?.email ?? "",
                name: response?.data?.name ?? "",
                role: response?.data?.role ?? "",
                createdAt: response?.data?.createdAt ?? "",
                updatedAt: response?.data?.updatedAt ?? "",
            });
        } catch (error) {
            if (handleApiError(error)) return;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleCancelEdit = () => {
        profileForm.resetForm();
        fetchProfile();
        setIsEditing(false);
    };

    const formatDate = (iso) => {
        if (!iso) return "-";
        return new Date(iso).toLocaleDateString("id-ID", {
            day: "2-digit", month: "long", year: "numeric",
        });
    };

    const getInitials = (name) =>
        name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??";




    return (
        <RootPageCustom
            title={"Profile"}
            desc={"Manage your account information and password"}
        >
            <div className="flex flex-col gap-2 flex-1">
                <Card>
                    <CardHeader className="flex flex-row gap-4 items-center">
                        <div className="bg-success/10 p-2 rounded-full">
                            <User size={20} className="text-success" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>Account Information</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </div>
                        {!isEditing ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={() => setIsEditing(true)}
                                disabled={loading}
                            >
                                <Pencil size={14} />
                                Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5"
                                    onClick={handleCancelEdit}
                                    disabled={loadingSubmit}
                                >
                                    <X size={14} />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    form="profile-form"
                                    size="sm"
                                    className="gap-1.5"
                                    disabled={loadingSubmit || !profileForm.dirty || !profileForm.isValid}
                                >
                                    {loadingSubmit
                                        ? <Loader2 size={14} className="animate-spin" />
                                        : <Check size={14} />
                                    }
                                    Save
                                </Button>
                            </div>
                        )}
                    </CardHeader>

                    <CardContent>
                        {/* Avatar strip */}
                        <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-muted/40">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                                {getInitials(profileForm.values.name)}
                            </div>
                            <div className="flex flex-col gap-0.5 min-w-0">
                                <span className="font-medium text-sm truncate">{profileForm.values.name || "-"}</span>
                                <span className="text-xs text-muted-foreground font-mono">{profileForm.values.userId || "-"}</span>
                            </div>
                            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                {profileForm.values.role || "USER"}
                            </span>
                        </div>

                        <form id="profile-form" onSubmit={profileForm.handleSubmit}>
                            <FieldGroup className="grid grid-cols-2 gap-4">

                                {/* User ID — always disabled */}
                                <Field className="gap-2">
                                    <FieldLabel>User ID</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupInput
                                            id="userId"
                                            name="userId"
                                            type="text"
                                            value={profileForm.values.userId}
                                            disabled
                                        />
                                    </InputGroup>
                                </Field>

                                {/* Role — always disabled */}
                                <Field className="gap-2">
                                    <FieldLabel>Role</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupInput
                                            id="role"
                                            name="role"
                                            type="text"
                                            value={profileForm.values.role}
                                            disabled
                                        />
                                    </InputGroup>
                                </Field>

                                {/* Name — editable */}
                                <Field className="gap-2">
                                    <FieldLabel>Name</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupInput
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={profileForm.values.name}
                                            onChange={profileForm.handleChange}
                                            onBlur={profileForm.handleBlur}
                                            aria-invalid={profileForm.touched.name && !!profileForm.errors.name}
                                            disabled={!isEditing}
                                        />
                                    </InputGroup>
                                    {profileForm.touched.name && profileForm.errors.name && (
                                        <FieldDescription className="text-xs text-destructive">
                                            {profileForm.errors.name}
                                        </FieldDescription>
                                    )}
                                </Field>

                                {/* Email — editable */}
                                <Field className="gap-2">
                                    <FieldLabel>Email</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupInput
                                            id="email"
                                            name="email"
                                            type="text"
                                            value={profileForm.values.email}
                                            onChange={profileForm.handleChange}
                                            onBlur={profileForm.handleBlur}
                                            aria-invalid={profileForm.touched.email && !!profileForm.errors.email}
                                            disabled={!isEditing}
                                        />
                                    </InputGroup>
                                    {profileForm.touched.email && profileForm.errors.email && (
                                        <FieldDescription className="text-xs text-destructive">
                                            {profileForm.errors.email}
                                        </FieldDescription>
                                    )}
                                </Field>

                                {/* Date Created — always disabled */}
                                <Field className="gap-2">
                                    <FieldLabel>Date Created</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupInput
                                            id="createdAt"
                                            name="createdAt"
                                            type="text"
                                            value={formatDate(profileForm.values.createdAt)}
                                            disabled
                                        />
                                    </InputGroup>
                                </Field>

                                {/* Last Updated — always disabled */}
                                <Field className="gap-2">
                                    <FieldLabel>Last Updated</FieldLabel>
                                    <InputGroup className="overflow-hidden">
                                        <InputGroupInput
                                            id="updatedAt"
                                            name="updatedAt"
                                            type="text"
                                            value={formatDate(profileForm.values.updatedAt)}
                                            disabled
                                        />
                                    </InputGroup>
                                </Field>

                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your password to keep your account secure</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-center justify-end gap-2 mb-4">



                        </div>

                    </CardContent>
                </Card>
            </div >


            {
                modalDeleteOpen && (
                    <PopupDeleteAndRestore
                        status={"delete"}
                        modalOpen={modalDeleteOpen}
                        modalClose={() => setModalDeleteOpen(false)}
                        loading={loading}
                        onClick={app004HandleDeleteDevice}
                    />
                )
            }

        </RootPageCustom >
    );
}

export default Profile;