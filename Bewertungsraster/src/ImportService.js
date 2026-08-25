import Ajv from "ajv";

import schema from "./bewertungsraster.schema.json" with {type: "json"}

export function ImportService({set, getAll}) {
    const ajv = new Ajv();

    function hasCollision(a, b) {
        return a.name === b.name && a.className === b.className
    }

    function importData(data) {
        let parsedData;
        try {
            parsedData = JSON.parse(data);
        } catch (error) {
            return new Error('parsing failed', {cause: error})
        }

        // validate
        const errors = [];
        for (const bewertungsraster of parsedData) {
            const valid = ajv.validate(schema, bewertungsraster);
            if (!valid) {
                errors.push(ajv.errors);
            }
        }

        if (errors.length > 0) return new AggregateError(errors);

        const all = getAll();

        // remove duplicates
        const filteredData = parsedData.filter((importedBewertungsraster) => all.every((storedBewertungsraster) => !hasCollision(storedBewertungsraster, importedBewertungsraster)));
        const collisions = parsedData
            .filter((importedBewertungsraster) => all.some((storedBewertungsraster) => hasCollision(storedBewertungsraster, importedBewertungsraster)))
            .map((bewertungsraster) => {
                return {
                    name: bewertungsraster.name,
                    className: bewertungsraster.className
                }
            });
        all.push(...filteredData);

        set(all);

        if (filteredData.length < parsedData.length) {
            const message = `Folgende Duplikate (gleicher Name, gleiche Klasse) wurden übersprungen:\n${collisions.map((collision) => `- ${collision.name}, ${collision.className}`).join('\n')}`;
            return new Error(message)
        }
    }

    return importData
}


