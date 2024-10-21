import React, { useState } from "react";

const MainForm = () => {
  // State to hold form data
  const [formData, setFormData] = useState({
    issueDateStart: "",
    issueDateEnd: "",
    reasonForEncounter: "",
    healthcareUnit: "",
    state: "",
    patientAgeStart: "",
    patientAgeEnd: "",
    dischargeDateStart: "",
    dischargeDateEnd: "",
    reasonForDischarge: "",
    followupDurationStart: "",
    followupDurationEnd: "",
    barosScore: "",
    barosTable: "",
    problem: "",
    secondaryDiagnosis: "",
    associatedCauses: "",
    procedure: "",
    procedureTimeStart: "",
    procedureTimeEnd: "",
    committerName: "",
  });

  const [responseData, setResponseData] = useState([]); // State for storing response data
  const [error, setError] = useState(null); // State for storing error message

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the formData to check if it's correct
    console.log(formData);

    try {
      const response = await fetch("http://localhost:8001/api/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(formData), // Convert formData to JSON string
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json(); // Parse the response data
      console.log("Success:", data); // Log the response data
      setResponseData(data); // Update response data state
      setError(null); // Clear any previous error
    } catch (error) {
      console.error("Error:", error); // Log any errors
      setError("Failed to fetch data");
    }
  };

  const handleDownload = (fileName) => {
    // Logic for downloading the file (assuming the backend provides a direct link to the file)
    const url = `http://localhost:8001/api/download/${fileName}`; // Modify this based on your backend
    window.open(url, "_blank"); // Open the download link in a new tab
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Doctor's Patient Information Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Patient Information */}
        <section>
          <h2>Patient Information</h2>
          <div>
            <label>Issue Date Start:</label>
            <input
              type="date"
              name="issueDateStart"
              value={formData.issueDateStart}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Issue Date End:</label>
            <input
              type="date"
              name="issueDateEnd"
              value={formData.issueDateEnd}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Reason for Encounter:</label>
            <input
              type="text"
              name="reasonForEncounter"
              value={formData.reasonForEncounter}
              onChange={handleChange}
              placeholder="Reason for visit"
            />
          </div>
          <div>
            <label>Healthcare Unit:</label>
            <input
              type="text"
              name="healthcareUnit"
              value={formData.healthcareUnit}
              onChange={handleChange}
              placeholder="Healthcare unit name"
            />
          </div>
          <div>
            <label>State:</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
          </div>
          <div>
            <label>Patient Age Start:</label>
            <input
              type="number"
              name="patientAgeStart"
              value={formData.patientAgeStart}
              onChange={handleChange}
              placeholder="Minimum age"
            />
          </div>
          <div>
            <label>Patient Age End:</label>
            <input
              type="number"
              name="patientAgeEnd"
              value={formData.patientAgeEnd}
              onChange={handleChange}
              placeholder="Maximum age"
            />
          </div>
        </section>

        {/* Procedure Information */}
        <section>
          <h2>Procedure Information</h2>
          <div>
            <label>Date of Discharge Start:</label>
            <input
              type="date"
              name="dischargeDateStart"
              value={formData.dischargeDateStart}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Date of Discharge End:</label>
            <input
              type="date"
              name="dischargeDateEnd"
              value={formData.dischargeDateEnd}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Reason for Discharge:</label>
            <input
              type="text"
              name="reasonForDischarge"
              value={formData.reasonForDischarge}
              onChange={handleChange}
              placeholder="Reason for discharge"
            />
          </div>
        </section>

        {/* Diagnostic & Evaluation Data */}
        <section>
          <h2>Diagnostic & Evaluation Data</h2>
          <div>
            <label>Problem (Primary Diagnosis):</label>
            <input
              type="text"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              placeholder="Main Diagnosis"
            />
          </div>
        </section>

        {/* Procedure Details */}
        <section>
          <h2>Procedure Details</h2>
          <div>
            <label>Procedure Undertaken:</label>
            <input
              type="text"
              name="procedure"
              value={formData.procedure}
              onChange={handleChange}
              placeholder="Procedure details"
            />
          </div>
        </section>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Submit
        </button>
      </form>
      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Response Table */}
      {responseData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Files to download</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  File Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Download
                </th>
              </tr>
            </thead>
            <tbody>
              {responseData.map((file) => (
                <tr key={file._id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {file._id}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() => handleDownload(file.name)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#008CBA",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MainForm;
