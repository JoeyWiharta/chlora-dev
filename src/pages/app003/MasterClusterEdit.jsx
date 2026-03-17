import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useFormik } from "formik";
import * as Yup from "yup";
import { editCluster } from "../../utils/ListApi";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

const MasterClusterEdit = (props) => {
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    useEffect(() => {
        if (props.modalEditOpen) {
            app003p03ValidInput.resetForm()
            app003p03ValidInput.setFieldValue("clusterId", props.app003ClusterEditData.clusterId)
            app003p03ValidInput.setFieldValue("clusterName", props.app003ClusterEditData.clusterName)

        }
    }, [props.modalEditOpen])

    const handleClose = () => {
        props.setModalEditOpen(false);
    }

    // Validation Form
    const app003p03ValidInput = useFormik({
        initialValues:
        {
            clusterName: "",
        },
        validationSchema: Yup.object
            ({
                clusterId: Yup.string().required("Cluster Id is required."),
                clusterName: Yup.string().required("Cluster Name is required."),
            }),

        onSubmit: async (values, { setSubmitting }) => {
            toast.dismiss()
            setSubmitting(true)
            setLoadingSpinner(true)
            await EditClusterAction(values)
            setSubmitting(false)
        },
    });

    const EditClusterAction = useCallback(async (param) => {
        const toastId = toast.loading("Loading...")
        try {
            const response = await editCluster(
                param.clusterId,
                {
                    clusterName: param.clusterName,
                })
            if (response.status === 200) {
                toast.success("Cluster Has Been Successfully Updated.", { id: toastId })
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
                        <DialogTitle>Edit Cluster</DialogTitle>
                        <DialogDescription>Update the cluster information below
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={app003p03ValidInput.handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        <FieldGroup className="gap-2">
                            <Field className="gap-2">
                                <FieldLabel>Cluster Id</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="clusterId"
                                        name="clusterId"
                                        type="text"
                                        value={app003p03ValidInput.values.clusterId}
                                        onChange={app003p03ValidInput.handleChange}
                                        onBlur={app003p03ValidInput.handleBlur}
                                        aria-invalid={app003p03ValidInput.touched.clusterId && !!app003p03ValidInput.errors.clusterId}
                                        disabled
                                    />
                                </InputGroup>
                                {app003p03ValidInput.touched.clusterId && app003p03ValidInput.errors.clusterId && (
                                    <FieldDescription className="text-xs text-destructive">{app003p03ValidInput.errors.clusterId}</FieldDescription>
                                )}
                            </Field>

                            <Field className="gap-2">
                                <FieldLabel>Cluster Name</FieldLabel>
                                <InputGroup className="overflow-hidden">
                                    <InputGroupInput
                                        id="clusterName"
                                        name="clusterName"
                                        type="text"
                                        placeholder="Enter cluster name"
                                        value={app003p03ValidInput.values.clusterName}
                                        onChange={app003p03ValidInput.handleChange}
                                        onBlur={app003p03ValidInput.handleBlur}
                                        aria-invalid={app003p03ValidInput.touched.clusterName && !!app003p03ValidInput.errors.clusterName}
                                    />
                                </InputGroup>
                                {app003p03ValidInput.touched.clusterName && app003p03ValidInput.errors.clusterName && (
                                    <FieldDescription className="text-xs text-destructive">{app003p03ValidInput.errors.clusterName}</FieldDescription>
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

MasterClusterEdit.propTypes = {
    modalEditOpen: PropTypes.any,
    setModalEditOpen: PropTypes.any,
    refreshTable: PropTypes.any,
    app003ClusterEditData: PropTypes.any,
};

export default MasterClusterEdit