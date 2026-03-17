import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { addCluster } from "../../utils/ListApi";

const MasterClusterAdd = (props) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  useEffect(() => {
    if (props.modalAddOpen) {
      formik.resetForm()
    }
  }, [props.modalAddOpen])

  const handleClose = () => {
    props.setModalAddOpen(false);
  }

  // Validation Form
  const formik = useFormik({
    initialValues:
    {
      clusterName: "",
    },
    validationSchema: Yup.object
      ({
        clusterName: Yup.string().required("Cluster Name is required."),
      }),

    onSubmit: async (values, { setSubmitting }) => {
      toast.dismiss()
      setSubmitting(true)
      setLoadingSpinner(true)
      await SaveClusterAction(values)
      setSubmitting(false)
    },
  });

  const SaveClusterAction = useCallback(async (param) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await addCluster(param)
      if (response.status === 201 || response.status === 200) {
        toast.success("Cluster added successfully.", { id: toastId })
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
      open={props.modalAddOpen}
      onOpenChange={(open) => { if (!open) handleClose() }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Add Cluster</DialogTitle>
          <DialogDescription>Add a new cluster to the system</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-6"
        >
          <FieldGroup className="gap-2">
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
              {loadingSpinner ? "Saving..." : "Add Cluster"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

MasterClusterAdd.propTypes = {
  modalAddOpen: PropTypes.any,
  setModalAddOpen: PropTypes.any,
  refreshTable: PropTypes.any,
};

export default MasterClusterAdd