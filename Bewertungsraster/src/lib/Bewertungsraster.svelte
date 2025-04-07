<script>
    import {createForm} from 'felte';

    import {fields} from "../fields.js";
    import {render, totalMaxSum} from "../render.js";

    const max = totalMaxSum(fields);

    const {form, data} = createForm({
        onSubmit: (values) => {
            render($data, max)
        },
    })

    window.addEventListener("beforeunload", (event) => {
        event.preventDefault();
        event.returnValue = true;
    });

</script>

<style>
    fieldset {
        display: grid;
        grid-template-columns: 25rem 3rem 10rem 10rem;
        width: 40rem;
        gap: 1rem;
    }
</style>

<h1>Bewertungsraster TEL</h1>

<form use:form>
    <label for="name">Name</label>
    <input type="text" id="name" name="name">
    {#each fields as field}
        <fieldset>
            <legend>{field.label}</legend>
            {#each field.inputs as input}
                <label for="{field.label}-{input.label}">
                    {input.label} (max. {input.max})
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