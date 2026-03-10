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
import { addDevice } from "../../utils/ListApi";
import { Mail } from "lucide-react";



const MasterDeviceAdd = (props) => {

  // State for Loading Spinner
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [textLoading, setTextLoading] = useState("")

  useEffect(() => {
    if (props.modalAddOpen) {
      app004p02ValidInput.resetForm()
      console.log(props.clusterOption)
    }
  }, [props.modalAddOpen])


  // Function Close, Reset, and Refresh After Submitting
  const handleClose = () => {
    debugger
    props.setModalAddOpen(false);
  }

  // Validation Form
  const app004p02ValidInput = useFormik({
    initialValues:
    {
      device_name: "",
      device_type: "",
      cluster_id: "",
    },
    validationSchema: Yup.object
      ({
        device_name: Yup.string().required("Device Name is required."),
        device_type: Yup.string().required("Device Type is required."),
        cluster_id: Yup.string().required("Cluster Name is required."),
      }),

    onSubmit: async (values, { setSubmitting }) => {
      debugger
      setSubmitting(true)
      setLoadingSpinner(true)
      setTextLoading("Processing...")
      await SaveDeviceAction(values)
      setSubmitting(false)
    },
  });

  const SaveDeviceAction = useCallback(async (param) => {
    try {
      const response = await addDevice(param)
      debugger
      if (response.status === 201 || response.status === 200) {
        props.setApp004setMsg("Device Has Been Successfully Added.");
        props.setApp004setMsgStatus("success");
        props.refreshTable();
        handleClose()
      }
    } catch (error) {
      debugger
      props.setApp004setMsg(error?.response?.data?.detail || "System is Unavailable. Please Try Again Later.")
      props.setApp004setMsgStatus("error")
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
          }}
        >
          Add Device

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


            <DialogContentText
              textAlign={"center"}
              sx={{
                color: 'text.primary'
              }}>
              Add a new Device and complete the information below
            </DialogContentText>

            <Box
              component="form"
              onSubmit={app004p02ValidInput.handleSubmit}
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
                  Device Name
                </Typography>
                <TextField
                  className="auth-field"
                  variant="outlined"
                  placeholder="Device Name"
                  name="device_name"
                  size="medium"
                  fullWidth
                  value={app004p02ValidInput.values.device_name}
                  onChange={app004p02ValidInput.handleChange}
                  onBlur={app004p02ValidInput.handleBlur}
                  error={app004p02ValidInput.touched.device_name && Boolean(app004p02ValidInput.errors.device_name)}
                  helperText={app004p02ValidInput.touched.device_name && app004p02ValidInput.errors.device_name}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2" fontWeight="medium"
                  mb={1}
                >
                  Device Type
                </Typography>

                <Autocomplete
                  fullWidth
                  options={props.deviceTypeOption}
                  getOptionLabel={(option) => option.label}
                  value={props.deviceTypeOption?.find(opt => opt.value === app004p02ValidInput.values.device_type) || null}
                  onChange={(event, newValue) => { app004p02ValidInput.setFieldValue('device_type', newValue ? newValue.value : '') }}
                  onBlur={() => app004p02ValidInput.handleBlur('device_type')}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="auth-field"
                      placeholder="Device Type"
                      variant="outlined"
                      name="device_type"
                      error={app004p02ValidInput.touched.device_type && Boolean(app004p02ValidInput.errors.device_type)}
                      helperText={app004p02ValidInput.touched.device_type && app004p02ValidInput.errors.device_type}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography
                  variant="body2" fontWeight="medium"
                  mb={1}
                >
                  Cluster Name
                </Typography>

                <Autocomplete
                  fullWidth
                  options={props.clusterOption}
                  getOptionLabel={(option) => option.label}
                  value={props.clusterOption?.find(opt => opt.value === app004p02ValidInput.values.cluster_id) || null}
                  onChange={(event, newValue) => { app004p02ValidInput.setFieldValue('cluster_id', newValue ? newValue.value : '') }}
                  onBlur={() => app004p02ValidInput.handleBlur('cluster_id')}
                  isOptionEqualToValue={(option, value) => option.value === value.value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="auth-field"
                      placeholder="Cluster Name"
                      variant="outlined"
                      name="cluster_id"
                      error={app004p02ValidInput.touched.cluster_id && Boolean(app004p02ValidInput.errors.cluster_id)}
                      helperText={app004p02ValidInput.touched.cluster_id && app004p02ValidInput.errors.cluster_id}
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

MasterDeviceAdd.propTypes = {
  modalAddOpen: PropTypes.any,
  setModalAddOpen: PropTypes.any,
  refreshTable: PropTypes.any,
  app004Msg: PropTypes.any,
  setApp004setMsg: PropTypes.any,
  app004MsgStatus: PropTypes.any,
  setApp004setMsgStatus: PropTypes.any,
};

export default MasterDeviceAdd