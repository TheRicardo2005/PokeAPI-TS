const fetchData = (url) => {
    return fetch(url)
        .then(response => {
        if (!response) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
        .catch(error => {
        console.error('There was a problem with the fetch operation ', error);
        throw error;
    });
};
const Url = 'https://pokeapi.co/api/v2/pokemon';
fetchData(Url)
    .then(data => {
    console.log(data);
    //Promesas anidadas
    let pokemonPromises = data.results.map((pokemon) => fetchData(pokemon.url));
    return Promise.all(pokemonPromises);
})
    .then(pokemonDetails => {
    console.log(pokemonDetails);
})
    .catch(error => {
    console.error(`Error al obtener los datos ${error}`);
});
