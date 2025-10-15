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

    const bewertungskriterien = [
        {"punkte": 0, "bezeichnung": "nicht vorhanden"},
        {"punkte": 1, "bezeichnung": "kaum vorhanden"},
        {"punkte": 2, "bezeichnung": "deutlich ungenügend"},
        {"punkte": 3, "bezeichnung": "ungenügend"},
        {"punkte": 4, "bezeichnung": "knapp genügend"},
        {"punkte": 5, "bezeichnung": "genügend"},
        {"punkte": 6, "bezeichnung": "deutliche Mängel"},
        {"punkte": 7, "bezeichnung": "grössere Mängel"},
        {"punkte": 8, "bezeichnung": "kleine Mängel"},
        {"punkte": 9, "bezeichnung": "minimale Mängel"},
        {"punkte": 10, "bezeichnung": "tadellos"}
    ]

    const max = getMaxPunkte(fields);

    let name = $state("");

    let {form, data: formData} = createForm({
        onSubmit: (values) => {
            render($formData, name)
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

<details>
    <summary>Informationen</summary>
    <p>
        Unter "Name" den Namen des Studenten / der Studentin eingeben und "Hinzufügen" klicken.
        Der erfasste Namen kann nun im Dropdown rechts ausgewählt werden und das Bewertungsraster geladen werden.
    </p>
    <p>
        Wenn die Bewertung abgeschlossen ist, kann mit dem Button "Bewertungsblatt generieren" ganz unten das
        Markdown-Dokument generiert werden.
    </p>
    <p>
        Alle Daten werden ausschliesslich lokal im Browser gespeichert. Ein zentrales Backup wird nicht erstellt.
    </p>
</details>

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
                        <select
                                id="{field.label}-{input.label}"
                                name="{field.label}.{input.label}.punkte"
                        >
                            {#each bewertungskriterien as bewertungskriterium}
                                <option
                                        value={bewertungskriterium.punkte*input.max/10}
                                        selected={parseFloat($formData?.[field.label]?.[input.label]?.punkte) === bewertungskriterium.punkte*input.max/10}
                                >{bewertungskriterium.bezeichnung}</option>
                            {/each}
                        </select>
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

            <button type="submit">Bewertungsblatt generieren</button>
        </form>
    </div>
{/if}