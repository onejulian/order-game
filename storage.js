const STORAGE_KEY_GAMES = 'paragraph_ordering_games';

function getSavedGames() {
    const gamesData = localStorage.getItem(STORAGE_KEY_GAMES);
    return gamesData ? JSON.parse(gamesData) : [];
}

function saveGame(gameData) {
    const savedGames = getSavedGames();
    gameData.id = gameData.id || Date.now(); // Generar un ID si no existe
    const existingGameIndex = savedGames.findIndex(game => game.id === gameData.id);

    if (existingGameIndex > -1) {
        savedGames[existingGameIndex] = gameData; // Actualizar juego existente
    } else {
        savedGames.push(gameData); // Añadir nuevo juego
    }

    localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(savedGames));
    return gameData.id; // Retornar el ID del juego guardado
}

function loadGame(gameId) {
    const savedGames = getSavedGames();
    const game = savedGames.find(game => game.id === parseInt(gameId)); // Asegúrate de comparar con números
    return game || null;
}

function deleteGame(gameId) {
    let savedGames = getSavedGames();
    savedGames = savedGames.filter(game => game.id !== parseInt(gameId));
    localStorage.setItem(STORAGE_KEY_GAMES, JSON.stringify(savedGames));
}