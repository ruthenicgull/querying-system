import EHRFlattener from "../EHRFlattener.js";
import ehr1 from "./bariatrics/sampleEHR1.json" assert {type: 'json'};
import ehr2 from "./bariatrics/sampleEHR2.json" assert {type: 'json'};
import ehr3 from "./bariatrics/sampleEHR3.json" assert {type: 'json'};

const ehrFlattener = new EHRFlattener();

const flattenedChemotherapyEHR = ehrFlattener.flattenBariatricEHR(ehr2);
console.log(flattenedChemotherapyEHR);
