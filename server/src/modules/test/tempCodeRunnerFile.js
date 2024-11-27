import EHRFlattener from "../EHRFlattener.js";
import ehr from "./sampleEHR.json"; // This will be parsed into a JavaScript object if JSON imports are supported.

const ehrFlattener = new EHRFlattener();

const flattenedChemotherapyEHR = ehrFlattener.flattenChemotherapyEHR(ehr);
console.log(flattenedChemotherapyEHR);
