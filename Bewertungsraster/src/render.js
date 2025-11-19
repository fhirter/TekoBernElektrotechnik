import {template} from "./template.js";
import Mustache from "mustache";
import {fields} from "./fields.js";
import { saveAs } from 'file-saver';

function promptDownload(output, filename) {
    const blob = new Blob([output], {type: "text/plain"});
    saveAs(blob, filename);
}

export function render(data, studentName) {
    const dataFields = convertData(data);
    const max = getMaxPunkte(fields);
    const punkte = sumPunkte(dataFields);
    const note = calculateNote(punkte, max);

    const className = "B-TEL-24-T-a"

    const tutor = "";
    const expert = "";

    const view = {
        title: `Bewertungsraster Diplomarbeit`,
        subtitle: `Teko Bern`,
        date: new Date().toLocaleDateString(),
        studentName,
        className,
        tutor,
        expert,
        note,
        punkte,
        max,
        sections: dataFields,
    }

    const output = Mustache.render(template, view);
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '');

    const filename = `${timestamp}_Bewertungsraster_Diplomarbeit_${studentName}.md`
    promptDownload(output, filename);
}

// convert to format suited for rendering
export function convertData(data) {
    const fields = Object.entries(data).map(([sectionLabel, inputs]) => {
        return {
            section: sectionLabel,
            inputs: Object.entries(inputs).map(([inputLabel, inputValue]) => {
                return {
                    label: inputLabel,
                    value: {
                        ...inputValue,
                        // todo: replace with <br>
                        kommentar: inputValue.kommentar?.replace(/[\n\r]+/g, ' ')
                    },
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
            total += parseFloat(obj[key]);
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
    return Math.min(6, Math.round((punkte / max * 5 + 1) * 10) / 10);
}