import {template} from "./template.js";
import Mustache from "mustache";

function promptDownload(output) {
    const blob = new Blob([output], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element for download
    const a = document.createElement("a");
    a.href = url;
    a.download = "bewertungsraster.md"; // Sets the filename
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function render(data, max) {

    const {fields, punkte} = convertData(data, max);

    const note = calculateNote(punkte, max);

    const name = data.name;

    const view = {
        title: "Bewertungsraster",
        name,
        note,
        punkte,
        max,
        sections: fields,
    }

    const output = Mustache.render(template, view);
    promptDownload(output);
}


function convertData(data) {
    const fields = Object.entries(data).map(([sectionLabel, inputs]) => {
        return {
            section: sectionLabel,
            inputs: Object.entries(inputs).map(([inputLabel, inputValue]) => {
                return {
                    label: inputLabel,
                    value: inputValue,
                }
            })
        }
    });

    const punkte = sumPunkte(fields);

    return {
        punkte,
        fields
    };
}

function sumPunkte(obj) {
  let total = 0;

  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      // Recursively traverse nested objects
      total += sumPunkte(obj[key]);
    } else if (key === "punkte" && obj[key] !== null) {
      // Add "punkte" value if not null
      total += obj[key];
    }
  }

  return total;
}

export function totalMaxSum(fields) {
    return fields.reduce((acc, field) => {
        // Use reduce on the `inputs` array to sum up the `max` values for each field
        const fieldMaxSum = field.inputs.reduce((sum, input) => {
            console.log(input.max);
            return sum + input.max
        }, 0);
        return acc + fieldMaxSum;
    }, 0);
}

function calculateNote(punkte, max) {
    return Math.round((punkte / max * 5 + 1)*10)/10;
}