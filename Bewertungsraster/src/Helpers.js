export function getFileName(studentName) {
const timestamp = new Date(new Date() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16).replace('T', '_').replace(':', '');
    return `${timestamp}_Bewertungsraster_Diplomarbeit_${studentName}.md`
}

// convert to format suited for rendering
export function transformBewertungsraster(data) {
    return Object.entries(data).map(([sectionLabel, inputs]) => {
        return {
            section: sectionLabel,
            inputs: Object.entries(inputs).map(([inputLabel, inputValue]) => {
                return {
                    label: inputLabel,
                    value: {
                        ...inputValue,
                        kommentar: inputValue.kommentar?.replace(/[\n\r]+/g, '<br>')
                    },
                }
            })
        }
    });
}

export function getEmptyBewertungsraster(fields, metaInformationSchema) {
    const emptyBewertungsraster = fromSchema(metaInformationSchema);
    for (const field of fields) {
        for (const input of field.inputs) {
            emptyBewertungsraster.data = {
                ...emptyBewertungsraster.data,
                [field.label]: {
                    ...emptyBewertungsraster.data[field.label],
                    [input.label]: {
                        "punkte": 0,
                        "kommentar": "",
                        "max": input.max
                    }
                }
            }
        }
    }
    return emptyBewertungsraster;
}

function fromSchema(schema) {
    if (schema.type === 'object') {
        return Object.fromEntries(
            Object.entries(schema.properties ?? {}).map(([key, value]) => [key, fromSchema(value)])
        );
    }
    if (schema.type === 'array') return [];
    if (schema.type === 'string') return '';
    if (schema.type === 'number') return 0;
    if (schema.type === 'boolean') return false;
    return null;
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

export function isEqual(a, b) {
        return a.name === b.name && a.className === b.className
    }
