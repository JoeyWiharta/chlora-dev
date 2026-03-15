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
      app003p02ValidInput.resetForm()
    }
  }, [props.modalAddOpen])

  const handleClose = () => {
    props.setModalAddOpen(false);
  }

  // Validation Form
  const app003p02ValidInput = useFormik({
    initialValues:
    {
      clusterName: "",
    },
    validationSchema: Yup.object
      ({
        clusterName: Yup.string().required("Cluster Name is required."),
      }),

    onSubmit: async (values, { setSubmitting }) => {
      toast.dismissAll()
      setSubmitting(true)
      setLoadingSpinner(true)
      await SaveClusterAction(values)
      setSubmitting(false)
    },
  });

  const SaveClusterAction = useCallback(async (param) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await addCluster({
        clusterName: param.clusterName
      })
      if (response.status === 201 || response.status === 200) {
        toast.success("Cluster Has Been Successfully Added.", { id: toastId })
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
            onSubmit={app003p02ValidInput.handleSubmit}
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
                    value={app003p02ValidInput.values.clusterName}
                    onChange={app003p02ValidInput.handleChange}
                    onBlur={app003p02ValidInput.handleBlur}
                    aria-invalid={app003p02ValidInput.touched.clusterName && !!app003p02ValidInput.errors.clusterName}
                  />
                </InputGroup>
                {app003p02ValidInput.touched.clusterName && app003p02ValidInput.errors.clusterName && (
                  <FieldDescription className="text-xs text-destructive">{app003p02ValidInput.errors.clusterName}</FieldDescription>
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
    </React.Fragment>
  )
}

MasterClusterAdd.propTypes = {
  modalAddOpen: PropTypes.any,
  setModalAddOpen: PropTypes.any,
  refreshTable: PropTypes.any,
};

export default MasterClusterAdd