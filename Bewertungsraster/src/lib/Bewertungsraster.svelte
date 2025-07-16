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

    let name = $state("");

    const {form, data} = createForm({
        onSubmit: (values) => {
            render($data)
        },
    })

    const allBewertungsraster = $state([]);

    loadFromStorage();

    function storeData(bewertungsraster) {
        window.localStorage.setItem(`bewertungsraster-tel`, JSON.stringify(bewertungsraster));
    }

    function loadData() {
        const data = window.localStorage.getItem(`bewertungsraster-tel`);
        return JSON.parse(data);
    }

    data.subscribe((data) => {
        const entry = allBewertungsraster.find((bewertungsraster) => bewertungsraster.name === name);
        if (typeof entry !== "undefined") {
            entry.data = data;
        }
        storeData(allBewertungsraster);
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

    function addStudent(event) {
        event.preventDefault();
        allBewertungsraster.push({
            name,
            data: $data,
        })
        storeData(allBewertungsraster);
    }

    function loadFromStorage() {
        allBewertungsraster.splice(0, allBewertungsraster.length);

        const bewertungsrasterFromStorage = loadData();
        for (const fromStorage of bewertungsrasterFromStorage) {
            allBewertungsraster.push(fromStorage);
        }
    }

    function loadBewertungsraster(event) {
        name = event.target.value;

        const entry = allBewertungsraster.find((bewertungsraster) => bewertungsraster.name === name)
        $data = entry.data;
    }
</script>

<h1>Bewertungsraster TEL {$data.name}</h1>
<div>
    <ul>
        <li>Note: <strong>{$punkte.note}</strong></li>
        <li>Punkte: {$punkte.punkte}/{$punkte.max}</li>
    </ul>

    <form>
        <select name="name" onchange={loadBewertungsraster}>
            {#each allBewertungsraster as bewertung}
                <option>{bewertung.name}</option>
            {/each}
        </select>
        <button onclick={addStudent}>Hinzufügen</button>
    </form>

    <form use:form>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" bind:value={name}>
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
                            step=1/
                            value="{$data?.[field.label]?.[input.label]?.punkte}">
                    <label for="{field.label}-{input.label}-kommentar">
                        Kommentar
                    </label>
                    <textarea
                            id="{field.label}-{input.label}-kommentar"
                            name="{field.label}.{input.label}.kommentar"
                    >{$data?.[field.label]?.[input.label]?.kommentar}</textarea>
                {/each}
            </fieldset>
        {/each}

        <button type="submit">Bewertungsblatt laden</button>
    </form>
</div>