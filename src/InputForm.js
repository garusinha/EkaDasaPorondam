// src/InputForm.js (Reverted to original HTML structure without inputs-wrapper)

import React from "react";
import "./InputForm.css";

function InputForm({
  lengthFeet,
  setLengthFeet,
  lengthInches,
  setLengthInches,
  widthFeet,
  setWidthFeet,
  widthInches,
  setWidthInches,
}) {
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    // Allows empty string, or numbers (integers or decimals)
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="input-panel">
      <h2 className="panel-title">Dimensions Input</h2>
      {/* Length Input Group - This will be on its own row by default */}
      <div className="input-group">
        <label>Length:</label>
        <div className="input-fields">
          <input
            type="number"
            min="0"
            placeholder="Feet"
            value={lengthFeet}
            onChange={handleInputChange(setLengthFeet)}
            className="styled-input-field"
          />
          <input
            type="number"
            min="0"
            placeholder="Inches"
            value={lengthInches}
            onChange={handleInputChange(setLengthInches)}
            className="styled-input-field"
          />
        </div>
      </div>
      {/* Width Input Group - This will be on its own row by default */}
      <div className="input-group">
        <label>Width:</label>
        <div className="input-fields">
          <input
            type="number"
            min="0"
            placeholder="Feet"
            value={widthFeet}
            onChange={handleInputChange(setWidthFeet)}
            className="styled-input-field"
          />
          <input
            type="number"
            min="0"
            placeholder="Inches"
            value={widthInches}
            onChange={handleInputChange(setWidthInches)}
            className="styled-input-field"
          />
        </div>
      </div>
    </div>
  );
}

export default InputForm;
