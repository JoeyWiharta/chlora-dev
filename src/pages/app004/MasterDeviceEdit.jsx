import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useFormik } from "formik";
import * as Yup from "yup";
import { editDevice } from "../../utils/ListApi";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ToasterCustom } from "@/components/common/ToasterCustom";

const MasterDeviceEdit = (props) => {
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const handleClose = () => { props.setModalEditOpen(false) }

    useEffect(() => {
        if (props.modalEditOpen) {
            console.log("Edit Data", props.app004DeviceEditData) // cek isinya

            app004p03ValidInput.resetForm({
                values: {
                    deviceId: props.app004DeviceEditData.deviceId,
                    deviceName: props.app004DeviceEditData.deviceName,
                    potId: props.app004DeviceEditData.potId,
                    status: props.app004DeviceEditData.status,
                }
            })
        }
    }, [props.modalEditOpen])

    // Validation Form
    const app004p03ValidInput = useFormik({
        initialValues:
        {
            deviceName: "",
            potId: "",
            status: "",
        },
        validationSchema: Yup.object
            ({
                deviceName: Yup.string().required("Device Name is required."),
                potId: Yup.string().required("Pot Name is required."),
                status: Yup.string().required("Status is required."),
            }),

        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true)
            setLoadingSpinner(true)
            await EditDeviceAction(values)
            setSubmitting(false)
        },
    });

    const EditDeviceAction = useCallback(async (param) => {
        debugger
        try {
            await ToasterCustom.promise(editDevice(param.deviceId, {
                deviceName: param.deviceName,
                potId: param.potId,
                status: param.status
            }),
                {
                    loading: "Saving changes...",
                    success: "Device updated successfully.",
                    error: (err) => err?.response?.data?.message || "System is unavailable, please try again later."
                }
            )
            props.refreshTable();
            handleClose()
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingSpinner(false)
        }
    }, [])

    return (
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
                    <DialogTitle>Edit Device</DialogTitle>
                    <DialogDescription>Update the device information</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={app004p03ValidInput.handleSubmit}
                    className="flex flex-col gap-6"
                >
                    <FieldGroup className="gap-2">
                        <Field className="gap-2">
                            <FieldLabel>Device Id</FieldLabel>
                            <InputGroup className="overflow-hidden">
                                <InputGroupInput
                                    id="deviceId"
                                    name="deviceId"
                                    type="text"
                                    value={app004p03ValidInput.values.deviceId}
                                    onChange={app004p03ValidInput.handleChange}
                                    onBlur={app004p03ValidInput.handleBlur}
                                    aria-invalid={app004p03ValidInput.touched.deviceId && !!app004p03ValidInput.errors.deviceId}
                                    disabled
                                />
                            </InputGroup>
                            {app004p03ValidInput.touched.deviceId && app004p03ValidInput.errors.deviceId && (
                                <FieldDescription className="text-xs text-destructive">{app004p03ValidInput.errors.deviceId}</FieldDescription>
                            )}
                        </Field>

                        <Field className="gap-2">
                            <FieldLabel>Device Name</FieldLabel>
                            <InputGroup className="overflow-hidden">
                                <InputGroupInput
                                    id="deviceName"
                                    name="deviceName"
                                    type="text"
                                    placeholder="Enter device name"
                                    value={app004p03ValidInput.values.deviceName}
                                    onChange={app004p03ValidInput.handleChange}
                                    onBlur={app004p03ValidInput.handleBlur}
                                    aria-invalid={app004p03ValidInput.touched.deviceName && !!app004p03ValidInput.errors.deviceName}
                                />
                            </InputGroup>
                            {app004p03ValidInput.touched.deviceName && app004p03ValidInput.errors.deviceName && (
                                <FieldDescription className="text-xs text-destructive">{app004p03ValidInput.errors.deviceName}</FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Pot Name</FieldLabel>
                            <Select
                                value={app004p03ValidInput.values.potId}
                                onValueChange={(val) => app004p03ValidInput.setFieldValue("potId", val)}
                            >
                                <SelectTrigger
                                    id="potId"
                                    aria-invalid={app004p03ValidInput.touched.potId && !!app004p03ValidInput.errors.potId}
                                >
                                    <SelectValue placeholder="Select Pot Name" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {props.potOption.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {app004p03ValidInput.touched.potId && app004p03ValidInput.errors.potId && (
                                <FieldDescription className="text-xs text-destructive">{app004p03ValidInput.errors.potId}</FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <Select
                                value={app004p03ValidInput.values.status}
                                onValueChange={(val) => app004p03ValidInput.setFieldValue("status", val)}
                                disabled={true}
                            >
                                <SelectTrigger
                                    id="status"
                                    aria-invalid={app004p03ValidInput.touched.status && !!app004p03ValidInput.errors.status}
                                >
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {props.statusOption.map((item) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {app004p03ValidInput.touched.status && app004p03ValidInput.errors.status && (
                                <FieldDescription className="text-xs text-destructive">{app004p03ValidInput.errors.status}</FieldDescription>
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
    )
}

MasterDeviceEdit.propTypes = {
    modalEditOpen: PropTypes.any,
    setModalEditOpen: PropTypes.any,
    refreshTable: PropTypes.any,
    app004DeviceEditData: PropTypes.any,
    potOption: PropTypes.any,
};

export default MasterDeviceEdit