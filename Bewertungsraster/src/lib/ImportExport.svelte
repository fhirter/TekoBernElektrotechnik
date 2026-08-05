<script>
    import {getAll, set} from "../BewertungsrasterRepository.js";
    import {ImportService} from "../ImportService.js";
    import {promptDownload} from "../OutputHandlers.js";

    const {importCallback} = $props();

    const importData = ImportService({set, getAll});

    let fileInput = $state();

    function exportHandler(event) {
        event.preventDefault();

        const data = getAll();
        const string = JSON.stringify(data)
        promptDownload(string, 'bewertungsraster.json')
    }

    function importHandler(event) {
        event.preventDefault();

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const error = importData(data);
            if (error) alert(`An error occured: ${error.message}`, error);

            importCallback();
        };
        for (const file of fileInput.files) {
            reader.readAsText(file);
        }
    }
</script>

<form>
    <button onclick={exportHandler}>Exportieren</button>
    Importieren: <input type="file" accept=".json" onchange={importHandler} bind:this={fileInput}>
</form>