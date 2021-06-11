import React, {useState} from "react"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogTitle from "@material-ui/core/DialogTitle"
import EditOutlinedIcon from "@material-ui/icons/EditOutlined"
import CheckIcon from "@material-ui/icons/Check"
import ClearIcon from "@material-ui/icons/Clear"
import * as client from "../../client"
import "../../styles/Icon.css"

export default function EditDialogForm({title, cardId, updateCardStateAfterEdit}) {
    const [open, setOpen] = useState(false)
    const [editInput, setEditInput] = useState(title)

    const editCard = async () => {
        client.editCardContent(cardId, editInput)
            .then(updateCardStateAfterEdit(cardId, editInput))
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = () => {
        setOpen(false)
        editCard().catch(err => console.log(err))
    }

    return (
        <div className="icon">
            <EditOutlinedIcon className="editIcon" onClick={handleClickOpen}/>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edit Card</DialogTitle>
                <DialogContent>
                        <textarea
                            autoFocus
                            onFocus={event => event.target.select()}
                            value={editInput}
                            onChange={event => setEditInput(event.target.value)}
                        />
                </DialogContent>
                <DialogActions className="dialogActions">
                    <ClearIcon className="clearIcon"
                        fontSize="large"
                        onClick={handleClose}/>
                    <CheckIcon className="checkIcon"
                        fontSize="large"
                        onClick={handleSubmit}/>
                </DialogActions>
            </Dialog>
        </div>
    )
}
