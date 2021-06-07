import React from 'react';
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import "../styles/AddButton.css";

function AddButton({element, setShow}) {
    return (
        <div className="button-frame" style={{maxHeight: "20px"}} onClick={() => setShow(false)}>
            <AddOutlinedIcon/>
            <p style={{fontWeight: 700}}>Add a {element}</p>
        </div>
    );
}

export default AddButton;
