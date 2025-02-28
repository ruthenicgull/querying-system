import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import EHRFlattener from "./modules/EHRFlattener.js";
import QueryBuilder from "./modules/QueryBuilder.js";
import { inspect } from "util";

const app = express();
const ehrFlattener = new EHRFlattener();
const queryBuilder = new QueryBuilder();

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

// Define a route for filtering compositions
app.post("/api/filter", async (req, res) => {
  try {
    const filters = req.body;
    const query = queryBuilder.buildQuery(filters);

    // Directly query the MongoDB collection using Mongoose
    const db = mongoose.connection.db;
    const compositions = await db.collection("documents").find(query).toArray();

    const flattenedCompositions = ehrFlattener.flattenEHRS(compositions);

    res.status(200).json({
      compositions: flattenedCompositions,
      query: JSON.stringify(query, null, 2),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/filter/chemo", async (req, res) => {
  const filters = req.body.filters;

  const query = queryBuilder.buildChemotherapyQuery(filters);
  // console.log(inspect(query, { depth: null }));

  // Directly query the MongoDB collection using Mongoose
  const db = mongoose.connection.db;
  const compositions = await db.collection("documents").find(query).toArray();

  const flattenedCompositions = ehrFlattener.flattenEHRS(compositions);

  res.status(200).json({
    compositions: flattenedCompositions,
    query,
  });
});

export { app };
