<script>
    const {
        value,
        description
    } = $props();
</script>
{#if description}
    <details>
        <summary>{@html value}</summary>
        {description}
    </details>
{:else}
    {@html value}
{/if}