import React from "react";

function TopBar({ isOpen, accountData, onSignOut }) {

  return (
    <div className={"topbar" + (isOpen ? " topbar_opened" : "")}>
      <p className="topbar__profile-email">{accountData?.accountEmail}</p>
      <button className="topbar__button" onClick={onSignOut}>Выйти</button>
    </div>
  )
}

export default TopBar;