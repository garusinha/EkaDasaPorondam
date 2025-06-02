// src/ResultsDisplay.js
import React from "react";
import "./ResultsDisplay.css";

function ResultsDisplay({
  lengthRiyan,
  widthRiyan,
  areaWaduRiyan,
  vastuResultsWaduRiyan, // New prop
  vastuResultsSquareInches, // New prop
  overallStatus,
}) {
  return (
    <div className="results-panel">
      <h2 className="panel-title">Conversion Results & Vastu Factors</h2>

      {lengthRiyan && (
        <p className="result-label" style={{ color: "blue" }}>
          Length in Riyan: {lengthRiyan.value.toFixed(2)} riyan (
          <span style={{ color: lengthRiyan.isGood ? "darkgreen" : "darkred" }}>
            {lengthRiyan.rounded} riyan
          </span>{" "}
          from {lengthRiyan.inputFeet.toFixed(2)} feet,{" "}
          {lengthRiyan.inputInches.toFixed(2)} inches)
        </p>
      )}

      {widthRiyan && (
        <p className="result-label" style={{ color: "blue" }}>
          Width in Riyan: {widthRiyan.value.toFixed(2)} riyan (
          <span style={{ color: widthRiyan.isGood ? "darkgreen" : "darkred" }}>
            {widthRiyan.rounded} riyan
          </span>{" "}
          from {widthRiyan.inputFeet.toFixed(2)} feet,{" "}
          {widthRiyan.inputInches.toFixed(2)} inches)
        </p>
      )}

      {/* Display both area types */}
      {areaWaduRiyan && (
        <p className="result-label" style={{ color: "purple" }}>
          Area in Wadu Riyan: {areaWaduRiyan.rounded} wadu riyan (exact:{" "}
          {areaWaduRiyan.exact.toFixed(2)})
        </p>
      )}
      {areaWaduRiyan && (
        <p className="result-label" style={{ color: "blue" }}>
          Total Area: {areaWaduRiyan.totalSquareInches.toFixed(2)} square inches
        </p>
      )}

      <div className="vastu-factors-comparison">
        {/* Left Side: Based on Wadu Riyan */}
        <div className="vastu-factors-column">
          <h3 className="column-title">
            Based on Wadu Riyan (Area:{" "}
            {areaWaduRiyan ? areaWaduRiyan.rounded : "-"})
          </h3>
          {vastuResultsWaduRiyan.length > 0 ? (
            vastuResultsWaduRiyan.map((factor) => (
              <p
                key={factor.name}
                className="vastu-factor-label"
                style={{ color: factor.color }}
              >
                {factor.name}: {factor.balance}
              </p>
            ))
          ) : (
            <p className="no-data">No data</p>
          )}
        </div>

        {/* Right Side: Based on Total Square Inches */}
        <div className="vastu-factors-column">
          <h3 className="column-title">
            Based on Square Inches (Area:{" "}
            {areaWaduRiyan ? Math.floor(areaWaduRiyan.totalSquareInches) : "-"})
          </h3>
          {vastuResultsSquareInches.length > 0 ? (
            vastuResultsSquareInches.map((factor) => (
              <p
                key={factor.name}
                className="vastu-factor-label"
                style={{ color: factor.color }}
              >
                {factor.name}: {factor.balance}
              </p>
            ))
          ) : (
            <p className="no-data">No data</p>
          )}
        </div>
      </div>

      <p
        className="overall-status-label"
        style={{ color: overallStatus.color }}
      >
        {overallStatus.status}
      </p>
    </div>
  );
}

export default ResultsDisplay;
