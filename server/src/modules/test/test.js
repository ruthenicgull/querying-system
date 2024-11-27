import EHRFlattener from "../EHRFlattener.js";
import ehr1 from "./sampleEHR1.json" with { type: "json" };
import ehr2 from "./sampleEHR2.json" with { type: "json" };

const ehrFlattener = new EHRFlattener();

const flattenedChemotherapyEHR = ehrFlattener.flattenChemotherapyEHR(ehr2);
console.log(flattenedChemotherapyEHR);
