import { useState } from "react";

const CollapseMenu = ({ title, children }) => {
  const [isCollapseOpen, setIsCollapseOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapseOpen(!isCollapseOpen);
  };

  return (
    <div style={{ border: "1px solid #ddd", marginBottom: "10px", borderRadius: "5px" }}>
      <div
        onClick={toggleCollapse}
        style={{
          background: "#f5f5f5",
          padding: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {title}
      </div>
      {isCollapseOpen && (
        <div style={{ padding: "10px", borderTop: "1px solid #ddd" }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapseMenu;
