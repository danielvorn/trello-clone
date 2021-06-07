import React, {useEffect} from 'react'
import '../styles/Card.css'
import {Draggable} from 'react-beautiful-dnd'
import EditDialogForm from "./dialog-boxes/EditDialogForm";
import ConfirmDoneDialog from "./dialog-boxes/ConfirmDoneDialog";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ConfirmDeleteDialog from "./dialog-boxes/ConfirmDeleteDialog";

function Card(props) {
    return (
        <Draggable draggableId={props.card?.id} index={props.index}>
            {(provided, snapshot) => (
                <div className="card-container"
                     {...provided.draggableProps}
                     {...provided.dragHandleProps}
                     ref={provided.innerRef}
                >
                    {props.card?.title}
                    <div className="options">
                        <EditDialogForm
                            cardId={props.card?.id}
                            title={props.card?.title}
                            setEditSubmitting={props.setEditSubmitting}
                        />
                        <ConfirmDeleteDialog
                            setDeleting={props.setDeleting}
                            colId={props.columnId}
                            cardId={props.card?.id}
                        />
                        {props.card?.status ?
                            <CheckCircleIcon
                                className="check-circle-icon"/> :
                            <ConfirmDoneDialog
                                setMarkAsDone={props.setMarkAsDone}
                                cardId={props.card?.id}
                            />
                        }
                    </div>
                </div>
            )}
        </Draggable>
    )
}

export default Card