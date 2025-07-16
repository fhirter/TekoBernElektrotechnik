<script>
    import {createForm} from 'felte';

    import {fields} from "../fields.js";
    import {
        render,
        getMaxPunkte,
        convertData,
        calculateNote,
        sumPunkte
    } from "../render.js";
    import {derived} from "svelte/store";

    const max = getMaxPunkte(fields);

    const {form, data} = createForm({
        onSubmit: (values) => {
            render($data)
        },
    })

    const punkte = derived(data, (data) => {
        const dataFields = convertData(data);
        const punkte = sumPunkte(dataFields);
        const note = calculateNote(punkte, max);
        return {
            punkte,
            note,
            max,
        }
    })

    window.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        event.returnValue = true;
    });

</script>

<style>

</style>

<h1>Bewertungsraster TEL</h1>
<div>
    <ul>
        <li>Note: <strong>{$punkte.note}</strong></li>
        <li>Punkte: {$punkte.punkte}/{$punkte.max}</li>
    </ul>

    <form use:form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name">
        {#each fields as field}
            <fieldset class="bewertung">
                <legend>{field.label}</legend>
                {#each field.inputs as input}
                    <label for="{field.label}-{input.label}">
                        {input.label} <br> (max. {input.max})
                    </label>
                    <input
                            id="{field.label}-{input.label}"
                            name="{field.label}.{input.label}.punkte"
                            type="number"
                            min={input.min}
                            max={input.max}
                            step=1/>
                    <label for="{field.label}-{input.label}-kommentar">
                        Kommentar
                    </label>
                    <textarea
                            id="{field.label}-{input.label}-kommentar"
                            name="{field.label}.{input.label}.kommentar"
                    ></textarea>
                {/each}
            </fieldset>
        {/each}

        <button type="submit">Bewertungsblatt laden</button>
    </form>
</div>