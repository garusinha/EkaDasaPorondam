// src/App.js
import React, { useState, useRef } from "react";
import InputForm from "./InputForm";
import ResultsDisplay from "./ResultsDisplay";
import HistoryDisplay from "./HistoryDisplay";
import {
  INCHES_PER_RIYAN,
  VASTU_FACTOR_DEFINITIONS,
  calculateBalanceForArea,
  getVastuFactorColor,
  evaluateOverallStatus,
} from "./VastuFactors";
import "./App.css"; // For basic styling

const MAX_HISTORY_ITEMS = 10;

function App() {
  // Input state
  const [lengthFeet, setLengthFeet] = useState("");
  const [lengthInches, setLengthInches] = useState("");
  const [widthFeet, setWidthFeet] = useState("");
  const [widthInches, setWidthInches] = useState("");

  // Results state
  const [lengthRiyan, setLengthRiyan] = useState(null);
  const [widthRiyan, setWidthRiyan] = useState(null);
  const [areaWaduRiyan, setAreaWaduRiyan] = useState(null);

  // Two sets of vastu results
  const [vastuResultsWaduRiyan, setVastuResultsWaduRiyan] = useState([]);
  const [vastuResultsSquareInches, setVastuResultsSquareInches] = useState([]);

  const [overallStatus, setOverallStatus] = useState({
    status: "",
    color: "black",
  });

  // History state
  const [conversionHistory, setConversionHistory] = useState([]);
  const historyRef = useRef(null); // Ref for PDF export

  const resetResults = () => {
    setLengthRiyan(null);
    setWidthRiyan(null);
    setAreaWaduRiyan(null);
    setVastuResultsWaduRiyan([]);
    setVastuResultsSquareInches([]);
    setOverallStatus({ status: "", color: "black" });
  };

  const handleConvert = () => {
    const lf = parseFloat(lengthFeet) || 0;
    const li = parseFloat(lengthInches) || 0;
    const wf = parseFloat(widthFeet) || 0;
    const wi = parseFloat(widthInches) || 0;

    if (lf < 0 || li < 0 || wf < 0 || wi < 0) {
      alert("Feet and Inches must be non-negative.");
      resetResults();
      return;
    }

    const totalLengthInches = lf * 12 + li;
    const totalWidthInches = wf * 12 + wi;

    if (totalLengthInches === 0 || totalWidthInches === 0) {
      alert("Please enter valid length and width to perform calculations.");
      resetResults();
      return;
    }

    const lr = totalLengthInches / INCHES_PER_RIYAN;
    const wr = totalWidthInches / INCHES_PER_RIYAN;

    setLengthRiyan({
      value: lr,
      rounded: Math.ceil(lr),
      isGood: Math.ceil(lr) % 2 !== 0, // Green if odd, Red if even
      inputFeet: lf,
      inputInches: li,
    });

    setWidthRiyan({
      value: wr,
      rounded: Math.ceil(wr),
      isGood: Math.ceil(wr) % 2 !== 0, // Green if odd, Red if even
      inputFeet: wf,
      inputInches: wi,
    });

    const totalAreaSquareInches = totalLengthInches * totalWidthInches;
    const areaWaduRiyanExact =
      totalAreaSquareInches / (INCHES_PER_RIYAN * INCHES_PER_RIYAN);
    const roundedAreaWaduRiyan = Math.ceil(areaWaduRiyanExact); // This is the integer used for calculations in Java

    setAreaWaduRiyan({
      exact: areaWaduRiyanExact,
      rounded: roundedAreaWaduRiyan,
      totalSquareInches: totalAreaSquareInches,
    });

    // Calculate Vastu Factors based on roundedAreaWaduRiyan (LEFT SIDE)
    const currentVastuResultsWaduRiyan = VASTU_FACTOR_DEFINITIONS.map(
      (factor) => {
        const balance = calculateBalanceForArea(roundedAreaWaduRiyan, factor);
        const isGood = factor.isGood(balance);
        const color = getVastuFactorColor(factor, balance);
        return {
          name: factor.name,
          balance: balance,
          isGood: isGood,
          color: color,
        };
      }
    );
    setVastuResultsWaduRiyan(currentVastuResultsWaduRiyan);

    // Calculate Vastu Factors based on totalAreaSquareInches (RIGHT SIDE)
    const currentVastuResultsSquareInches = VASTU_FACTOR_DEFINITIONS.map(
      (factor) => {
        const balance = calculateBalanceForArea(totalAreaSquareInches, factor);
        const isGood = factor.isGood(balance); // Good/bad logic remains the same based on balance
        const color = getVastuFactorColor(factor, balance); // Color logic remains the same
        return {
          name: factor.name,
          balance: balance,
          isGood: isGood,
          color: color,
        };
      }
    );
    setVastuResultsSquareInches(currentVastuResultsSquareInches);

    // Evaluate overall status (still based on Wadu Riyan, as it's the primary system)
    const status = evaluateOverallStatus(currentVastuResultsWaduRiyan);
    setOverallStatus(status);

    // Add to history (store both sets of results)
    const newHistoryEntry = {
      id: Date.now(), // Unique ID for key prop
      lengthFeet: lf,
      lengthInches: li,
      totalLengthInches: totalLengthInches,
      lengthRiyan: lr,
      widthFeet: wf,
      widthInches: wi,
      totalWidthInches: totalWidthInches,
      widthRiyan: wr,
      totalAreaSquareInches: totalAreaSquareInches,
      roundedAreaWaduRiyan: roundedAreaWaduRiyan,
      areaWaduRiyanExact: areaWaduRiyanExact,
      vastuResultsWaduRiyan: currentVastuResultsWaduRiyan, // Store this set
      vastuResultsSquareInches: currentVastuResultsSquareInches, // Store this set
      overallStatus: status,
    };

    setConversionHistory((prevHistory) => {
      const updatedHistory = [newHistoryEntry, ...prevHistory];
      return updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  return (
    <div className="app-container">
      <h1 className="app-title">EkaDasaProndam: Dimension Converter</h1>

      <div className="main-panel">
        <InputForm
          lengthFeet={lengthFeet}
          setLengthFeet={setLengthFeet}
          lengthInches={lengthInches}
          setLengthInches={setLengthInches}
          widthFeet={widthFeet}
          setWidthFeet={setWidthFeet}
          widthInches={widthInches}
          setWidthInches={setWidthInches}
        />

        <button className="convert-button" onClick={handleConvert}>
          Convert All & Calculate Vastu Factors
        </button>

        <ResultsDisplay
          lengthRiyan={lengthRiyan}
          widthRiyan={widthRiyan}
          areaWaduRiyan={areaWaduRiyan}
          vastuResultsWaduRiyan={vastuResultsWaduRiyan} // Pass this
          vastuResultsSquareInches={vastuResultsSquareInches} // Pass this
          overallStatus={overallStatus}
        />
      </div>

      <HistoryDisplay
        history={conversionHistory}
        historyRef={historyRef} // Pass ref for PDF export
      />

      <div className="contact-info">
        <h3>Garusinghe Construction</h3>
        <p>Email: nikethasenarath@gmail.com</p>
        <p>Contact: 0712905163 (Whatsapp Available)</p>
      </div>
    </div>
  );
}

export default App;
