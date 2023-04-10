import React, { useState } from "react";
import TabMenu from "./components/TabMenu";
import TabContent from "./components/TabContent";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="app">
      <div className="header">
        <h1>Cipher Visualizer</h1>
        <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <TabContent activeTab={activeTab} />
    </div>
  );
}

export default App;