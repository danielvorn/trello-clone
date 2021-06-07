import React from "react";
import Logo from "../assets/trello-logo.gif";
import "../styles/Nav.css";

function Nav() {
    return (
        <div className="nav">
            <img className="headerLogo" src={Logo} alt="Logo" />
        </div>
    );
}

export default Nav;