const express = require('express');
require('dotenv').config();
const axios = require('axios');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", async (req, res) => {
    const MAX_POKEMON = 151;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`);
        const data = response.data.results;

        const allPokemons = await Promise.all(data.map(async pokemon => {
            const { name, url } = pokemon;
            const pokemonID = url.split("/")[6];
            const image = `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg`;

            // Fetch additional data for each Pokemon
            const pokemonDetailResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
            const pokemonDetailData = pokemonDetailResponse.data;
            return {
                "name": name,
                "url": url,
                "image": image,
                "id": pokemonID,
                "types": pokemonDetailData.types,
                "weight": pokemonDetailData.weight,
                "height": pokemonDetailData.height,
                "moves": pokemonDetailData.moves,
                "stats": pokemonDetailData.stats
            };
        }));
        res.render("main", { allPokemons });
    } catch (error) {
        // console.log(error);
        res.status(500).send("An error occurred while fetching Pokémon data.");
    }
});

app.get("/:name", async (req, res) => {
    const pokemonName = req.params.name;
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        const data = response.data;

        const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
        const speciesData = speciesResponse.data;
        const flavorText = getEnglishFlavorText(speciesData);

        const {name, stats, moves , abilities, height, weight, text } = data;
        let modifiedMoves = moves.slice(0,50)
        const imageURL =  `https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${data.id}.svg`;
        res.render("pokemon-detail", {name, stats,moves:modifiedMoves,abilities, height,weight,text : flavorText,imageURL});
    } catch (error) {
        // console.error("Error fetching Pokémon data:", error);
        res.status(500).send("An error occurred while fetching Pokémon data.");
    }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT,  (req, res) => {
    //console.log(`App is running on PORT ${PORT}`);
});



function getEnglishFlavorText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) {
        if (entry.language.name === "en")
        {
            let flavor = entry.flavor_text.replace(/\f/g, " ");
            return flavor;
        }
    }
    return "";
}

module.exports = {
    app,
    getEnglishFlavorText
}


