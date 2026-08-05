import {template} from "./template.js";
import Mustache from "mustache";
import {fields} from "./fields.js";
import {calculateNote, convertData, getMaxPunkte, sumPunkte} from "./Helpers.js";


export function renderToMarkdown(data, studentName) {
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

    return Mustache.render(template, view);
}