// create layout with sidebar to wrap around different pages

import React from "react";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Sidebar</h3>
      </div>
      <div className="sidebar-content">
        <ul>
          <li>
            <a href="#">Overview</a>
          </li>
          <li>
            <a href="#">Facebook</a>
          </li>
          <li>
            <a href="#">Twitter</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Layout = ({ children, activePage }) => {
  return (
    <>
      <Sidebar activePage={activePage} />
      {children}
    </>
  );
};

export default Layout;
