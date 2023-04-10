import React from "react";
import "../styles/TabMenu.css";

function TabMenu({ activeTab, setActiveTab }) {
  const handleClick = (tabIndex) => {
    setActiveTab(tabIndex);
  };

  return (
    <div className="tab-menu">
      <button
        className={`tab ${activeTab === 1 ? "active" : ""}`}
        onClick={() => handleClick(1)}
      >
        Overview
      </button>
      <button
        className={`tab ${activeTab === 2 ? "active" : ""}`}
        onClick={() => handleClick(2)}
      >
        Vigenère
      </button>
      <button
        className={`tab ${activeTab === 3 ? "active" : ""}`}
        onClick={() => handleClick(3)}
      >
        3DES
      </button>
      <button
        className={`tab ${activeTab === 4 ? "active" : ""}`}
        onClick={() => handleClick(4)}
      >
        AES
      </button>
      <button
        className={`tab ${activeTab === 5 ? "active" : ""}`}
        onClick={() => handleClick(5)}
      >
        RSA
      </button>
    </div>
  );
}

export default TabMenu;
