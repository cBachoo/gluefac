<script lang="ts">
  import type { CharaData } from "../types";
  import Chara from "../components/Chara.svelte";
  import { stateStorage } from "../localstorage.svelte";
  import { charaCardsData, factorsData, skillsData } from "../data";

  interface Props {
    trainedCharas: CharaData[];
  }
  const { trainedCharas }: Props = $props();

  const display = stateStorage("display", { stats: true, factors: true });
  function onDisplayClick(event: Event, key: string) {
    event.preventDefault();
    display.value[key] = !display.value[key];
  }

  let search = $state("");
  let searchChangedTimeout = 0;
  function onInputSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value || "";
    clearTimeout(searchChangedTimeout);
    searchChangedTimeout = setTimeout(() => (search = value), 500);
  }

  const trainedCharasFiltered = $derived(
    trainedCharas.filter((chara) => {
      let isDisplayed = true;
      if (search) {
        const card = charaCardsData[chara.card_id];
        const _search = search.toLocaleLowerCase();
        let isSearched = card?.name.toLocaleLowerCase().includes(_search);
        if (!isSearched && display.value.stats) {
          for (const skillData of chara.skill_array) {
            const skill = skillsData[skillData.skill_id];
            if (skill?.name.toLocaleLowerCase().includes(_search)) {
              isSearched = true;
              break;
            }
          }
        }
        if (!isSearched && display.value.factors) {
          for (const factorId of chara.factor_id_array) {
            const factor = factorsData[factorId];
            if (factor?.name.toLocaleLowerCase().includes(_search)) {
              isSearched = true;
              break;
            }
          }
        }
        isDisplayed = isDisplayed && isSearched;
      }
      return isDisplayed;
    }),
  );
</script>

<div>
  <nav class="navbar sticky-top navbar-expand bg-body-tertiary gap-2">
    <div class="container-fluid"></div>
    <div class="dropdown">
      <button
        class="btn dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        Display
      </button>
      <ul class="dropdown-menu">
        <li>
          <button
            class="dropdown-item"
            onclickcapture={(e) => onDisplayClick(e, "stats")}
          >
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="displayStats"
                bind:checked={display.value.stats}
              />
              <label class="form-check-label" for="displayStats">Stats</label>
            </div>
          </button>
        </li>
        <li>
          <button
            class="dropdown-item"
            onclickcapture={(e) => onDisplayClick(e, "factors")}
          >
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                id="displaySparks"
                bind:checked={display.value.factors}
              />
              <label class="form-check-label" for="displaySparks">Sparks</label>
            </div>
          </button>
        </li>
      </ul>
    </div>

    <form class="d-flex" role="search">
      <input
        class="form-control me-2"
        type="search"
        placeholder="Filter"
        aria-label="Filter"
        oninput={onInputSearch}
        value={search}
      />
    </form>
  </nav>

  <div class="row row-cols-1 row-cols-lg-2 g-5 py-4">
    {#each trainedCharasFiltered as chara (chara.chara_seed)}
      <div class="col">
        <Chara charaData={chara} display={display.value}></Chara>
      </div>
    {/each}
  </div>
</div>

<style>
  .skill-icon {
    object-fit: cover;
    border: 1px solid #dee2e6;
  }

  .skill-icon:hover {
    transform: scale(1.1);
    transition: transform 0.2s;
  }
</style>
