import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { addDevice } from "../../utils/ListApi";

const MasterDeviceAdd = (props) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  useEffect(() => {
    if (props.modalAddOpen) {
      app004p02ValidInput.resetForm()
    }
  }, [props.modalAddOpen])

  const handleClose = () => {
    debugger
    props.setModalAddOpen(false);
  }

  // Validation Form
  const app004p02ValidInput = useFormik({
    initialValues:
    {
      deviceName: "",
      deviceType: "",
      clusterId: "",
    },
    validationSchema: Yup.object
      ({
        deviceName: Yup.string().required("Device Name is required."),
        deviceType: Yup.string().required("Device Type is required."),
        clusterId: Yup.string().required("Cluster Name is required."),
      }),

    onSubmit: async (values, { setSubmitting }) => {
      toast.dismiss()
      setSubmitting(true)
      setLoadingSpinner(true)
      await SaveDeviceAction(values)
      setSubmitting(false)
    },
  });

  const SaveDeviceAction = useCallback(async (param) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await addDevice(param)
      if (response.status === 201 || response.status === 200) {
        toast.success("Device Has Been Successfully Added.", { id: toastId })
        props.refreshTable();
        handleClose()
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.", { id: toastId })
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
            <DialogTitle>Add Device</DialogTitle>
            <DialogDescription>Add a new device to the master list</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={app004p02ValidInput.handleSubmit}
            className="flex flex-col gap-6"
          >
            <FieldGroup className="gap-2">
              <Field className="gap-2">
                <FieldLabel>Device Name</FieldLabel>
                <InputGroup className="overflow-hidden">
                  <InputGroupInput
                    id="deviceName"
                    name="deviceName"
                    type="text"
                    placeholder="Enter device name"
                    value={app004p02ValidInput.values.deviceName}
                    onChange={app004p02ValidInput.handleChange}
                    onBlur={app004p02ValidInput.handleBlur}
                    aria-invalid={app004p02ValidInput.touched.deviceName && !!app004p02ValidInput.errors.deviceName}
                  />
                </InputGroup>
                {app004p02ValidInput.touched.deviceName && app004p02ValidInput.errors.deviceName && (
                  <FieldDescription className="text-xs text-destructive">{app004p02ValidInput.errors.deviceName}</FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>Device Type</FieldLabel>
                <Select
                  value={app004p02ValidInput.values.deviceType}
                  onValueChange={(val) => app004p02ValidInput.setFieldValue("deviceType", val)}
                  onOpenChange={() => app004p02ValidInput.setFieldTouched("deviceType", true)}
                >
                  <SelectTrigger
                    id="deviceType"
                    aria-invalid={app004p02ValidInput.touched.deviceType && !!app004p02ValidInput.errors.deviceType}
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
                {app004p02ValidInput.touched.deviceType && app004p02ValidInput.errors.deviceType && (
                  <FieldDescription className="text-xs text-destructive">{app004p02ValidInput.errors.deviceType}</FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>Cluster Name</FieldLabel>
                <Select
                  value={app004p02ValidInput.values.clusterName}
                  onValueChange={(val) => app004p02ValidInput.setFieldValue("clusterName", val)}
                  onOpenChange={() => app004p02ValidInput.setFieldTouched("clusterName", true)}
                >
                  <SelectTrigger
                    id="deviceType"
                    aria-invalid={app004p02ValidInput.touched.clusterName && !!app004p02ValidInput.errors.clusterName}
                  >
                    <SelectValue placeholder="Select device type" />
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
                {app004p02ValidInput.touched.clusterName && app004p02ValidInput.errors.clusterName && (
                  <FieldDescription className="text-xs text-destructive">{app004p02ValidInput.errors.clusterName}</FieldDescription>
                )}
              </Field>

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
                  {loadingSpinner ? "Saving..." : "Add Device"}
                </Button>
              </DialogFooter>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

MasterDeviceAdd.propTypes = {
  modalAddOpen: PropTypes.any,
  setModalAddOpen: PropTypes.any,
  refreshTable: PropTypes.any,
};

export default MasterDeviceAdd