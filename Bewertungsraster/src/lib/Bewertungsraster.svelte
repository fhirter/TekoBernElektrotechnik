<script>
    import {fields} from "../fields.js";
    import {calculateNote, convertData, getMaxPunkte, render, sumPunkte} from "../render.js";

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


    function submitHandler(event) {
        event.preventDefault();
        const {data, name} = currentBewertungsraster;
        render(data, name)
    }

    let currentBewertungsraster = $state({
        name: "",
        data: {},
    });

    currentBewertungsraster = getEmptyBewertungsraster(fields);

    let name = $derived(currentBewertungsraster.name);

    function getEmptyBewertungsraster(fields) {
        const emptyBewertungsraster = {
            name: "",
            data: {}
        }
        for (const field of fields) {
            for (const input of field.inputs) {
                emptyBewertungsraster.data = {
                    ...emptyBewertungsraster.data,
                    [field.label]: {
                        ...emptyBewertungsraster.data[field.label],
                        [input.label]: {
                            "punkte": "0",
                            "kommentar": "",
                            "max": input.max
                        }
                    }
                }
            }
        }
        return emptyBewertungsraster;
    }

    const allBewertungsraster = $state([]);

    loadAllBewertungsrasterFromStorage();

    $effect(() => {
        storeData(allBewertungsraster);
    })

    const punkte = $derived.by(() => {
        const data = currentBewertungsraster.data;
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
        const nameInput = event.target.previousElementSibling;

        currentBewertungsraster =  getEmptyBewertungsraster(fields)
        currentBewertungsraster.name = nameInput.value;

        allBewertungsraster.push(currentBewertungsraster)

        nameInput.value = "";
    }

    function selectBewertungsraster(event) {
        if (typeof event !== "undefined") event.preventDefault();

        const name = event.target.value;

        currentBewertungsraster = allBewertungsraster.find((bewertungsraster) => bewertungsraster.name === name);
    }

    function deleteBewertungsraster(event) {
        event.preventDefault();

        if (!confirm(`Möchten sie ${name} wirklich löschen?`)) return;

        const index = allBewertungsraster.findIndex((bewertungsraster) => bewertungsraster.name === name);
        allBewertungsraster.splice(index, 1);
        storeData(allBewertungsraster);

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
        Unter "Name" den Namen der zu bewertenden Person eingeben und "Hinzufügen" klicken.
        Der erfasste Namen kann nun im Dropdown rechts ausgewählt werden und das Bewertungsraster geladen werden.
    </p>
    <p>
        Wenn die Bewertung abgeschlossen ist, kann mit dem Button "Bewertungsblatt generieren" ganz unten das
        Markdown-Dokument generiert werden. In diesem Dokument sind sämtliche Daten des Formulars enthalten.
    </p>
    <p>
        Alle Daten werden ausschliesslich lokal im Browser gespeichert. Ein zentrales Backup wird nicht erstellt.
    </p>
    <p>
        Der Abschnitt "Bonus" wird für die maximal möglichen Punkte nicht berücksichtigt und soll nur für zusätzliche
        Punkte verwendet werden.
    </p>
    <p>
        Unterstütze Browser: Aktuell nur Firefox ohne Fehler.
        Bekannte Fehler: Unter Safari funktioniert der Download nicht. Unter Chrome und Edge können Daten verloren gehen.
    </p>
</details>

<form class="student">
    <label for="name">Vorname Nachname</label>
    <input type="text" id="name" name="name">
    <button onclick={addStudent}>Hinzufügen</button>

    <label for="student">Person auswählen</label>
    <select id="student" name="name"
            bind:value={name}
            onchange={selectBewertungsraster}
    >
        {#each allBewertungsraster as bewertung}
            <option>{bewertung.name}</option>
        {/each}
    </select>
    <button onclick={deleteBewertungsraster}>Löschen</button>
</form>

{#if name !== ""}
    <h1>Bewertungsraster TEL {name}</h1>
    <div>
        <ul>
            <li>Note: <strong>{punkte.note}</strong></li>
            <li>Punkte: {punkte.punkte}/{punkte.max}</li>
        </ul>

        {#key currentBewertungsraster}
            <form class="bewertung">
            {#each fields as field}
                <fieldset>
                    <legend>{field.label}</legend>
                    {#each field.inputs as input}
                        <label for="{field.label}-{input.label}">
                            <!-- todo: remove the assignment as it is for backwards compatibility -->
                            {input.label} <br> ({currentBewertungsraster.data[field.label][input.label].punkte}/{currentBewertungsraster.data[field.label][input.label]["max"] = input.max})
                        </label>
                        <select
                                id="{field.label}-{input.label}"
                                name="{field.label}.{input.label}.punkte"
                                bind:value={currentBewertungsraster.data[field.label][input.label]["punkte"]}
                        >
                            {#each bewertungskriterien as bewertungskriterium}
                                <!-- todo: remove parseFloat and string conversion -->
                                <option
                                        value={""+bewertungskriterium.punkte*input.max/10}
                                        selected={parseFloat(currentBewertungsraster.data[field.label][input.label]?.punkte) === bewertungskriterium.punkte*input.max/10}
                                >{bewertungskriterium.bezeichnung}</option>
                            {/each}
                        </select>
                        <label for="{field.label}-{input.label}-kommentar">
                            Kommentar
                        </label>
                        <textarea
                                id="{field.label}-{input.label}-kommentar"
                                name="{field.label}.{input.label}.kommentar"
                                bind:value={currentBewertungsraster.data[field.label][input.label]["kommentar"]}
                        >{currentBewertungsraster.data[field.label][input.label]["kommentar"]}</textarea>
                    {/each}
                </fieldset>
            {/each}

            <button type="submit" onclick={submitHandler}>Bewertungsblatt generieren</button>
        </form>
        {/key}
    </div>
{/if}