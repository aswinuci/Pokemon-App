const request = require('supertest');
const { getEnglishFlavorText } = require('./index');


describe('getEnglishFlavorText', () => {
    test('It should return the English flavor text', () => {
        const pokemonSpecies = {
            flavor_text_entries: [
                { language: { name: 'en' }, flavor_text: 'English text' },
                { language: { name: 'fr' }, flavor_text: 'French text' }
            ]
        };
        const result = getEnglishFlavorText(pokemonSpecies);
        expect(result).toBe('English text');
    });

    test('It should return an empty string if English text is not available', () => {
        const pokemonSpecies = {
            flavor_text_entries: [
                { language: { name: 'fr' }, flavor_text: 'French text' }
            ]
        };
        const result = getEnglishFlavorText(pokemonSpecies);
        expect(result).toBe('');
    });
});

