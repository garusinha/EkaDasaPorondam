// src/InputForm.js
import React from "react";
import "./InputForm.css"; // Create this CSS file

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
    // Allow empty string or numbers only
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="input-panel">
      <h2 className="panel-title">Dimensions Input</h2>
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
