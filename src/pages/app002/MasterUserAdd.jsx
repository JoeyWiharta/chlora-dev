import React, { useState, useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { useFormik } from "formik";
import * as Yup from "yup";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Stack, Box, InputAdornment, Select, Typography, Autocomplete } from "@mui/material";
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { addUser } from "../../utils/ListApi";
import FormSpinner from "../../components/common/FormSpinner";
import { Mail } from "lucide-react";



const MasterUserAdd = (props) => {

  // State for Loading Spinner
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [textLoading, setTextLoading] = useState("")

  useEffect(() => {
    if (props.modalAddOpen) {
      app002p02ValidInput.resetForm()
    }
  }, [props.modalAddOpen])


  // Role 
  const roleOptions = [
    { value: "ADMIN", label: "Admin" },
    { value: "USER", label: "User" },
    { value: "STAFF", label: "Staff" },
  ];

  // Function Close, Reset, and Refresh After Submitting
  const handleClose = () => {
    debugger
    props.setModalAddOpen(false);
  }

  // Validation Form
  const app002p02ValidInput = useFormik({
    initialValues:
    {
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
      setSubmitting(true)
      setLoadingSpinner(true)
      setTextLoading("Processing...")
      await SaveUserAction(values)
      setSubmitting(false)
    },
  });

  const SaveUserAction = useCallback(async (param) => {
    try {
      const response = await addUser(param)
      debugger
      if (response.status === 201 || response.status === 200) {
        props.setApp002setMsg("User Has Been Successfully Added.");
        props.setApp002setMsgStatus("success");
        props.refreshTable();
        handleClose()
      }
    } catch (error) {
      debugger
      props.setApp002setMsg(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.")
      props.setApp002setMsgStatus("error")
    } finally {
      setLoadingSpinner(false)
      setTextLoading("")
    }
  })

  return (
    <React.Fragment>
      <Dialog
        open={props.modalAddOpen}
        onClose={(event, reason) => {
          if (reason === 'backdropClick') return;
          handleClose()
        }}
        fullWidth={true}
        maxWidth={"xs"}
        scroll={"paper"}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pr: 1,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="h3">
            Add User
          </Typography>

          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              color: 'text.secondary'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers={scroll === "paper"}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
            '-ms-overflow-style': 'none',
          }}
        >
          <Stack
            spacing={4}
            sx={{
              // bgcolor: 'darkRed',
              p: 4
            }}>

            <FormSpinner
              open={loadingSpinner}
              text={textLoading}
            />

            <DialogContentText
              textAlign={"center"}
              sx={{
                color: 'text.primary'
              }}>
              Add a new user and complete the information below
            </DialogContentText>

            <Box
              component="form"
              onSubmit={app002p02ValidInput.handleSubmit}
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 3,
                // bgcolor: "darkblue"
              }}
            >

              <Box>
                <Typography
                  variant="body2" fontWeight="medium"
                  mb={1}
                >
                  Email
                </Typography>
                <TextField
                  className="auth-field"
                  variant="outlined"
                  placeholder="Email"
                  name="email"
                  size="medium"
                  fullWidth
                  value={app002p02ValidInput.values.email}
                  onChange={app002p02ValidInput.handleChange}
                  onBlur={app002p02ValidInput.handleBlur}
                  error={app002p02ValidInput.touched.email && Boolean(app002p02ValidInput.errors.email)}
                  helperText={app002p02ValidInput.touched.email && app002p02ValidInput.errors.email}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2" fontWeight="medium"
                  mb={1}
                >
                  Name
                </Typography>
                <TextField
                  className="auth-field"
                  placeholder="Name"
                  name="name"
                  size="medium"
                  fullWidth
                  value={app002p02ValidInput.values.name}
                  onChange={app002p02ValidInput.handleChange}
                  onBlur={app002p02ValidInput.handleBlur}
                  error={app002p02ValidInput.touched.name && Boolean(app002p02ValidInput.errors.name)}
                  helperText={app002p02ValidInput.touched.name && app002p02ValidInput.errors.name}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2" fontWeight="medium"
                  mb={1}
                >
                  Role
                </Typography>

                <Autocomplete
                  fullWidth
                  options={roleOptions}
                  getOptionLabel={(option) => option.label}
                  value={roleOptions.find(opt => opt.value === app002p02ValidInput.values.role) || null}
                  onChange={(event, newValue) => { app002p02ValidInput.setFieldValue('role', newValue ? newValue.value : '') }}
                  onBlur={() => app002p02ValidInput.handleBlur('role')}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="auth-field"
                      placeholder="Role"
                      variant="outlined"
                      name="role"
                      error={app002p02ValidInput.touched.role && Boolean(app002p02ValidInput.errors.role)}
                      helperText={app002p02ValidInput.touched.role && app002p02ValidInput.errors.role}
                    />
                  )}
                />
              </Box>

              <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 0, mt: 2 }}  >
                <Button
                  color="main"
                  variant="contained"
                  fullWidth
                  sx={{
                    minHeight: '50px',
                    bgcolor: 'button.grey',
                    borderRadius: '15px',
                    '&:hover': {
                      bgcolor: 'button.grey',
                      opacity: 0.9,
                    },
                  }}
                  onClick={handleClose}
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  color="success"
                  variant="contained"
                  fullWidth
                  sx={{
                    minHeight: '50px',
                    borderRadius: '15px',
                    '&:hover': {
                      bgcolor: '#61A05A'
                    },
                  }}
                >
                  ADD
                </Button>
              </DialogActions>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}

MasterUserAdd.propTypes = {
  modalAddOpen: PropTypes.any,
  setModalAddOpen: PropTypes.any,
  refreshTable: PropTypes.any,
  app002Msg: PropTypes.any,
  setApp002setMsg: PropTypes.any,
  app002MsgStatus: PropTypes.any,
  setApp002setMsgStatus: PropTypes.any,
};

export default MasterUserAdd