export default class QueryBuilder {
  buildQuery(filters) {
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
                "value.value": filters.state.toUpperCase().trim(),
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
            archetype_node_id:
              "openEHR-EHR-EVALUATION.problem_diagnosis-sus.v1",
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
            archetype_node_id:
              "openEHR-EHR-EVALUATION.problem_diagnosis-sus.v1",
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
            archetype_node_id:
              "openEHR-EHR-EVALUATION.problem_diagnosis-sus.v1",
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
  }

  // buildChemotherapyQuery(filters) {
  //   const query = {};
  //   // Initialize the content array for multiple filters with chemotherapy filtering
  //   query["content"] = {
  //     $elemMatch: {
  //       $and: [
  //         {
  //           "data.items": {
  //             $elemMatch: {
  //               archetype_node_id: "at0023",
  //               items: {
  //                 $elemMatch: {
  //                   archetype_node_id: "at0010",
  //                   "value.value": "QUIMIOTERAPIA",
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   };

  //   if (filters["issue date-start"] || filters["issue date-end"]) {
  //     if (filters["issue date-start"] && filters["issue date-end"]) {
  //       // Both start and end date filters are present
  //       query["content"].$elemMatch.$and.push({
  //         "data.items": {
  //           $elemMatch: {
  //             archetype_node_id: "at0023",
  //             items: {
  //               $elemMatch: {
  //                 archetype_node_id: "at0009",
  //                 "value.value": {
  //                   $gte: `${filters["issue date-start"]}TZ`,
  //                   $lte: `${filters["issue date-end"]}TZ`,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       });
  //     } else {
  //       // Only one of the filters is present
  //       const rangeConditions = {};

  //       if (filters["issue date-start"]) {
  //         rangeConditions["value.value"] = {
  //           $gte: `${filters["issue date-start"]}TZ`,
  //         };
  //       }

  //       if (filters["issue date-end"]) {
  //         rangeConditions["value.value"] = {
  //           $lte: `${filters["issue date-end"]}TZ`,
  //         };
  //       }

  //       query["content"].$elemMatch.$and.push({
  //         "data.items": {
  //           $elemMatch: {
  //             archetype_node_id: "at0023",
  //             items: {
  //               $elemMatch: {
  //                 archetype_node_id: "at0009",
  //                 ...rangeConditions,
  //               },
  //             },
  //           },
  //         },
  //       });
  //     }
  //   }

  //   if (filters["healthcare unit"]) {
  //     query["content"].$elemMatch.$and.push({
  //       "data.items": {
  //         $elemMatch: {
  //           archetype_node_id: "at0023",
  //           items: {
  //             $elemMatch: {
  //               archetype_node_id: "at0011",
  //               "value.value": filters["healthcare unit"],
  //             },
  //           },
  //         },
  //       },
  //     });
  //   }

  //   if (filters["State"]) {
  //     query["content"].$elemMatch.$and.push({
  //       "data.items": {
  //         $elemMatch: {
  //           archetype_node_id: "at0023",
  //           items: {
  //             $elemMatch: {
  //               archetype_node_id: "at0028",
  //               "value.value": filters["State"],
  //             },
  //           },
  //         },
  //       },
  //     });
  //   }

  //   if (filters["patient age-start"] || filters["patient age-end"]) {
  //     if (filters["patient age-start"] && filters["patient age-end"]) {
  //       // Both start and end date filters are present
  //       query["content"].$elemMatch.$and.push({
  //         "data.items": {
  //           $elemMatch: {
  //             archetype_node_id: "at0023",
  //             items: {
  //               $elemMatch: {
  //                 archetype_node_id: "at0012",
  //                 "value.magnitude": {
  //                   $gte: filters["patient age-start"].toString(),
  //                   $lte: filters["patient age-end"].toString(),
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       });
  //     } else {
  //       // Only one of the filters is present
  //       const rangeConditions = {};

  //       if (filters["patient age-start"]) {
  //         rangeConditions["value.magnitude"] = {
  //           $gte: filters["patient age-start"].toString(),
  //         };
  //       }

  //       if (filters["patient age-end"]) {
  //         rangeConditions["value.magnitude"] = {
  //           $lte: filters["patient age-end"].toString(),
  //         };
  //       }

  //       query["content"].$elemMatch.$and.push({
  //         "data.items": {
  //           $elemMatch: {
  //             archetype_node_id: "at0023",
  //             items: {
  //               $elemMatch: {
  //                 archetype_node_id: "at0012",
  //                 ...rangeConditions,
  //               },
  //             },
  //           },
  //         },
  //       });
  //     }
  //   }

  //   if (
  //     filters["duration of treatment-start"] ||
  //     filters["duration of treatment-end"]
  //   ) {
  //     if (
  //       filters["duration of treatment-start"] &&
  //       filters["duration of treatment-end"]
  //     ) {
  //       // Both start and end date filters are present
  //       query["content"].$elemMatch.$and.push({
  //         "data.items": {
  //           $elemMatch: {
  //             archetype_node_id: "at0016",
  //             items: {
  //               $elemMatch: {
  //                 archetype_node_id: "at0013",
  //                 "value.magnitude": {
  //                   $gte: `${filters["duration of treatment-start"]}.0`,
  //                   $lte: `${filters["duration of treatment-end"]}.0`,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       });
  //     } else {
  //       // Only one of the filters is present
  //       const rangeConditions = {};

  //       if (filters["duration of treatment-start"]) {
  //         rangeConditions["value.magnitude"] = {
  //           $gte: `${filters["duration of treatment-start"]}.0`,
  //         };
  //       }

  //       if (filters["duration of treatment-end"]) {
  //         rangeConditions["value.magnitude"] = {
  //           $lte: `${filters["duration of treatment-end"]}.0`,
  //         };
  //       }

  //       query["content"].$elemMatch.$and.push({
  //         "data.items": {
  //           $elemMatch: {
  //             archetype_node_id: "at0016",
  //             items: {
  //               $elemMatch: {
  //                 archetype_node_id: "at0013",
  //                 ...rangeConditions,
  //               },
  //             },
  //           },
  //         },
  //       });
  //     }
  //   }

  //   if (filters["schema"]) {
  //     query["content"].$elemMatch.$and.push({
  //       "data.items": {
  //         $elemMatch: {
  //           archetype_node_id: "at0016",
  //           items: {
  //             $elemMatch: {
  //               archetype_node_id: "at0014",
  //               "value.value": filters["schema"],
  //             },
  //           },
  //         },
  //       },
  //     });
  //   }

  //   if (
  //     filters["date of beginning of chemotherapy-start"] ||
  //     filters["date of beginning of chemotherapy-end"]
  //   ) {
  //     if (
  //       filters["date of beginning of chemotherapy-start"] &&
  //       filters["date of beginning of chemotherapy-end"]
  //     ) {
  //       // Both start and end date filters are present
  //       query["content"].$elemMatch.$and.push({
  //         "data.items": {
  //           $elemMatch: {
  //             archetype_node_id: "at0016",
  //             items: {
  //               $elemMatch: {
  //                 archetype_node_id: "at0031",
  //                 "value.value": {
  //                   $gte: `${filters["date of beginning of chemotherapy-start"]}TZ`,
  //                   $lte: `${filters["date of beginning of chemotherapy-end"]}TZ`,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       });
  //     } else {
  //       // Only one of the filters is present
  //       const rangeConditions = {};

  //       if (filters["date of beginning of chemotherapy-start"]) {
  //         rangeConditions["value.value"] = {
  //           $gte: `${filters["date of beginning of chemotherapy-start"]}TZ`,
  //         };
  //       }

  //       if (filters["date of beginning of chemotherapy-end"]) {
  //         rangeConditions["value.value"] = {
  //           $lte: `${filters["date of beginning of chemotherapy-end"]}TZ`,
  //         };
  //       }

  //       query["content"].$elemMatch.$and.push({
  //         "data.items": {
  //           $elemMatch: {
  //             archetype_node_id: "at0016",
  //             items: {
  //               $elemMatch: {
  //                 archetype_node_id: "at0031",
  //                 ...rangeConditions,
  //               },
  //             },
  //           },
  //         },
  //       });
  //     }
  //   }

  //   return query;
  // }

  // buildChemotherapyQuery(filters) {
  //   const query = {};
  //   // Initialize the content array for multiple filters with chemotherapy filtering
  //   query["content.0.data.items"] = {
  //     $elemMatch: {
  //       $and: [
  //         {
  //           archetype_node_id: "at0023",
  //           items: {
  //             $elemMatch: {
  //               $and: [
  //                 {
  //                   archetype_node_id: "at0010",
  //                   "value.value": "QUIMIOTERAPIA",
  //                 },
  //               ],
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   };

  //   if (filters["issue date-start"] || filters["issue date-end"]) {
  //     if (filters["issue date-start"] && filters["issue date-end"]) {
  //       // Both start and end date filters are present
  //       query[
  //         "content.0.data.items"
  //       ].$elemMatch.$and[0].items.$elemMatch.$and.push({
  //         archetype_node_id: "at0009",
  //         "value.value": {
  //           $gte: `${filters["issue date-start"]}TZ`,
  //           $lte: `${filters["issue date-end"]}TZ`,
  //         },
  //       });
  //     } else {
  //       // Only one of the filters is present
  //       const rangeConditions = {};

  //       if (filters["issue date-start"]) {
  //         rangeConditions["value.value"] = {
  //           $gte: `${filters["issue date-start"]}TZ`,
  //         };
  //       }

  //       if (filters["issue date-end"]) {
  //         rangeConditions["value.value"] = {
  //           $lte: `${filters["issue date-end"]}TZ`,
  //         };
  //       }

  //       query[
  //         "content.0.data.items"
  //       ].$elemMatch.$and[0].items.$elemMatch.$and.push({
  //         archetype_node_id: "at0009",
  //         ...rangeConditions,
  //       });
  //     }
  //   }

  //   // if (filters["healthcare unit"]) {
  //   //   query["content"].$elemMatch.$and.push({
  //   //     "data.items": {
  //   //       $elemMatch: {
  //   //         archetype_node_id: "at0023",
  //   //         items: {
  //   //           $elemMatch: {
  //   //             archetype_node_id: "at0011",
  //   //             "value.value": filters["healthcare unit"],
  //   //           },
  //   //         },
  //   //       },
  //   //     },
  //   //   });
  //   // }

  //   // if (filters["State"]) {
  //   //   query["content"].$elemMatch.$and.push({
  //   //     "data.items": {
  //   //       $elemMatch: {
  //   //         archetype_node_id: "at0023",
  //   //         items: {
  //   //           $elemMatch: {
  //   //             archetype_node_id: "at0028",
  //   //             "value.value": filters["State"],
  //   //           },
  //   //         },
  //   //       },
  //   //     },
  //   //   });
  //   // }

  //   if (filters["patient age-start"] || filters["patient age-end"]) {
  //     if (filters["patient age-start"] && filters["patient age-end"]) {
  //       // Both start and end date filters are present
  //       query[
  //         "content.0.data.items"
  //       ].$elemMatch.$and[0].items.$elemMatch.$and.push({
  //         archetype_node_id: "at0012",
  //         "value.magnitude": {
  //           $gte: filters["patient age-start"].toString(),
  //           $lte: filters["patient age-end"].toString(),
  //         },
  //       });
  //     } else {
  //       // Only one of the filters is present
  //       const rangeConditions = {};

  //       if (filters["patient age-start"]) {
  //         rangeConditions["value.magnitude"] = {
  //           $gte: filters["patient age-start"].toString(),
  //         };
  //       }

  //       if (filters["patient age-end"]) {
  //         rangeConditions["value.magnitude"] = {
  //           $lte: filters["patient age-end"].toString(),
  //         };
  //       }

  //       query[
  //         "content.0.data.items"
  //       ].$elemMatch.$and[0].items.$elemMatch.$and.push({
  //         $elemMatch: {
  //           archetype_node_id: "at0012",
  //           ...rangeConditions,
  //         },
  //       });
  //     }
  //   }

  //   // if (
  //   //   filters["duration of treatment-start"] ||
  //   //   filters["duration of treatment-end"]
  //   // ) {
  //   //   if (
  //   //     filters["duration of treatment-start"] &&
  //   //     filters["duration of treatment-end"]
  //   //   ) {
  //   //     // Both start and end date filters are present
  //   //     query["content"].$elemMatch.$and.push({
  //   //       "data.items": {
  //   //         $elemMatch: {
  //   //           archetype_node_id: "at0016",
  //   //           items: {
  //   //             $elemMatch: {
  //   //               archetype_node_id: "at0013",
  //   //               "value.magnitude": {
  //   //                 $gte: `${filters["duration of treatment-start"]}.0`,
  //   //                 $lte: `${filters["duration of treatment-end"]}.0`,
  //   //               },
  //   //             },
  //   //           },
  //   //         },
  //   //       },
  //   //     });
  //   //   } else {
  //   //     // Only one of the filters is present
  //   //     const rangeConditions = {};

  //   //     if (filters["duration of treatment-start"]) {
  //   //       rangeConditions["value.magnitude"] = {
  //   //         $gte: `${filters["duration of treatment-start"]}.0`,
  //   //       };
  //   //     }

  //   //     if (filters["duration of treatment-end"]) {
  //   //       rangeConditions["value.magnitude"] = {
  //   //         $lte: `${filters["duration of treatment-end"]}.0`,
  //   //       };
  //   //     }

  //   //     query["content"].$elemMatch.$and.push({
  //   //       "data.items": {
  //   //         $elemMatch: {
  //   //           archetype_node_id: "at0016",
  //   //           items: {
  //   //             $elemMatch: {
  //   //               archetype_node_id: "at0013",
  //   //               ...rangeConditions,
  //   //             },
  //   //           },
  //   //         },
  //   //       },
  //   //     });
  //   //   }
  //   // }

  //   // if (filters["schema"]) {
  //   //   query["content"].$elemMatch.$and.push({
  //   //     "data.items": {
  //   //       $elemMatch: {
  //   //         archetype_node_id: "at0016",
  //   //         items: {
  //   //           $elemMatch: {
  //   //             archetype_node_id: "at0014",
  //   //             "value.value": filters["schema"],
  //   //           },
  //   //         },
  //   //       },
  //   //     },
  //   //   });
  //   // }

  //   // if (
  //   //   filters["date of beginning of chemotherapy-start"] ||
  //   //   filters["date of beginning of chemotherapy-end"]
  //   // ) {
  //   //   if (
  //   //     filters["date of beginning of chemotherapy-start"] &&
  //   //     filters["date of beginning of chemotherapy-end"]
  //   //   ) {
  //   //     // Both start and end date filters are present
  //   //     query["content"].$elemMatch.$and.push({
  //   //       "data.items": {
  //   //         $elemMatch: {
  //   //           archetype_node_id: "at0016",
  //   //           items: {
  //   //             $elemMatch: {
  //   //               archetype_node_id: "at0031",
  //   //               "value.value": {
  //   //                 $gte: `${filters["date of beginning of chemotherapy-start"]}TZ`,
  //   //                 $lte: `${filters["date of beginning of chemotherapy-end"]}TZ`,
  //   //               },
  //   //             },
  //   //           },
  //   //         },
  //   //       },
  //   //     });
  //   //   } else {
  //   //     // Only one of the filters is present
  //   //     const rangeConditions = {};

  //   //     if (filters["date of beginning of chemotherapy-start"]) {
  //   //       rangeConditions["value.value"] = {
  //   //         $gte: `${filters["date of beginning of chemotherapy-start"]}TZ`,
  //   //       };
  //   //     }

  //   //     if (filters["date of beginning of chemotherapy-end"]) {
  //   //       rangeConditions["value.value"] = {
  //   //         $lte: `${filters["date of beginning of chemotherapy-end"]}TZ`,
  //   //       };
  //   //     }

  //   //     query["content"].$elemMatch.$and.push({
  //   //       "data.items": {
  //   //         $elemMatch: {
  //   //           archetype_node_id: "at0016",
  //   //           items: {
  //   //             $elemMatch: {
  //   //               archetype_node_id: "at0031",
  //   //               ...rangeConditions,
  //   //             },
  //   //           },
  //   //         },
  //   //       },
  //   //     });
  //   //   }
  //   // }

  //   return query;
  // }

  buildChemotherapyQuery(filters) {
    const query = {};
    query["content.0.data.items.0.items.1.value.value"] = "QUIMIOTERAPIA";

    if (filters["issue date-start"] || filters["issue date-end"]) {
      if (filters["issue date-start"] && filters["issue date-end"]) {
        // Both start and end date filters are present
        query["content.0.data.items.0.items.0.value.value"] = {
          $gte: `${filters["issue date-start"]}TZ`,
          $lte: `${filters["issue date-end"]}TZ`,
        };
      } else {
        if (filters["issue date-start"]) {
          query["content.0.data.items.0.items.0.value.value"] = {
            $gte: `${filters["issue date-start"]}TZ`,
          };
        }
        if (filters["issue date-end"]) {
          query["content.0.data.items.0.items.0.value.value"] = {
            $lte: `${filters["issue date-end"]}TZ`,
          };
        }
      }
    }

    if (filters["healthcare unit"]) {
      query["content.0.data.items.0.items.2.value.value"] =
        filters["healthcare unit"];
    }

    if (filters["State"]) {
      query["content.0.data.items.0.items.3.value.value"] = filters["State"];
    }

    if (filters["patient age-start"] || filters["patient age-end"]) {
      if (filters["patient age-start"] && filters["patient age-end"]) {
        query["content.0.data.items.1.items.0.value.value"] = {
          $gte: `${filters["patient age-start"]}TZ`,
          $lte: `${filters["patient age-end"]}TZ`,
        };
      } else {
        if (filters["patient age-start"]) {
          query["content.0.data.items.1.items.0.value.value"] = {
            $gte: `${filters["patient age-start"]}TZ`,
          };
        }
        if (filters["patient age-end"]) {
          query["content.0.data.items.1.items.0.value.value"] = {
            $lte: `${filters["patient age-end"]}TZ`,
          };
        }
      }
    }

    if (
      filters["duration of treatment-start"] ||
      filters["duration of treatment-end"]
    ) {
      if (
        filters["duration of treatment-start"] &&
        filters["duration of treatment-end"]
      ) {
        query["content.0.data.items.1.items.0.value.value"] = {
          $gte: `${filters["duration of treatment-start"]}TZ`,
          $lte: `${filters["duration of treatment-end"]}TZ`,
        };
      } else {
        if (filters["duration of treatment-start"]) {
          query["content.0.data.items.1.items.0.value.value"] = {
            $gte: `${filters["duration of treatment-start"]}TZ`,
          };
        }
        if (filters["duration of treatment-end"]) {
          query["content.0.data.items.1.items.0.value.value"] = {
            $lte: `${filters["duration of treatment-end"]}TZ`,
          };
        }
      }
    }

    if (filters["schema"]) {
      query["content.0.data.items.1.items.1.value.value"] = filters["schema"];
    }

    if (
      filters["date of beginning of chemotherapy-start"] ||
      filters["date of beginning of chemotherapy-end"]
    ) {
      if (
        filters["date of beginning of chemotherapy-start"] &&
        filters["date of beginning of chemotherapy-end"]
      ) {
        query["content.0.data.items.2.items.0.value.value"] = {
          $gte: `${filters["date of beginning of chemotherapy-start"]}TZ`,
          $lte: `${filters["date of beginning of chemotherapy-end"]}TZ`,
        };
      } else {
        if (filters["date of beginning of chemotherapy-start"]) {
          query["content.0.data.items.2.items.0.value.value"] = {
            $gte: `${filters["date of beginning of chemotherapy-start"]}TZ`,
          };
        }
        if (filters["date of beginning of chemotherapy-end"]) {
          query["content.0.data.items.2.items.0.value.value"] = {
            $lte: `${filters["date of beginning of chemotherapy-end"]}TZ`,
          };
        }
      }
    }

    if (
      filters["date of discharge-start"] ||
      filters["date of discharge-end"]
    ) {
      if (
        filters["date of discharge-start"] &&
        filters["date of discharge-end"]
      ) {
        query["content.0.data.items.2.items.0.value.value"] = {
          $gte: `${filters["date of discharge-start"]}TZ`,
          $lte: `${filters["date of discharge-end"]}TZ`,
        };
      } else {
        if (filters["date of discharge-start"]) {
          query["content.0.data.items.2.items.0.value.value"] = {
            $gte: `${filters["date of discharge-start"]}TZ`,
          };
        }
        if (filters["date of discharge-end"]) {
          query["content.1.data.items.0.value.value"] = {
            $lte: `${filters["date of discharge-end"]}TZ`,
          };
        }
      }
    }

    if (filters["reason for discharge"]) {
      query["content.1.data.items.1.value.value"] =
        filters["reason for discharge"];
    }

    if (filters["Problem"]) {
      query["content.2.data.items.0.value.value"] = filters["Problem"];
    }

    if (filters["Secondary Diagnosis"]) {
      query["content.2.data.items.1.value.value"] =
        filters["Secondary Diagnosis"];
    }

    if (filters["Associated causes"]) {
      query["content.2.data.items.2.value.value"] =
        filters["Associated causes"];
    }

    if (filters["Invaded regional linphonodes"]) {
      query["content.2.data.items.3.value.value"] =
        filters["Invaded regional linphonodes"];
    }

    if (filters["Clinical staging"]) {
      query["content.2.data.items.4.items.0.items.value.value"] =
        filters["Clinical staging"];
    }

    if (filters["Histopathological grading (G)"]) {
      query["content.2.data.items.4.items.1.items.0.value.value"] =
        filters["Histopathological grading (G)"];
    }

    return query;
  }
}
