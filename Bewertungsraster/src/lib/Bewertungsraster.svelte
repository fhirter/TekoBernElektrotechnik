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

    let {form, data: formData} = createForm({
        onSubmit: (values) => {
            render($formData)
        },
    })

    const allBewertungsraster = $state([]);

    loadAllBewertungsrasterFromStorage();

    formData.subscribe((data) => {
        // store current dataset in array
        const entry = allBewertungsraster.find((bewertungsraster) => bewertungsraster.name === name);
        if (typeof entry !== "undefined") {
            entry.data = data;
        }
        // persist
        storeData(allBewertungsraster);
    })

    const punkte = derived(formData, (data) => {
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
        const inputField = event.target.previousElementSibling;
        const name = inputField.value;
        allBewertungsraster.push({
            name,
            data: $formData,
        })
        storeData(allBewertungsraster);
        inputField.value = "";
    }

    function selectBewertungsraster(event) {
        event.preventDefault();
        const inputField = event.target.previousElementSibling;
        const targetName = inputField.value;
        const bewertungsraster = allBewertungsraster.find((bewertungsraster) => bewertungsraster.name === targetName)
        name = bewertungsraster.name;
        $formData = bewertungsraster.data;
    }

    function loadAllBewertungsrasterFromStorage() {
        allBewertungsraster.splice(0, allBewertungsraster.length);

        const bewertungsrasterFromStorage = loadData();

        for (const fromStorage of bewertungsrasterFromStorage) {
            allBewertungsraster.push(fromStorage);
        }
    }

    function storeData(data) {
        const storageKey = `bewertungsraster-tel`;
        window.localStorage.setItem(storageKey, JSON.stringify(data));
    }

    function loadData() {
        const storageKey = `bewertungsraster-tel`;
        const data = window.localStorage.getItem(storageKey);
        if (data === null) return [];
        return JSON.parse(data);
    }
</script>

<form class="student">
    <label for="name">Name</label>
    <input type="text" id="name" name="name">
    <button onclick={addStudent}>Hinzufügen</button>

    <label for="student">Student auswählen</label>
    <select id="student" name="name">
        {#each allBewertungsraster as bewertung}
            <option>{bewertung.name}</option>
        {/each}
    </select>
    <button onclick={selectBewertungsraster}>Laden</button>
</form>

{#if name !== ""}
    <h1>Bewertungsraster TEL {name}</h1>
    <div>
        <ul>
            <li>Note: <strong>{$punkte.note}</strong></li>
            <li>Punkte: {$punkte.punkte}/{$punkte.max}</li>
        </ul>


        <form class="bewertung" use:form>
            {#each fields as field}
                <fieldset>
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
                                step="1"
                                value="{$formData?.[field.label]?.[input.label]?.punkte}">
                        <label for="{field.label}-{input.label}-kommentar">
                            Kommentar
                        </label>
                        <textarea
                                id="{field.label}-{input.label}-kommentar"
                                name="{field.label}.{input.label}.kommentar"
                        >{$formData?.[field.label]?.[input.label]?.kommentar}</textarea>
                    {/each}
                </fieldset>
            {/each}

            <button type="submit">Bewertungsblatt laden</button>
        </form>
    </div>
{/if}