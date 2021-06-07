import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import * as client from "../../client";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import "../../styles/Icon.css";

export default function ConfirmDeleteDialog({cardId, colId, setDeleting}) {
    const [open, setOpen] = useState(false);

    const confirmDelete = async () => {
        const removeCardFromColumn = async () => {
            await client.deleteCard(colId, cardId)
        }
        await removeCardFromColumn()
        setDeleting(false)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        setOpen(false);
        setDeleting(true)
        confirmDelete().catch(err => console.log(err))
    }

    return (
        <div className="icon">
            <DeleteOutlineIcon
                onClick={handleClickOpen}/>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want delete this card?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        NO
                    </Button>
                    <Button onClick={handleSubmit}>
                        YES
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
