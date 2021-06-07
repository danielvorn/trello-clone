import React, {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as client from "../../client";
import "../../styles/Icon.css";
import Button from "@material-ui/core/Button";
import AddIcon from '@material-ui/icons/Add';

export default function AddColumn({setCreatingColumn}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");

    const createColumn = async () => {
        client.createColumn(title)
            .then(setCreatingColumn)
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        setOpen(false);
        createColumn().catch(err => console.log(err))
    };

    return (
        <div className="icon">
            <button onClick={handleClickOpen} className="addColButton">
                <div style={{display: "flex", alignItems: "center"}}><AddIcon fontSize="medium"/> Add column</div>
            </button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Enter column title</DialogTitle>
                <DialogContent>
                        <textarea
                            autoFocus
                            onFocus={event => event.target.select()}
                            value={title}
                            onChange={event => setTitle(event.target.value)}
                        />
                </DialogContent>
                <DialogActions className="dialogActions">
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
