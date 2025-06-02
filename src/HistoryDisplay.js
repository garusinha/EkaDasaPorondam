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
      alert(
        "Error: History content not found for PDF generation. Please ensure history is visible."
      );
      return;
    }

    // --- FIX STARTS HERE ---
    // Declare historyElement at the top of the function scope
    const historyElement = historyRef.current;
    const originalStyles = historyElement.style.cssText; // Now historyElement is defined here
    // --- FIX ENDS HERE ---

    // Temporarily adjust styles to ensure full content is rendered for html2canvas
    // Crucial: remove max-height and overflow to get full scrollable content
    historyElement.style.maxWidth = "initial";
    historyElement.style.overflow = "visible";
    historyElement.style.height = "auto"; // Ensure height is not fixed
    historyElement.style.minHeight = "auto";
    historyElement.style.position = "relative"; // Sometimes helps positioning for html2canvas

    try {
      const canvas = await html2canvas(historyElement, {
        scale: 2, // Higher scale for better resolution
        useCORS: true, // Important if you have external images/fonts
        logging: true, // Turn logging ON for debugging html2canvas issues
        width: historyElement.scrollWidth,
        height: historyElement.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculated image height in mm

      let currentPage = 0;
      let currentImgY = 0; // The Y position on the original large image to start from

      // Add the first page
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight); // Start at (0,0) for the first page

      // Loop to add subsequent pages
      // Loop while there is more content to add to a new page
      while (currentImgY + pageHeight < imgHeight) {
        currentImgY += pageHeight; // Move down by one page height in the source image
        pdf.addPage();
        // Add the image again, but offset its Y position to effectively "scroll" the image up
        pdf.addImage(imgData, "PNG", 0, -currentImgY, imgWidth, imgHeight);
      }

      pdf.save("EkaDasaProndam_History.pdf");
      alert("History successfully downloaded as PDF!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(
        "Error generating PDF. Please try again. Check console for details."
      );
    } finally {
      // Now historyElement is correctly in scope here
      historyElement.style.cssText = originalStyles;
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
                      {(entry.vastuResultsWaduRiyan || []).map((factor) => (
                        <p
                          key={`${entry.id}-wadu-${factor.name}`}
                          style={{ color: factor.color }}
                        >
                          &nbsp;&nbsp;{factor.name}: {factor.balance}
                        </p>
                      ))}
                    </div>
                    <div className="history-vastu-column">
                      <p>
                        <strong>Based on Sq Inches:</strong>
                      </p>
                      {(entry.vastuResultsSquareInches || []).map((factor) => (
                        <p
                          key={`${entry.id}-sqin-${factor.name}`}
                          style={{ color: factor.color }}
                        >
                          &nbsp;&nbsp;{factor.name}: {factor.balance}
                        </p>
                      ))}
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
