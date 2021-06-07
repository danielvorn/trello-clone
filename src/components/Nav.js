import React from "react";
import Logo from "../assets/trello-logo.gif";
import "../styles/Nav.css"
import AddColumn from "./dialog-boxes/AddColumn";

function Nav({setCreatingColumn}) {
    return (
        <div className="nav">
            <img className="headerLogo" src={Logo} alt="Logo" />
            <AddColumn className="addColumnButton" setCreatingColumn={setCreatingColumn}/>
        </div>
    );
}

export default Nav;