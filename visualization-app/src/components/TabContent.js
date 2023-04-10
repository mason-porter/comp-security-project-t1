import React from "react";
import "../styles/TabContent.css";
import OverviewMain from "./OverviewMain";
import AESMain from "./aes/AESMain";
import RSAMain from "./rsa/RSAMain";
import ThreeDESMain from "./three_des/ThreeDESMain";
import VigenereMain from "./vigenere/VigenereMain";

function TabContent({ activeTab }) {
  return (
    <div className="tab-content">
      {activeTab === 1 && <OverviewMain />}
      {activeTab === 2 && <VigenereMain />}
      {activeTab === 3 && <ThreeDESMain />}
      {activeTab === 4 && <AESMain />}
      {activeTab === 5 && <RSAMain />}
    </div>
  );
}

export default TabContent;
