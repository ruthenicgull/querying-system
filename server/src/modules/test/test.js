import EHRFlattener from "../EHRFlattener.js";
import ehr1 from "./radiotherapy/sampleEHR1.json" assert { type: "json" };
import ehr2 from "./radiotherapy/sampleEHR2.json" assert { type: "json" };
// import ehr3 from "./bariatrics/sampleEHR3.json" assert {type: 'json'};

const ehrFlattener = new EHRFlattener();

const flattenedChemotherapyEHR = ehrFlattener.flattenRadiotherapyEHR(ehr1);
console.log(flattenedChemotherapyEHR);
