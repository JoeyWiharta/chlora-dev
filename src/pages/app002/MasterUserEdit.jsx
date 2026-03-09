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
    // State for Loading Spinner
    const [loadingSpinner, setLoadingSpinner] = useState(false);



    useEffect(() => {
        if (props.modalEditOpen) {
            app002p03ValidInput.resetForm()
            app002p03ValidInput.setFieldValue("userId", props.app002UserEditData.user_id)
            app002p03ValidInput.setFieldValue("email", props.app002UserEditData.email)
            app002p03ValidInput.setFieldValue("name", props.app002UserEditData.name)
            app002p03ValidInput.setFieldValue("role", props.app002UserEditData.role)
        }
    }, [props.modalEditOpen])

    // Function Close, Reset, and Refresh After Submitting
    const handleClose = () => {
        props.setModalEditOpen(false);
    }

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
                    .matches(
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        "Please enter a valid email address."
                    ),
                name: Yup.string()
                    .required("Name is required."),
                role: Yup.string().required("Role is required."),
            }),

        onSubmit: async (values, { setSubmitting }) => {
            debugger
            toast.dismiss()
            setSubmitting(true)
            setLoadingSpinner(true)
            await EditUserAction(values)
            setSubmitting(false)
        },
    });

    const EditUserAction = useCallback(async (param) => {
        try {
            debugger
            const response = await editUser(
                param.userId,
                {
                    email: param.email,
                    name: param.name,
                    role: param.role
                })
            if (response.status === 200) {
                props.setApp002setMsg("User Has Been Successfully Updated.");
                props.setApp002setMsgStatus("success");
                props.refreshTable();
                handleClose()
            }
        } catch (error) {
            debugger
            toast.error(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.")

            // props.setApp002setMsg(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.")
            // props.setApp002setMsgStatus("error")
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
                >
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user details to ensure accurate user management
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
                                <FieldLabel>Email</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="email"
                                        name="email"
                                        type="text"
                                        placeholder="Enter email"
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
                                    onOpenChange={() => app002p03ValidInput.setFieldTouched("role", true)}
                                >
                                    <SelectTrigger
                                        id="role"
                                        aria-invalid={app002p03ValidInput.touched.role && !!app002p03ValidInput.errors.role}
                                    >
                                        <SelectValue placeholder="Select role" />
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
                                variant="primary"
                                className="flex-1"
                                disabled={loadingSpinner}
                            >
                                <Spinner
                                    data-icon="inline-start"
                                    className={loadingSpinner ? "flex" : 'hidden'}
                                />
                                {loadingSpinner ? "Updating..." : "Update"}
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
    app002Msg: PropTypes.any,
    setApp002setMsg: PropTypes.any,
    app002MsgStatus: PropTypes.any,
    setApp002setMsgStatus: PropTypes.any,
    app002UserEditData: PropTypes.any,
    roleOptions: PropTypes.any,
};

export default MasterUserEdit