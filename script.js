let allPokemon = [];
let currentPage = 1;
let perPage = 9;

document.addEventListener("DOMContentLoaded", () => {
  loadTypes();
  loadPokemon();
});

async function loadPokemon() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
  const data = await res.json();
  const details = await Promise.all(data.results.map(p => fetch(p.url).then(r => r.json())));
  allPokemon = details;
  showPage();
}

function showPage() {
  const container = document.getElementById("pokeContainer");
  container.innerHTML = "";

  let start = (currentPage - 1) * perPage;
  let end = start + perPage;
  let pagePokemon = allPokemon.slice(start, end);

  pagePokemon.forEach(poke => {
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded shadow-md";

    card.innerHTML = `
      <img src="${poke.sprites.front_default}" class="mx-auto" />
      <h2 class="text-xl font-bold mt-2 capitalize">${poke.name}</h2>
      <div class="flex justify-center gap-2 mt-2">
        ${poke.types.map(t => `<span class="bg-gray-200 rounded px-2">${t.type.name}</span>`).join("")}
      </div>
      <button class="mt-4 bg-gray-700 text-white px-3 py-1 rounded" onclick="showDetails('${poke.name}')">Show More</button>
    `;

    container.appendChild(card);
  });
}

function nextPage() {
  if ((currentPage * perPage) < allPokemon.length) {
    currentPage++;
    showPage();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    showPage();
  }
}

function searchPoke() {
  const input = document.getElementById("pokeInput").value.toLowerCase();
  const filtered = allPokemon.filter(p => p.name.includes(input));
  if (filtered.length > 0) {
    allPokemon = filtered;
    currentPage = 1;
    showPage();
  }
}

async function loadTypes() {
  const res = await fetch("https://pokeapi.co/api/v2/type");
  const data = await res.json();
  const select = document.getElementById("typeFilter");

  data.results.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type.name;
    opt.text = type.name.charAt(0).toUpperCase() + type.name.slice(1);
    select.appendChild(opt);
  });
}

function filterType() {
  const selected = document.getElementById("typeFilter").value;

  if (selected === "all") {
    loadPokemon();
    return;
  }

  const filtered = allPokemon.filter(p => p.types.some(t => t.type.name === selected));
  allPokemon = filtered;
  currentPage = 1;
  showPage();
}

async function showDetails(name) {
  const modal = document.getElementById('pokeModal');
  const content = document.getElementById('modalContent');

  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
  const data = await res.json();
  const speciesData = await speciesRes.json();

  const description = speciesData.flavor_text_entries.find(entry => entry.language.name === "en");

  content.innerHTML = `
    <div class="text-center">
      <img src="${data.sprites.front_default}" alt="${data.name}" class="mx-auto" />
      <h2 class="text-3xl font-bold mt-2 capitalize">${data.name}</h2>
      <div class="flex justify-center gap-2 mt-2">
        ${data.types.map(t => `<span class="bg-gray-200 rounded px-3">${t.type.name}</span>`).join('')}
      </div>
      <p class="mt-4">${description ? description.flavor_text.replace(/\f|\n/g, ' ') : ''}</p>
    </div>

    <div class="mt-6 grid grid-cols-3 gap-2 text-center font-semibold">
      ${data.stats.map(stat => `
        <div>
          <div>${stat.stat.name.replace('-', ' ')}</div>
          <div class="text-gray-700">${stat.base_stat}</div>
        </div>
      `).join('')}
    </div>

    <div class="mt-6">
      <h3 class="font-bold text-lg">Abilities:</h3>
      <ul class="list-disc list-inside">
        ${data.abilities.map(a => `<li class="capitalize">${a.ability.name}</li>`).join('')}
      </ul>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  document.getElementById('pokeModal').classList.add('hidden');
}
