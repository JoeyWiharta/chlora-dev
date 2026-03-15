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
import toast from "react-hot-toast";

const MasterDeviceEdit = (props) => {
    const [loadingSpinner, setLoadingSpinner] = useState(false);
    const handleClose = () => { props.setModalEditOpen(false) }

    useEffect(() => {
        if (props.modalEditOpen) {
            app004p03ValidInput.resetForm()
            app004p03ValidInput.setFieldValue("deviceId", props.app004DeviceEditData.deviceId)
            app004p03ValidInput.setFieldValue("deviceName", props.app004DeviceEditData.deviceName)
            app004p03ValidInput.setFieldValue("deviceType", props.app004DeviceEditData.deviceType)
            app004p03ValidInput.setFieldValue("clusterId", props.app004DeviceEditData.clusterId)
            app004p03ValidInput.setFieldValue("status", props.app004DeviceEditData.status)
        }
    }, [props.modalEditOpen])

    // Validation Form
    const app004p03ValidInput = useFormik({
        initialValues:
        {
            deviceName: "",
            deviceType: "",
            clusterId: "",
            status: "",
        },
        validationSchema: Yup.object
            ({
                deviceName: Yup.string().required("Device Name is required."),
                deviceType: Yup.string().required("Device Type is required."),
                clusterId: Yup.string().required("Cluster Name is required."),
                status: Yup.string().required("Status is required."),
            }),

        onSubmit: async (values, { setSubmitting }) => {
            toast.dismissAll()
            setSubmitting(true)
            setLoadingSpinner(true)
            await EditDeviceAction(values)
            setSubmitting(false)
        },
    });

    const EditDeviceAction = useCallback(async (param) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await editDevice(
                param.deviceId,
                {
                    deviceName: param.deviceName,
                    deviceType: param.deviceType,
                    clusterId: param.clusterId,
                    status: param.status
                }
            )
            if (response.status === 200) {
                toast.success("Device Has Been Successfully Updated.", { id: toastId })
                props.refreshTable();
                handleClose()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "System is Unavailable. Please Try Again Later.", { id: toastId })
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
                                <FieldLabel>Device Type</FieldLabel>
                                <Select
                                    value={app004p03ValidInput.values.deviceType}
                                    onValueChange={(val) => app004p03ValidInput.setFieldValue("deviceType", val)}
                                // onOpenChange={() => app004p03ValidInput.setFieldTouched("deviceType", true)}
                                >
                                    <SelectTrigger
                                        id="deviceType"
                                        aria-invalid={app004p03ValidInput.touched.deviceType && !!app004p03ValidInput.errors.deviceType}
                                    >
                                        <SelectValue placeholder="Select device type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {props.deviceTypeOption.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {app004p03ValidInput.touched.deviceType && app004p03ValidInput.errors.deviceType && (
                                    <FieldDescription className="text-xs text-destructive">{app004p03ValidInput.errors.deviceType}</FieldDescription>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Cluster Name</FieldLabel>
                                <Select
                                    value={app004p03ValidInput.values.clusterId}
                                    onValueChange={(val) => app004p03ValidInput.setFieldValue("clusterId", val)}
                                // onOpenChange={() => app004p03ValidInput.setFieldTouched("deviceType", true)}
                                >
                                    <SelectTrigger
                                        id="clusterId"
                                        aria-invalid={app004p03ValidInput.touched.clusterId && !!app004p03ValidInput.errors.clusterId}
                                    >
                                        <SelectValue placeholder="Select Cluster Name" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {props.clusterOption.map((item) => (
                                                <SelectItem key={item.value} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {app004p03ValidInput.touched.clusterId && app004p03ValidInput.errors.clusterId && (
                                    <FieldDescription className="text-xs text-destructive">{app004p03ValidInput.errors.clusterId}</FieldDescription>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Status</FieldLabel>
                                <Select
                                    value={app004p03ValidInput.values.status}
                                    onValueChange={(val) => app004p03ValidInput.setFieldValue("status", val)}
                                // onOpenChange={() => app004p03ValidInput.setFieldTouched("deviceType", true)}
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
        </React.Fragment>
    )
}

MasterDeviceEdit.propTypes = {
    modalEditOpen: PropTypes.any,
    setModalEditOpen: PropTypes.any,
    refreshTable: PropTypes.any,
    app004ClusterEditData: PropTypes.any,
    clusterOption: PropTypes.any,
    deviceTypeOption: PropTypes.any,
};

export default MasterDeviceEdit