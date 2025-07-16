import {template} from "./template.js";
import Mustache from "mustache";
import {fields} from "./fields.js";

function promptDownload(output, filename) {
    const blob = new Blob([output], {type: "text/plain"});
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element for download
    const a = document.createElement("a");
    a.href = url;
    a.download = filename; // Sets the filename
    document.body.appendChild(a);
    a.click();

    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function render(data) {

    const name = data.name;
    delete data.name;

    const dataFields= convertData(data);
    const max = getMaxPunkte(fields);
    const punkte = sumPunkte(dataFields);
    const note = calculateNote(punkte, max);

    console.log(dataFields)

    const view = {
        title: `Bewertungsraster`,
        name,
        note,
        punkte,
        max,
        sections: dataFields,
    }

    const output = Mustache.render(template, view);
    const filename = `Bewertungsraster_Diplomarbeit_${name}.md`
    promptDownload(output, filename);
}


export function convertData(data) {
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

    return fields;
}

export function sumPunkte(obj) {
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

export function getMaxPunkte(fields) {
    return fields.reduce((acc, field) => {
        if (field?.bonus === true) return acc;
        // Use reduce on the `inputs` array to sum up the `max` values for each field
        const fieldMaxSum = field.inputs.reduce((sum, input) => {
            return sum + input.max
        }, 0);
        return acc + fieldMaxSum;
    }, 0);
}

export function calculateNote(punkte, max) {
    return Math.min(6, Math.round((punkte / max * 5 + 1)*10)/10);
}