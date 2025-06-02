// src/HistoryDisplay.js
import React, { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./HistoryDisplay.css";

function HistoryDisplay({ history, historyRef }) {
  const [showHistory, setShowHistory] = useState(false);

  const handleDownloadPdf = async () => {
    if (history.length === 0) {
      alert("No history to download.");
      return;
    }

    if (!historyRef.current) {
      alert("Error: History content not found for PDF generation.");
      return;
    }

    try {
      const canvas = await html2canvas(historyRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("EkaDasaProndam_History.pdf");
      alert("History successfully downloaded as PDF!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <div className="history-section">
      <div className="history-buttons">
        <button
          className="show-history-button"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
        <button className="download-pdf-button" onClick={handleDownloadPdf}>
          Download History as PDF
        </button>
      </div>

      {showHistory && (
        <div className="history-container" ref={historyRef}>
          <h2 className="panel-title">Conversion History</h2>
          {history.length === 0 ? (
            <p>No conversion history yet.</p>
          ) : (
            <div className="history-list">
              {history.map((entry) => (
                <div key={entry.id} className="history-item">
                  <p>
                    <strong>--- Conversion Entry ---</strong>
                  </p>
                  {/* Defensive checks added here */}
                  <p>
                    Length: {entry.lengthFeet?.toFixed(2) || "0.00"} ft,{" "}
                    {entry.lengthInches?.toFixed(2) || "0.00"} in (Total{" "}
                    {entry.totalLengthInches?.toFixed(2) || "0.00"} in) -&gt;{" "}
                    {entry.lengthRiyan?.value?.toFixed(2) || "0.00"} riyan
                    (Rounded: {entry.lengthRiyan?.rounded || "0"} riyan)
                  </p>
                  <p>
                    Width: {entry.widthFeet?.toFixed(2) || "0.00"} ft,{" "}
                    {entry.widthInches?.toFixed(2) || "0.00"} in (Total{" "}
                    {entry.totalWidthInches?.toFixed(2) || "0.00"} in) -&gt;{" "}
                    {entry.widthRiyan?.value?.toFixed(2) || "0.00"} riyan
                    (Rounded: {entry.widthRiyan?.rounded || "0"} riyan)
                  </p>
                  <p>
                    Area: {entry.totalAreaSquareInches?.toFixed(2) || "0.00"} sq
                    inches (Rounded Wadu Riyan:{" "}
                    {entry.roundedAreaWaduRiyan || "0"})
                  </p>

                  <div className="history-vastu-comparison">
                    <div className="history-vastu-column">
                      <p>
                        <strong>Based on Wadu Riyan:</strong>
                      </p>
                      {(entry.vastuResultsWaduRiyan || []).map(
                        (
                          factor // Check if array exists
                        ) => (
                          <p
                            key={`${entry.id}-wadu-${factor.name}`}
                            style={{ color: factor.color }}
                          >
                            &nbsp;&nbsp;{factor.name}: {factor.balance}
                          </p>
                        )
                      )}
                    </div>
                    <div className="history-vastu-column">
                      <p>
                        <strong>Based on Sq Inches:</strong>
                      </p>
                      {(entry.vastuResultsSquareInches || []).map(
                        (
                          factor // Check if array exists
                        ) => (
                          <p
                            key={`${entry.id}-sqin-${factor.name}`}
                            style={{ color: factor.color }}
                          >
                            &nbsp;&nbsp;{factor.name}: {factor.balance}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  <p style={{ color: entry.overallStatus?.color || "black" }}>
                    {entry.overallStatus?.status || "Status N/A"}
                  </p>
                  <p>------------------------</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HistoryDisplay;
