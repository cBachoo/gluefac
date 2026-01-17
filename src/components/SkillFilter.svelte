<script lang="ts">
    interface Props {
        whites: { [key: string]: number }; // 0 = not selected, 1-3 = min stars
        availableWhites: string[] | (() => string[]);
    }

    let { whites, availableWhites }: Props = $props();

    let showModal = $state(false);
    let searchWhites = $state("");

    const available = $derived(
        typeof availableWhites === "function"
            ? availableWhites()
            : availableWhites,
    );

    const filteredWhites = $derived(
        available.filter((w) =>
            w.toLowerCase().includes(searchWhites.toLowerCase()),
        ),
    );

    const selectedWhites = $derived(
        Object.entries(whites)
            .filter(([_, v]) => v > 0)
            .map(([k, v]) => ({ name: k, stars: v })),
    );

    function openModal() {
        showModal = true;
    }

    function closeModal() {
        showModal = false;
    }

    function selectSkill(skill: string, stars: number) {
        whites[skill] = stars;
        searchWhites = ""; // Clear search after selection
    }

    function removeSkill(skill: string) {
        whites[skill] = 0;
    }

    function cycleStars(skill: string) {
        const current = whites[skill] || 0;
        whites[skill] = current >= 3 ? 1 : current + 1;
    }
</script>

<div>
    <button class="btn btn-outline-secondary btn-sm mb-2" onclick={openModal}>
        Select Skills ({selectedWhites.length} selected)
    </button>
    
    {#if selectedWhites.length > 0}
        <div class="d-flex flex-wrap gap-1 mt-1">
            {#each selectedWhites as { name, stars }}
                <span class="badge bg-warning text-dark d-flex align-items-center gap-1">
                    <button 
                        class="btn btn-sm p-0 border-0 bg-transparent"
                        onclick={() => cycleStars(name)}
                        title="Click to change stars"
                    >
                        {"★".repeat(stars)}{"☆".repeat(3 - stars)}
                    </button>
                    {name}
                    <button 
                        class="btn-close btn-close-sm ms-1" 
                        style="font-size: 0.6rem;"
                        onclick={() => removeSkill(name)}
                    ></button>
                </span>
            {/each}
        </div>
    {/if}
</div>

{#if showModal}
    <!-- Backdrop -->
    <div class="modal-backdrop fade show" onclick={closeModal}></div>

    <div class="modal fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Select White Sparks</h5>
                    <button
                        type="button"
                        class="btn-close"
                        onclick={closeModal}
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body">
                    <input
                        type="text"
                        class="form-control mb-3"
                        placeholder="Search sparks..."
                        bind:value={searchWhites}
                    />
                    <div style="max-height: 400px; overflow-y: auto;">
                        <div class="d-flex flex-wrap gap-2">
                            {#each filteredWhites as white}
                                {@const currentStars = whites[white] || 0}
                                <div class="btn-group">
                                    <button
                                        class="btn {currentStars > 0
                                            ? 'btn-warning'
                                            : 'btn-outline-secondary'} btn-sm"
                                        onclick={() => selectSkill(white, currentStars > 0 ? 0 : 1)}
                                    >
                                        {white}
                                    </button>
                                    {#if currentStars > 0}
                                        <button
                                            class="btn btn-warning btn-sm dropdown-toggle dropdown-toggle-split"
                                            data-bs-toggle="dropdown"
                                        ></button>
                                        <ul class="dropdown-menu">
                                            <li><button class="dropdown-item {currentStars === 1 ? 'active' : ''}" onclick={() => selectSkill(white, 1)}>★☆☆ (1+)</button></li>
                                            <li><button class="dropdown-item {currentStars === 2 ? 'active' : ''}" onclick={() => selectSkill(white, 2)}>★★☆ (2+)</button></li>
                                            <li><button class="dropdown-item {currentStars === 3 ? 'active' : ''}" onclick={() => selectSkill(white, 3)}>★★★ (3)</button></li>
                                        </ul>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        onclick={closeModal}>Close</button
                    >
                </div>
            </div>
        </div>
    </div>
{/if}
