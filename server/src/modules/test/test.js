import EHRFlattener from "../EHRFlattener.js";
import ehr1 from "./radiotherapy/sampleEHR1.json" assert { type: "json" };
import ehr2 from "./bariatrics/sampleEHR2.json" assert { type: "json" };
import ehr3 from "./chemotherapy/sampleEHR2.json" assert { type: "json" };

const ehrFlattener = new EHRFlattener();

const flattenedChemotherapyEHR = ehrFlattener.flattenEHRS([ehr1, ehr2, ehr3]);
console.log(flattenedChemotherapyEHR);
