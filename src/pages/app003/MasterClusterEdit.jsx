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
            formik.resetForm({
                values: {
                    clusterId: props.app003ClusterEditData.clusterId,
                    clusterName: props.app003ClusterEditData.clusterName,
                }
            })
        }
    }, [props.modalEditOpen])

    const handleClose = () => {
        props.setModalEditOpen(false);
    }

    // Validation Form
    const formik = useFormik({
        initialValues:
        {
            clusterId: "",
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
                toast.success("Cluster updated successfully.", { id: toastId })
                props.refreshTable();
                handleClose()
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "System is unavailable, please try again later.", { id: toastId })
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
                    <DialogTitle>Edit Cluster</DialogTitle>
                    <DialogDescription>Update the cluster information below
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={formik.handleSubmit}
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
                                    value={formik.values.clusterId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={formik.touched.clusterId && !!formik.errors.clusterId}
                                    disabled
                                />
                            </InputGroup>
                            {formik.touched.clusterId && formik.errors.clusterId && (
                                <FieldDescription className="text-xs text-destructive">{formik.errors.clusterId}</FieldDescription>
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
                                    value={formik.values.clusterName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={formik.touched.clusterName && !!formik.errors.clusterName}
                                />
                            </InputGroup>
                            {formik.touched.clusterName && formik.errors.clusterName && (
                                <FieldDescription className="text-xs text-destructive">{formik.errors.clusterName}</FieldDescription>
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

MasterClusterEdit.propTypes = {
    modalEditOpen: PropTypes.any,
    setModalEditOpen: PropTypes.any,
    refreshTable: PropTypes.any,
    app003ClusterEditData: PropTypes.any,
};

export default MasterClusterEdit