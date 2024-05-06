const main = document.querySelector("#main");
const loading = document.querySelector('#loading');
const typeClassMapping = {
    "normal": "bg-gray-300 text-black",
    "fire": "bg-red-500 text-white",
    "water": "bg-blue-500 text-white",
    "electric": "bg-yellow-400 text-black",
    "grass": "bg-green-500 text-white",
    "ice": "bg-blue-200 text-black",
    "fighting": "bg-red-700 text-white",
    "poison": "bg-purple-500 text-white",
    "ground": "bg-yellow-800 text-white",
    "flying": "bg-blue-300 text-black",
    "psychic": "bg-purple-300 text-black",
    "bug": "bg-green-600 text-white",
    "rock": "bg-gray-600 text-white",
    "ghost": "bg-indigo-600 text-white",
    "dragon": "bg-blue-800 text-white",
    "dark": "bg-black text-white",
    "steel": "bg-gray-400 text-black",
    "fairy": "bg-pink-300 text-black"
};
// Función para obtener la clase CSS correspondiente a un tipo de Pokémon
function getTypeClass(type) {
    // Si el tipo tiene una clase CSS asociada, devolverla, de lo contrario, devolver una clase por defecto
    return typeClassMapping[type] || "bg-gray-300 text-black";
}
const backGroundType = {
    "normal": "bg-gray-300",
    "fire": "bg-orange-300",
    "water": "bg-blue-300",
    "electric": "bg-yellow-300",
    "grass": "bg-green-300",
    "ice": "bg-blue-200",
    "fighting": "bg-red-400",
    "poison": "bg-purple-300",
    "ground": "bg-yellow-500",
    "flying": "bg-blue-300",
    "psychic": "bg-purple-200",
    "bug": "bg-lime-200",
    "rock": "bg-gray-600",
    "ghost": "bg-violet-600",
    "dragon": "bg-indigo-500",
    "dark": "bg-neutral-700",
    "steel": "bg-gray-400",
    "fairy": "bg-pink-300"
};
function addBgColor(type) {
    return backGroundType[type] || "bg-gray-300 text-black";
}
const typeTranslations = {
    "normal": "Normal",
    "fire": "Fuego",
    "water": "Agua",
    "electric": "Eléctrico",
    "grass": "Planta",
    "ice": "Hielo",
    "fighting": "Lucha",
    "poison": "Veneno",
    "ground": "Tierra",
    "flying": "Volador",
    "psychic": "Psíquico",
    "bug": "Bicho",
    "rock": "Roca",
    "ghost": "Fantasma",
    "dragon": "Dragón",
    "dark": "Siniestro",
    "steel": "Acero",
    "fairy": "Hada"
};
function translateType(type) {
    // Si el tipo tiene una traducción, devolver el nombre traducido, de lo contrario, devolver el tipo original
    return typeTranslations[type] || type;
}
const fetchData = (url) => {
    return fetch(url)
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .catch(error => {
        console.error('There was a problem with the fetch operation ', error);
        throw error;
    });
};
let countPagination = 1;
const baseUrl = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=none`;
fetchData(baseUrl)
    .then((data) => {
    console.log('Pokemons obtenidos:', data.results);
    // Obtener todas las promesas de detalles de Pokémon de una sola vez
    const pokemonDetailPromises = data.results.map((pokemon) => fetchData(pokemon.url));
    return Promise.all(pokemonDetailPromises);
})
    .then((pokemonDetails) => {
    console.log({ pokemonDetails });
    const processedPokemonDetails = pokemonDetails.map((pokemonDetail) => {
        // Verificar si existe la propiedad "other" en los sprites
        let sprite = pokemonDetail.sprites.front_default;
        if (pokemonDetail.sprites.other && pokemonDetail.sprites.other['official-artwork']) {
            sprite = pokemonDetail.sprites.other['official-artwork'].front_default;
        }
        const types = pokemonDetail.types.map((typeObj) => typeObj.type.name);
        return {
            name: pokemonDetail.name,
            sprite: sprite,
            types: types
        };
    });
    // Renderizar los detalles de los Pokémon
    processedPokemonDetails.forEach((pokemon) => {
        main.innerHTML += `
                <div class="max-w-sm rounded-md overflow-hidden shadow-lg relative bg-white">
                    <div class="absolute w-24 md:w-32 lg:w-44 h-24 md:h-32 lg:h-48 ${addBgColor(pokemon.types[0])} blur-md rounded-full inset-x-10 inset-y-10 z-10"></div>
                    <img class="w-full z-20 relative hover:scale-105" src="${pokemon.sprite}" alt="${pokemon.name}">
                    <h3 class="text-center text-lg">${pokemon.name}</h3>
                    <div class="flex justify-around my-3 font-semibold text-white">
                        ${pokemon.types.map((type) => `<div class="rounded-md p-2 ${getTypeClass(type)}">${translateType(type)}</div>`).join('')}
                    </div>
                </div>`;
    });
})
    .catch((error) => {
    console.error(`Error al obtener los datos: ${error}`);
});
//Pagination
function backPage() {
    if (countPagination > 1) {
        countPagination = countPagination - 1;
        fetchData(`https://pokeapi.co/api/v2/pokemon?offset=${(countPagination - 1) * 20}&limit=20`)
            .then((data) => {
            console.log('Pokemons obtenidos:', data.results);
            main.innerHTML = ""; // Limpiar el contenido anterior
            renderPokemon(data.results);
        })
            .catch((error) => {
            console.error(`Error al obtener los datos: ${error}`);
        });
    }
}
function nextPage() {
    countPagination = countPagination + 1;
    fetchData(`https://pokeapi.co/api/v2/pokemon?offset=${(countPagination - 1) * 20}&limit=20`)
        .then((data) => {
        console.log('Pokemons obtenidos:', data.results);
        main.innerHTML = ""; // Limpiar el contenido anterior
        renderPokemon(data.results);
    })
        .catch((error) => {
        console.error(`Error al obtener los datos: ${error}`);
    });
}
function renderPokemon(results) {
    const pokemonDetailPromises = results.map((pokemon) => fetchData(pokemon.url));
    Promise.all(pokemonDetailPromises)
        .then((pokemonDetails) => {
        const processedPokemonDetails = pokemonDetails.map((pokemonDetail) => {
            let sprite = pokemonDetail.sprites.front_default;
            if (pokemonDetail.sprites.other && pokemonDetail.sprites.other['official-artwork']) {
                sprite = pokemonDetail.sprites.other['official-artwork'].front_default;
            }
            const types = pokemonDetail.types.map((typeObj) => typeObj.type.name);
            return {
                name: pokemonDetail.name,
                sprite: sprite,
                types: types
            };
        });
        processedPokemonDetails.forEach((pokemon) => {
            main.innerHTML += `
                <div class="max-w-sm rounded-md overflow-hidden shadow-lg relative bg-white">
                    <div class="absolute w-24 md:w-32 lg:w-44 h-24 md:h-32 lg:h-48 ${addBgColor(pokemon.types[0])} blur-md rounded-full inset-x-10 inset-y-10 z-10"></div>
                    <img class="w-full z-20 relative hover:scale-105" src="${pokemon.sprite}" alt="${pokemon.name}">
                    <h3 class="text-center text-lg">${pokemon.name}</h3>
                    <div class="flex justify-around my-3 font-semibold text-white">
                        ${pokemon.types.map((type) => `<div class="rounded-md p-2 ${getTypeClass(type)}">${translateType(type)}</div>`).join('')}
                    </div>
                </div>`;
        });
    })
        .catch((error) => {
        console.error(`Error al obtener los datos: ${error}`);
    });
}
// Inicializar la página
fetchData(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=20`)
    .then((data) => {
    console.log('Pokemons obtenidos:', data.results);
    renderPokemon(data.results);
})
    .catch((error) => {
    console.error(`Error al obtener los datos: ${error}`);
});
