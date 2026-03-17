import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useFormik } from "formik";
import * as Yup from "yup";
import { editUser } from "../../utils/ListApi";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

const MasterUserEdit = (props) => {
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const handleClose = () => { props.setModalEditOpen(false) }

    useEffect(() => {
        if (props.modalEditOpen) {
            app002p03ValidInput.resetForm()
            app002p03ValidInput.setFieldValue("userId", props.app002UserEditData.userId)
            app002p03ValidInput.setFieldValue("email", props.app002UserEditData.email)
            app002p03ValidInput.setFieldValue("name", props.app002UserEditData.name)
            app002p03ValidInput.setFieldValue("role", props.app002UserEditData.role)
        }
    }, [props.modalEditOpen])

    // Validation Form
    const app002p03ValidInput = useFormik({
        initialValues:
        {
            userId: "",
            email: "",
            name: "",
            role: "",
        },
        validationSchema: Yup.object
            ({
                email: Yup.string()
                    .required("Email is required.")
                    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address."),
                name: Yup.string().required("Name is required."),
                role: Yup.string().required("Role is required."),
            }),

        onSubmit: async (values, { setSubmitting }) => {
            toast.dismiss()
            setSubmitting(true)
            setLoadingSpinner(true)
            await EditUserAction(values)
            setSubmitting(false)
        },
    });

    const EditUserAction = useCallback(async (param) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await editUser(
                param.userId,
                {
                    email: param.email,
                    name: param.name,
                    role: param.role
                })
            if (response.status === 200) {
                toast.success("User updated successfully.", { id: toastId })
                props.refreshTable();
                handleClose()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "System is unavailable, please try again later.", { id: toastId })
        } finally {
            setLoadingSpinner(false)
        }
    })

    return (
        <React.Fragment>
            <Dialog
                open={props.modalEditOpen}
                onOpenChange={(open) => { if (!open) handleClose() }}
            >
                <DialogContent
                    className="sm:max-w-md"
                    onInteractOutside={(e) => e.preventDefault()}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update the user's information below
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={app002p03ValidInput.handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        <FieldGroup className="gap-2">
                            <Field className="gap-2">
                                <FieldLabel>User Id</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="userId"
                                        name="userId"
                                        type="text"
                                        value={app002p03ValidInput.values.userId}
                                        onChange={app002p03ValidInput.handleChange}
                                        onBlur={app002p03ValidInput.handleBlur}
                                        aria-invalid={app002p03ValidInput.touched.userId && !!app002p03ValidInput.errors.userId}
                                        disabled
                                    />
                                </InputGroup>
                                {app002p03ValidInput.touched.userId && app002p03ValidInput.errors.userId && (
                                    <FieldDescription className="text-xs text-destructive">{app002p03ValidInput.errors.userId}</FieldDescription>
                                )}
                            </Field>

                            <Field className="gap-2">
                                <FieldLabel>Name</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter full name"
                                        value={app002p03ValidInput.values.name}
                                        onChange={app002p03ValidInput.handleChange}
                                        onBlur={app002p03ValidInput.handleBlur}
                                        aria-invalid={app002p03ValidInput.touched.name && !!app002p03ValidInput.errors.name}
                                    />
                                </InputGroup>
                                {app002p03ValidInput.touched.name && app002p03ValidInput.errors.name && (
                                    <FieldDescription className="text-xs text-destructive">{app002p03ValidInput.errors.name}</FieldDescription>
                                )}
                            </Field>

                            <Field className="gap-2">
                                <FieldLabel>Email Address</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="email"
                                        name="email"
                                        type="text"
                                        placeholder="Enter email address"
                                        value={app002p03ValidInput.values.email}
                                        onChange={app002p03ValidInput.handleChange}
                                        onBlur={app002p03ValidInput.handleBlur}
                                        aria-invalid={app002p03ValidInput.touched.email && !!app002p03ValidInput.errors.email}
                                    />
                                </InputGroup>
                                {app002p03ValidInput.touched.email && app002p03ValidInput.errors.email && (
                                    <FieldDescription className="text-xs text-destructive">{app002p03ValidInput.errors.email}</FieldDescription>
                                )}
                            </Field>

                            <Field className="gap-2">
                                <FieldLabel>Role</FieldLabel>
                                <Select
                                    value={app002p03ValidInput.values.role}
                                    onValueChange={(val) => app002p03ValidInput.setFieldValue("role", val)}
                                // onOpenChange={() => app002p03ValidInput.setFieldTouched("role", true)}
                                >
                                    <SelectTrigger
                                        id="role"
                                        aria-invalid={app002p03ValidInput.touched.role && !!app002p03ValidInput.errors.role}
                                    >
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {props.roleOptions.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {app002p03ValidInput.touched.role && app002p03ValidInput.errors.role && (
                                    <FieldDescription className="text-xs text-destructive">{app002p03ValidInput.errors.role}</FieldDescription>
                                )}
                            </Field>
                        </FieldGroup>

                        <DialogFooter className="flex-row gap-2">
                            <DialogClose asChild>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={loadingSpinner}
                            >
                                <Spinner
                                    data-icon="inline-start"
                                    className={loadingSpinner ? "flex" : 'hidden'}
                                />
                                {loadingSpinner ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </React.Fragment >
    )
}

MasterUserEdit.propTypes = {
    modalEditOpen: PropTypes.any,
    setModalEditOpen: PropTypes.any,
    refreshTable: PropTypes.any,
    app002UserEditData: PropTypes.any,
    roleOptions: PropTypes.any,
};

export default MasterUserEdit