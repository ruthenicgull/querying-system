class EHRFlattener {
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
