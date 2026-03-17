import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useFormik } from "formik";
import * as Yup from "yup";
import { addUser } from "../../utils/ListApi";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

const MasterUserAdd = (props) => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);

  useEffect(() => {
    if (props.modalAddOpen) {
      app002p02ValidInput.resetForm()
    }
  }, [props.modalAddOpen])

  const handleClose = () => {
    props.setModalAddOpen(false);
  }

  const app002p02ValidInput = useFormik({
    initialValues:
    {
      email: "",
      name: "",
      role: "",
    },
    validationSchema: Yup.object
      ({
        name: Yup.string().required("Name is required.").min(4, "Name must be at least 4 characters.").max(20, "Name must not exceed 20 characters.").matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces."),
        email: Yup.string().required("Email is required.").matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address."),
        role: Yup.string().required("Role is required."),
      }),

    onSubmit: async (values, { setSubmitting }) => {
      toast.dismiss()
      setSubmitting(true)
      setLoadingSpinner(true)
      await SaveUserAction(values)
      setSubmitting(false)
    },
  });

  const SaveUserAction = useCallback(async (param) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await addUser(param)
      if (response.status === 201 || response.status === 200) {
        toast.success("User added successfully.", { id: toastId })
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
        open={props.modalAddOpen}
        onOpenChange={(open) => { if (!open) handleClose() }}
      >
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
            <DialogDescription>Fill in the details below to create a new user account</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={app002p02ValidInput.handleSubmit}
            className="flex flex-col gap-6"
          >
            <FieldGroup className="gap-2">
              <Field>
                <FieldLabel>Name</FieldLabel>
                <InputGroup className="overflow-hidden">
                  <InputGroupInput
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={app002p02ValidInput.values.name}
                    onChange={app002p02ValidInput.handleChange}
                    onBlur={app002p02ValidInput.handleBlur}
                    aria-invalid={app002p02ValidInput.touched.name && !!app002p02ValidInput.errors.name}
                  />
                </InputGroup>
                {app002p02ValidInput.touched.name && app002p02ValidInput.errors.name && (
                  <FieldDescription className="text-xs text-destructive">{app002p02ValidInput.errors.name}</FieldDescription>
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
                    value={app002p02ValidInput.values.email}
                    onChange={app002p02ValidInput.handleChange}
                    onBlur={app002p02ValidInput.handleBlur}
                    aria-invalid={app002p02ValidInput.touched.email && !!app002p02ValidInput.errors.email}
                  />
                </InputGroup>
                {app002p02ValidInput.touched.email && app002p02ValidInput.errors.email && (
                  <FieldDescription className="text-xs text-destructive">{app002p02ValidInput.errors.email}</FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>Role</FieldLabel>
                <Select
                  value={app002p02ValidInput.values.role}
                  onValueChange={(val) => app002p02ValidInput.setFieldValue("role", val)}
                >
                  <SelectTrigger
                    id="role"
                    aria-invalid={app002p02ValidInput.touched.role && !!app002p02ValidInput.errors.role}
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
                {app002p02ValidInput.touched.role && app002p02ValidInput.errors.role && (
                  <FieldDescription className="text-xs text-destructive">{app002p02ValidInput.errors.role}</FieldDescription>
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
                {loadingSpinner ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

MasterUserAdd.propTypes = {
  modalAddOpen: PropTypes.any,
  setModalAddOpen: PropTypes.any,
  refreshTable: PropTypes.any,
  roleOptions: PropTypes.any,
};

export default MasterUserAdd