class EHRFlattener {

  flattenBariatricEHR(ehrData) {
    // Initialize the flattened object
    const flattened = {};
  
    // Helper function to safely extract nested values
    const getValue = (path, obj) => {
      return path.reduce((acc, key) => 
        (acc && acc[key] !== undefined) ? acc[key] : undefined, obj);
    };
  
    // Extract general patient data
    const generalData = getValue(['content', 0, 'data', 'items', 'items'], ehrData);
    if (generalData) {
      generalData.forEach(item => {
        switch(item.name.value) {
          case 'issue date':
            flattened.issueDate = item.value.value;
            break;
          case 'reason for encounter':
            flattened.reasonForEncounter = item.value.value;
            break;
          case 'healthcare unit':
            flattened.healthcareUnit = item.value.value;
            break;
          case 'State':
            flattened.state = item.value.value;
            break;
          case 'patient age':
            flattened.patientAge = item.value.magnitude;
            break;
        }
      });
    }
  
    // Extract discharge information
    const dischargeData = getValue(['content', 1, 'data', 'items'], ehrData);
    if (dischargeData) {
      dischargeData.forEach(item => {
        switch(item.name.value) {
          case 'date of discharge':
            flattened.dischargeDate = item.value.value;
            break;
          case 'reason for discharge':
            flattened.dischargeReason = item.value.value;
            break;
        }
      });
    }
  
    // Extract bariatric surgery evaluation
    const surgeryEvaluation = getValue(['content', 2, 'data', 'items'], ehrData);
    if (surgeryEvaluation) {
      surgeryEvaluation.forEach(item => {
        switch(item.name.value) {
          case 'Baros score':
            flattened.barosScore = item.value.value;
            break;
          case 'Baros table':
            flattened.barosTable = item.value.value;
            break;
          case 'duration of follow-up (months)':
            flattened.followUpDuration = item.null_flavour ? 'Unknown' : item.value;
            break;
        }
      });
    }
  
    // Extract problem/diagnosis
    const problemDiagnosis = getValue(['content', 3, 'data', 'items'], ehrData);
    if (problemDiagnosis) {
      problemDiagnosis.forEach(item => {
        switch(item.name.value) {
          case 'Problem':
            flattened.primaryDiagnosis = item.value.value;
            break;
          case 'Secondary Diagnosis':
            flattened.secondaryDiagnosis = item.value.value;
            break;
          case 'Associated causes':
            flattened.associatedCauses = item.value.value;
            break;
        }
      });
    }
  
    // Extract procedure information
    const procedure = getValue(['content', 4], ehrData);
    if (procedure) {
      flattened.procedureTime = procedure.time.value;
      flattened.procedureName = getValue(['description', 'items', 'value', 'value'], procedure);
      flattened.procedureStatus = getValue(['ism_transition', 'current_state', 'value'], procedure);
    }
  
    // Extract Body Mass Index (if available)
    const bmiObservation = getValue(['content', 5], ehrData);
    if (bmiObservation && bmiObservation.data.events.data.items.null_flavour) {
      flattened.bodyMassIndex = 'Unknown';
    }
  
    return flattened;
  }

  flattenChemotherapyEHR(ehr) {
    // Extract general data
    const generalData = ehr.content
      .find(
        (item) =>
          item.archetype_node_id ===
          "openEHR-EHR-ADMIN_ENTRY.high_complexity_procedures_sus.v1"
      )
      ?.data.items.find((item) => item.name.value === "General data")?.items;

    // Extract chemotherapy data
    const chemotherapyData = ehr.content
      .find(
        (item) =>
          item.archetype_node_id ===
          "openEHR-EHR-ADMIN_ENTRY.high_complexity_procedures_sus.v1"
      )
      ?.data.items.find((item) => item.name.value === "chemotherapy")?.items;

    // Extract problem/diagnosis data
    const problemDiagnosisData = ehr.content.find(
      (item) =>
        item.archetype_node_id ===
        "openEHR-EHR-EVALUATION.problem_diagnosis-sus.v1"
    )?.data.items;

    // Extract procedure data
    const procedureData = ehr.content.find(
      (item) => item.archetype_node_id === "openEHR-EHR-ACTION.procedure-sus.v1"
    )?.description.items;

    // Flatten general data
    const generalInfo = generalData
      ? {
          issueDate: generalData.find(
            (item) => item.name.value === "issue date"
          )?.value?.value,
          reasonForEncounter: generalData.find(
            (item) => item.name.value === "reason for encounter"
          )?.value?.value,
          healthcareUnit: generalData.find(
            (item) => item.name.value === "healthcare unit"
          )?.value?.value,
          state: generalData.find((item) => item.name.value === "State")?.value
            ?.value,
          patientAge: generalData.find(
            (item) => item.name.value === "patient age"
          )?.value?.magnitude,
        }
      : {};

    // Flatten chemotherapy data
    const chemotherapyInfo = chemotherapyData
      ? {
          treatmentDuration: chemotherapyData.find(
            (item) => item.name.value === "duration of treatment"
          )?.value?.magnitude,
          treatmentDurationUnits: chemotherapyData.find(
            (item) => item.name.value === "duration of treatment"
          )?.value?.units,
          schema: chemotherapyData.find((item) => item.name.value === "schema")
            ?.value?.value,
          chemotherapyStartDate: chemotherapyData.find(
            (item) => item.name.value === "date of beginning of chemotherapy"
          )?.value?.value,
        }
      : {};

    // Flatten problem/diagnosis data
    const diagnosisInfo = problemDiagnosisData
      ? {
          primaryDiagnosis: problemDiagnosisData.find(
            (item) => item.name.value === "Problem"
          )?.value?.value,
          primaryDiagnosisCode: problemDiagnosisData.find(
            (item) => item.name.value === "Problem"
          )?.value?.defining_code?.code_string,
          secondaryDiagnosis: problemDiagnosisData.find(
            (item) => item.name.value === "Secondary Diagnosis"
          )?.value?.value,
          associatedCauses: problemDiagnosisData.find(
            (item) => item.name.value === "Associated causes"
          )?.value?.value,
          invasedRegionalLymphNodes: problemDiagnosisData.find(
            (item) => item.name.value === "Invaded regional linphonodes"
          )?.value?.value,
        }
      : {};

    // Flatten TNM staging data
    const tnmStaging = problemDiagnosisData?.find(
      (item) => item.name.value === "Tumour - TNM Cancer staging"
    )?.items;

    const stagingInfo = tnmStaging
      ? {
          clinicalStaging: tnmStaging.find(
            (item) => item.name.value === "Clinical (cTNM)"
          )?.items?.value,
          pathologicalStaging: {
            histopathologicalGrading: tnmStaging
              .find((item) => item.name.value === "Pathological (pTNM)")
              ?.items?.find(
                (subItem) =>
                  subItem.name.value === "Histopathological grading (G)"
              )?.null_flavour?.value,
            pathologicalIdentificationDate: tnmStaging
              .find((item) => item.name.value === "Pathological (pTNM)")
              ?.items?.find(
                (subItem) =>
                  subItem.name.value === "date of pathological identification"
              )?.value?.value,
          },
          topography: tnmStaging.find(
            (item) => item.name.value === "topography"
          )?.value?.value,
        }
      : {};

    // Flatten procedure data
    const procedureInfo = procedureData
      ? {
          procedure: procedureData.value?.value,
          procedureCode: procedureData.value?.defining_code?.code_string,
        }
      : {};

    // Combine all flattened data
    return {
      ...generalInfo,
      ...chemotherapyInfo,
      ...diagnosisInfo,
      ...stagingInfo,
      ...procedureInfo,
    };
  }
}

export default EHRFlattener;
