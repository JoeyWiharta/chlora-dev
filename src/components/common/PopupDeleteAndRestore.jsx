import React from "react";
import PropTypes from "prop-types";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const PopupDeleteandRestore = (props) => {
    const isRestore = props.status === "restore"

    return (
        <AlertDialog open={props.modalOpen}>
            <AlertDialogContent
                onInteractOutside={(e) => e.preventDefault()}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <AlertDialogHeader className="text-center align-middle justify-center items-center">
                    <div className={`mx-auto mb-2 inline-flex size-16 items-center justify-center rounded-md *:[svg:not([class*='size-'])]:size-8 ${isRestore
                        ? "bg-blue-100 text-blue-500 dark:bg-blue-950"
                        : "bg-red-100 text-red-500 dark:bg-red-950"
                        }`}>
                        {isRestore ? <RotateCcw /> : <Trash2 />}
                    </div>

                    <AlertDialogTitle className="text-center w-full">
                        {isRestore ? "Restore this data?" : "Delete this data?"}
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-center sm:text-center">
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
                        variant={isRestore ? "info" : "destructive"}
                        onClick={props.onClick}
                        disabled={props.loading}
                    >
                        <Spinner className={props.loading ? "flex" : "hidden"} />
                        {props.loading ? "Processing..." : isRestore ? "Restore" : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

PopupDeleteandRestore.propTypes = {
    status: PropTypes.any,
    modalOpen: PropTypes.bool,
    modalClose: PropTypes.any,
    loading: PropTypes.any,
    onClick: PropTypes.any,
};

export default PopupDeleteandRestore;
