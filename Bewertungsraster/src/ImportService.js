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

        if (errors.length > 0) return new AggregateError(errors)

        const all = getAll();

        // remove duplicates
        const filteredData = parsedData.filter((importedBewertungsraster) => all.every((storedBewertungsraster) => !hasCollision(storedBewertungsraster, importedBewertungsraster)))

        all.push(...filteredData);

        set(all);

        if (filteredData.length < parsedData.length) return new Error(`${parsedData.length - filteredData.length} duplicates detected.`)
    }

    return importData
}


