import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// common middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

// Function to build the query based on filters
const buildQuery = (filters) => {
  const query = {};
  // Initialize the content array for multiple filters
  query["content"] = {
    $elemMatch: {
      $and: [],
    },
  };

  // General data
  if (filters.issueDateStart && filters.issueDateEnd) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "at0023",
          items: {
            $elemMatch: {
              archetype_node_id: "at0009",
              "value.value": {
                $gte: new Date(filters.issueDateStart),
                $lte: new Date(filters.issueDateEnd),
              },
            },
          },
        },
      },
    });
  }

  if (filters.reasonForEncounter) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "at0023",
          items: {
            $elemMatch: {
              archetype_node_id: "at0010",
              "value.value": filters.reasonForEncounter.toUpperCase(),
            },
          },
        },
      },
    });
  }

  if (filters.healthcareUnit) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "at0023",
          items: {
            $elemMatch: {
              archetype_node_id: "at0011",
              "value.value": filters.healthcareUnit,
            },
          },
        },
      },
    });
  }

  if (filters.state) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "at0023",
          items: {
            $elemMatch: {
              archetype_node_id: "at0028",
              "value.value": filters.state.toUpperCase(),
            },
          },
        },
      },
    });
  }

  if (filters.patientAgeStart && filters.patientAgeEnd) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "at0023",
          items: {
            $elemMatch: {
              archetype_node_id: "at0012",
              "value.magnitude": {
                $gte: filters.patientAgeStart.toString(), // Ensure ages are strings
                $lte: filters.patientAgeEnd.toString(), // Ensure ages are strings
              },
            },
          },
        },
      },
    });
  }

  // Helper function to convert DD-MM-YYYY to ISO (YYYY-MM-DD)
  function convertToISO(dateString) {
    const [day, month, year] = dateString.split("-");
    return `${day}-${month}-${year}T`; // ISO format
  }
  if (filters.dischargeDateStart && filters.dischargeDateEnd) {
    const dischargeDateStartISO = convertToISO(filters.dischargeDateStart);
    const dischargeDateEndISO = convertToISO(filters.dischargeDateEnd);

    console.log(dischargeDateStartISO);
    console.log(dischargeDateEndISO);

    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "at0002",
          "value.value": {
            $regex: new RegExp(`^${dischargeDateStartISO}`),
            $options: "i",
          },
        },
      },
    });
  }

  if (filters.reasonForDischarge) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "openEHR-EHR-ADMIN_ENTRY.patient_discharge.v1",
          items: {
            $elemMatch: {
              archetype_node_id: "at0003",
              "value.value": filters.reasonForDischarge,
            },
          },
        },
      },
    });
  }

  // Procedure
  if (filters.procedure) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "openEHR-EHR-ACTION.procedure-sus.v1",
          items: {
            $elemMatch: {
              archetype_node_id: "at0002",
              "value.value": filters.procedure,
            },
          },
        },
      },
    });
  }

  if (filters.procedureTimeStart && filters.procedureTimeEnd) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "openEHR-EHR-ACTION.procedure-sus.v1",
          "time.value": {
            $gte: new Date(filters.procedureTimeStart),
            $lte: new Date(filters.procedureTimeEnd),
          },
        },
      },
    });
  }

  // Problem/Diagnosis
  if (filters.problem) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "openEHR-EHR-EVALUATION.problem_diagnosis-sus.v1",
          items: {
            $elemMatch: {
              archetype_node_id: "at0002.1",
              "value.value": filters.problem,
            },
          },
        },
      },
    });
  }

  if (filters.secondaryDiagnosis) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "openEHR-EHR-EVALUATION.problem_diagnosis-sus.v1",
          items: {
            $elemMatch: {
              archetype_node_id: "at0.1",
              "value.value": filters.secondaryDiagnosis,
            },
          },
        },
      },
    });
  }

  if (filters.associatedCauses) {
    query["content"].$elemMatch.$and.push({
      "data.items": {
        $elemMatch: {
          archetype_node_id: "openEHR-EHR-EVALUATION.problem_diagnosis-sus.v1",
          items: {
            $elemMatch: {
              archetype_node_id: "at0.2",
              "value.value": filters.associatedCauses,
            },
          },
        },
      },
    });
  }

  // Committer
  if (filters.committerName) {
    query["composer.name"] = filters.committerName;
  }

  return query;
};

// Define a route for filtering compositions
app.post("/api/filter", async (req, res) => {
  try {
    const filters = req.body;
    const query = buildQuery(filters);

    // Directly query the MongoDB collection using Mongoose
    const db = mongoose.connection.db;
    const compositions = await db.collection("documents").find(query).toArray();

    res.status(200).json(compositions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export { app };
