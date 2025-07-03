document.addEventListener('DOMContentLoaded', () => {
    loadallpoki();
});

async function loadallpoki() {
    const container = document.getElementById('pokecontainer');
    container.innerHTML = '';

    const response = await fetch('https://pokeapi.deno.dev/pokemon?limit=150');
    const data = await response.json();

    data.forEach(poki => {
        const card = document.createElement('div');
        card.className = 'bg-stone-700 text-white rounded p-4';

        card.innerHTML = `
            <img src='${poki.imageUrl}' alt='${poki.name}' class="w-40 h-40 mx-auto">
            <h2 class="font-bold capitalize text-center text-xl">${poki.name}</h2>
            <p><span class="font-bold">Description:</span><br>${poki.description}</p>
            <p><span class="font-bold">Type:</span> ${poki.types.join(', ')}</p>
        `;

        container.appendChild(card);
    });
}

const form = document.querySelector("form");
const clearbt = document.getElementById("clear");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const pokemonName = document.getElementById("pokiName").value.toLowerCase();

    try {
        const response = await fetch(`https://pokeapi.deno.dev/pokemon/${pokemonName}`);
        if (!response.ok) throw new Error("Pokemon not found");

        const data = await response.json();

        const display = document.getElementById("display");
        display.className = "bg-stone-700 text-white rounded text-center p-4 mt-4";

        display.innerHTML = `
            <img src="${data.imageUrl}" alt="${data.name}" class="w-40 h-40 mx-auto" />
            <h1 class="font-bold text-xl capitalize">${data.name}</h1>
            <p><span class="font-bold">Description:</span><br>${data.description}</p>
            <p><span class="font-bold">Type:</span> ${data.types.join(', ')}</p>
        `;
    } catch (err) {
        document.getElementById("display").innerHTML = `<p class="text-red-500 font-bold">Not found!</p>`;
    }
});

clearbt.addEventListener("click", () => {
  const display = document.getElementById("display");
  display.innerHTML = "";
  display.className = '';
});
