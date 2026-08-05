<script>
    import {fields} from "../fields.js";
    import {bewertungskriterien} from "../bewertungskriterien.js";
    import {renderToMarkdown} from "../renderToMarkdown.js";
    import {openHtmlPopup, promptDownload} from "../OutputHandlers.js";
    import {renderToHtml} from "../renderToHtml.js";
    import {calculateNote, getFileName, getMaxPunkte, sumPunkte, transformBewertungsraster} from "../Helpers.js";
    import {getEmptyBewertungsraster} from "../Helpers.js";
    import {getAll, set} from "../BewertungsrasterRepository.js"

    import Details from "./Details.svelte";

    import metaInformationSchema from "../metaInformation.schema.json" with {type: "json"}

    const featureFlags = {
        htmlPopup: false
    }

    function submitHandler(event) {
        event.preventDefault();

        const markdown = renderToMarkdown(currentBewertungsraster);
        const filename = getFileName(name);

        const html = renderToHtml(markdown);

        if (featureFlags.htmlPopup) openHtmlPopup(html)
        promptDownload(markdown, filename);
    }

    let currentBewertungsraster = $state();

    let name = $derived(currentBewertungsraster?.name);

    const allBewertungsraster = $state(getAll());

    $effect(() => {
        set(allBewertungsraster);
    })

    const punkte = $derived.by(() => {
        if (typeof currentBewertungsraster === "undefined") return;

        const data = currentBewertungsraster.data;
        const dataFields = transformBewertungsraster(data);
        const punkte = sumPunkte(dataFields);
        const max = getMaxPunkte(fields);
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

        currentBewertungsraster = getEmptyBewertungsraster(fields, metaInformationSchema);
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
        set(allBewertungsraster);

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
        <strong>Der Abschnitt "Bonus" wird für die maximal möglichen Punkte nicht berücksichtigt und soll nur für
            zusätzliche
            Punkte verwendet werden.</strong>
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
        <option></option>
        {#each allBewertungsraster as bewertung}
            <option>{bewertung.name}</option>
        {/each}
    </select>
    <button onclick={deleteBewertungsraster}>Löschen</button>
</form>

{#if typeof currentBewertungsraster?.name !== "undefined"}
    <h1>Bewertungsraster TEL {name}</h1>
    <div>
        <ul>
            <li>Note: <strong>{punkte.note}</strong></li>
            <li>Punkte: {punkte.punkte}/{punkte.max}</li>
        </ul>

        {#key currentBewertungsraster}
            <form class="bewertung">
                <fieldset>
                    <label for="name">
                        Name
                    </label>
                    <input type="text" id="name" name="name" bind:value={currentBewertungsraster.name} />
                    <label for="className">
                        Klasse
                    </label>
                    <input type="text" id="className" name="className" bind:value={currentBewertungsraster.className} />
                    <label for="tutor">
                        Betreuer:in
                    </label>
                    <input type="text" id="tutor" name="tutor" bind:value={currentBewertungsraster.tutor} />
                    <label for="expert">
                        Expert:in
                    </label>
                    <input type="text" id="expert" name="expert" bind:value={currentBewertungsraster.expert} />
                </fieldset>
                {#each fields as field}
                    <fieldset>
                        <legend>
                            <Details
                                    value={field.label}
                                    description={field.description}
                            ></Details>
                        </legend>
                        {#each field.inputs as input}
                            <label for="{field.label}-{input.label}">
                                <Details
                                        value="{input.label} <br>
                                            ({currentBewertungsraster.data[field.label][input.label].punkte}/{currentBewertungsraster.data[field.label][input.label]['max']})"
                                        description="{input.description}"
                                ></Details>
                            </label>
                            <select
                                    id="{field.label}-{input.label}"
                                    name="{field.label}.{input.label}.punkte"
                                    bind:value={currentBewertungsraster.data[field.label][input.label]["punkte"]}
                            >
                                {#each bewertungskriterien as bewertungskriterium}
                                    <option
                                            value={bewertungskriterium.punkte*input.max/10}
                                            selected={currentBewertungsraster.data[field.label][input.label]?.punkte === bewertungskriterium.punkte*input.max/10}
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