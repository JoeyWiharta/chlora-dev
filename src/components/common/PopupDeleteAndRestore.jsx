import React from "react";
import PropTypes from "prop-types";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TriangleAlert, RotateCcw } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const PopupDeleteandRestore = (props) => {

    const isRestore = props.status === "restore"

    const handleClick = () => {
        if (props.onClick) {
            props.onClick()
        }
    }

    return (
        <AlertDialog open={props.modalOpen}>
            <AlertDialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-sm"
            >
                <AlertDialogHeader className="items-center justify-center">
                    <div className={`flex items-center justify-center rounded-full p-4 ${isRestore ? "bg-blue-100 dark:bg-blue-950" : "bg-orange-100 dark:bg-orange-950"}`}>
                        {isRestore
                            ? <RotateCcw className="h-8 w-8 text-blue-500" />
                            : <TriangleAlert className="h-8 w-8 text-orange-500" />
                        }
                    </div>

                    <AlertDialogTitle className="text-center">
                        Are you sure you want to continue?
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-center">
                        {isRestore
                            ? "This action will restore the selected data and make it active again"
                            : "Deleted data will not be permanently deleted immediately and can still be restored via the data archive menu"
                        }
                    </AlertDialogDescription>

                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-2">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={props.modalClose}
                        disabled={props.loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        variant={isRestore ? "default" : "destructive"}
                        onClick={handleClick}
                        disabled={props.loading}
                    >
                        <Spinner className={props.loading ? "flex" : "hidden"} />
                        {props.loading
                            ? "Processing..."
                            : isRestore ? "Restore" : "Delete"
                        }
                    </Button>
                </AlertDialogFooter>

            </AlertDialogContent>

        </AlertDialog>
        // <React.Fragment>
        //     <Dialog
        //         open={props.modalOpen}
        //         onClose={(event, reason) => {
        //             if (reason === 'backdropClick') return;
        //             props.modalClose
        //         }}
        //         fullWidth={true}
        //         maxWidth={"sm"}
        //         sx={{
        //             '& .MuiDialog-paper': {
        //                 bgcolor: 'background.default',
        //                 borderRadius: "50px"
        //             }
        //         }}
        //     >
        //         <FormSpinner
        //             open={props.loading}
        //             text={'Processing...'}
        //         />
        //         <DialogTitle
        //             sx={{
        //                 display: 'flex',
        //                 alignItems: 'center',
        //                 justifyContent: 'center',
        //                 // bgcolor: 'red'
        //             }}
        //         >
        //             {props.status == "restore" ? (
        //                 <ReplayIcon
        //                     sx={{
        //                         fontSize: {
        //                             xs: 70,
        //                             sm: 100,
        //                         },
        //                     }}
        //                     color="info"
        //                 />
        //             ) :
        //                 (<ErrorIcon
        //                     sx={{
        //                         fontSize: {
        //                             xs: 70,
        //                             sm: 100,
        //                         },
        //                     }}
        //                     color="warning"
        //                 />)
        //             }

        //         </DialogTitle>

        //         <DialogContent
        //             sx={{
        //                 display: 'flex',
        //                 flexDirection: 'column',
        //                 overflowY: 'auto',
        //                 '&::-webkit-scrollbar': {
        //                     display: 'none',
        //                 },
        //                 scrollbarWidth: 'none',
        //                 '-ms-overflow-style': 'none',
        //                 // bgcolor: 'blue'
        //             }}
        //         >
        //             <Stack
        //                 spacing={1}
        //                 sx={{
        //                     p: 0,
        //                 }}>

        //                 <Box sx={{
        //                     display: 'flex',
        //                     flexDirection: 'column',
        //                     gap: 2,
        //                 }}>
        //                     <DialogContentText
        //                         textAlign={"center"}
        //                         variant="h6"
        //                         sx={{
        //                             color: 'text.primary',
        //                         }}>
        //                         Are you sure you want to continue?
        //                     </DialogContentText>

        //                     <DialogContentText
        //                         textAlign={"center"}
        //                         variant="body2"
        //                         sx={{
        //                             color: 'text.primary',
        //                             // bgcolor: 'grey'

        //                         }}>
        //                         {props.status != "restore" ? "Deleted data will not be permanently deleted immediately and can still be restored via the data archive menu" : "This action will restore the selected data and make it active again"}
        //                     </DialogContentText>
        //                 </Box>


        //                 <Box>
        //                     <DialogActions sx={{ justifyContent: 'center', gap: 2, p: 0, px: 10, mt: 4 }}  >
        //                         <Button
        //                             color="main"
        //                             variant="contained"
        //                             fullWidth
        //                             sx={{
        //                                 minHeight: '50px',
        //                                 bgcolor: 'button.grey',
        //                                 borderRadius: '15px',
        //                                 '&:hover': {
        //                                     bgcolor: 'button.grey',
        //                                     opacity: 0.9,
        //                                 },
        //                             }}
        //                             onClick={props.modalClose}
        //                         >
        //                             CANCEL
        //                         </Button>
        //                         <Button
        //                             type="submit"
        //                             color={props.status == "restore" ? "info" : "error"}
        //                             variant="contained"
        //                             fullWidth
        //                             onClick={handleClick}

        //                             sx={{
        //                                 minHeight: '50px',
        //                                 borderRadius: '15px',
        //                                 '&:hover': {
        //                                     opacity: 0.9,
        //                                 },
        //                             }}
        //                         >
        //                             {props.status == "restore" ? "RESTORE" : "DELETE"}
        //                         </Button>
        //                     </DialogActions>
        //                 </Box>

        //             </Stack>
        //         </DialogContent>




        //     </Dialog>
        // </React.Fragment>
    );
};

PopupDeleteandRestore.propTypes = {
    modalOpen: PropTypes.bool,
    modalClose: PropTypes.any,
    loading: PropTypes.any,
    onDelete: PropTypes.any,
};

export default PopupDeleteandRestore;
