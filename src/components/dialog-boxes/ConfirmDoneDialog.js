import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DoneOutlineIcon from "@material-ui/icons/DoneOutline";
import * as client from "../../client";
import "../../styles/Icon.css";

export default function ConfirmDoneDialog({cardId, setMarkAsDone}) {
    const [open, setOpen] = useState(false);

    const markCardAsDone = async () => {
        client.markCardAsDone(cardId).then(setMarkAsDone)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        setOpen(false);
        markCardAsDone().catch(err => console.log(err))
    }

    return (
        <div className="icon">
            <DoneOutlineIcon onClick={handleClickOpen}/>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to mark this card as done?
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
