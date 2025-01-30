// script.js
document.addEventListener('DOMContentLoaded', () => {
    const newGameButton = document.getElementById('new-game-button');
    const startGameButton = document.getElementById('start-game-button');
    const finishButton = document.getElementById('finish-button');
    const gameTextInput = document.getElementById('game-text-input');
    const startScreen = document.getElementById('start-screen');
    const newGameSetupScreen = document.getElementById('new-game-setup');
    const gameScreen = document.getElementById('game-screen');
    const paragraphBoxesContainer = document.getElementById('paragraph-boxes-container');
    const gameMessage = document.getElementById('game-message');
    const menuButton = document.getElementById('menu-button');
    const sidebar = document.getElementById('sidebar');
    const savedGamesList = document.getElementById('saved-games-list');
    const savedGameScreen = document.getElementById('saved-game-screen');
    const savedGameTextContainer = document.getElementById('saved-game-text-container');
    const savedGameParagraphBoxesContainer = document.getElementById('saved-game-paragraph-boxes-container');
    const reshuffleButton = document.getElementById('reshuffle-button');
    const editTextButton = document.getElementById('edit-text-button');
    const continueGameButton = document.getElementById('continue-game-button');
    const confirmationDialog = document.getElementById('confirmation-dialog');
    const confirmRestartButton = document.getElementById('confirm-restart');
    const cancelRestartButton = document.getElementById('cancel-restart');
    const backHomeButton = document.getElementById('back-home-button');

    let currentGame = null;
    let originalParagraphs = [];
    let gameStartTime = null;

    function showScreen(screenElement) {
        document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active', 'hidden'));
        document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
        screenElement.classList.remove('hidden');
        screenElement.classList.add('active');
    }

    function displayMessage(message, isSuccess = false) {
        gameMessage.textContent = message;
        gameMessage.classList.remove('hidden', 'success', 'error');
        gameMessage.classList.add(isSuccess ? 'success' : 'error');

        setTimeout(() => {
            gameMessage.classList.add('hidden');
            // console.log("Message hidden");
        }, 4000);
    }

    function clearMessage() {
        gameMessage.classList.add('hidden');
        gameMessage.textContent = '';
    }

    function loadSavedGamesList() {
        const savedGames = getSavedGames();
        savedGamesList.innerHTML = '';
        if (savedGames.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No hay partidas guardadas aún.';
            savedGamesList.appendChild(li);
        } else {
            savedGames.forEach(game => {
                const li = document.createElement('li');
                li.textContent = `Partida de ${new Date(game.startTime).toLocaleDateString()} - ${game.status}`;
                li.addEventListener('click', () => loadGameSession(game.id));
                savedGamesList.appendChild(li);
            });
        }
    }

    function toggleSidebar() {
        sidebar.classList.toggle('open');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
    }

    function showConfirmationDialog() {
        confirmationDialog.classList.add('show');
    }

    function hideConfirmationDialog() {
        confirmationDialog.classList.remove('show');
    }
    function startNewGame(text) {
        // console.log("startNewGame function called with text:", text);
        originalParagraphs = parseParagraphs(text);
        // console.log("Parsed paragraphs:", originalParagraphs);
        if (originalParagraphs.length < 2) {
            displayMessage('El texto debe tener al menos dos párrafos.', false);
            // console.log("Text has less than 2 paragraphs - aborting");
            return;
        }

        const paragraphBoxes = createParagraphBoxes(originalParagraphs);
        const shuffledBoxes = shuffleArray([...paragraphBoxes]);
        displayParagraphBoxes(shuffledBoxes, 'paragraph-boxes-container');
        enableDragAndDrop('paragraph-boxes-container');

        currentGame = {
            originalText: text,
            originalOrder: originalParagraphs.map((_, index) => index),
            shuffledOrder: shuffledBoxes.map(box => parseInt(box.dataset.index)),
            startTime: gameStartTime,
            status: 'playing',
            timeRecords: [],
            currentParagraphOrder: shuffledBoxes.map(box => parseInt(box.dataset.index))
        };
        saveGame(currentGame);
        showScreen(gameScreen);
        clearMessage();
        backHomeButton.classList.add('hidden');
        // console.log("Game started successfully!");
    }

    function finishGame() {
        const isOrderCorrect = checkParagraphOrder('paragraph-boxes-container');

        if (isOrderCorrect) {
            displayMessage('¡Felicidades, has ordenado los párrafos correctamente!', true);
            currentGame.status = 'completed';
            currentGame.currentParagraphOrder = getCurrentParagraphOrder('paragraph-boxes-container');
            saveGame(currentGame);
            backHomeButton.classList.remove('hidden');
        } else {
            displayMessage('Inténtalo de nuevo, el orden no es correcto.', false);
            backHomeButton.classList.add('hidden');
        }
    }

    function restartGame() {
        if (currentGame) {
            const paragraphBoxes = createParagraphBoxes(originalParagraphs);
            const shuffledBoxes = shuffleArray([...paragraphBoxes]);
            displayParagraphBoxes(shuffledBoxes, 'paragraph-boxes-container');
            currentGame.shuffledOrder = shuffledBoxes.map(box => parseInt(box.dataset.index));
            currentGame.status = 'playing';
            currentGame.currentParagraphOrder = shuffledBoxes.map(box => parseInt(box.dataset.index));
            saveGame(currentGame);
            clearMessage();
        }
    }

    function loadGameSession(gameId) {
        const loadedGame = loadGame(gameId);
        if (loadedGame) {
            currentGame = loadedGame;
            originalParagraphs = parseParagraphs(currentGame.originalText);
            savedGameTextContainer.textContent = currentGame.originalText;

            const paragraphBoxes = createParagraphBoxes(originalParagraphs);
            const orderedBoxes = currentGame.currentParagraphOrder.map(index => paragraphBoxes.find(box => parseInt(box.dataset.index) === index));

            displayParagraphBoxes(orderedBoxes, 'saved-game-paragraph-boxes-container');
            enableDragAndDrop('saved-game-paragraph-boxes-container');

            showScreen(savedGameScreen);
            closeSidebar();
        } else {
            alert('No se pudo cargar la partida guardada.');
        }
    }

    function reshuffleSavedGameParagraphs() {
        if (currentGame) {
            const paragraphBoxes = Array.from(savedGameParagraphBoxesContainer.children);
            const shuffledBoxes = shuffleArray(paragraphBoxes);
            displayParagraphBoxes(shuffledBoxes, 'saved-game-paragraph-boxes-container');
            currentGame.shuffledOrder = shuffledBoxes.map(box => parseInt(box.dataset.index));
            currentGame.status = 'playing';
            saveGame(currentGame);
        }
    }

    function editTextAndRestartGame() {
        if (currentGame) {
            gameTextInput.value = currentGame.originalText;
            showScreen(newGameSetupScreen);
        }
    }

    function continueSavedGame() {
        if (currentGame) {
            showScreen(gameScreen);
            const paragraphBoxes = createParagraphBoxes(originalParagraphs);
            const orderedBoxes = currentGame.currentParagraphOrder.map(index => paragraphBoxes.find(box => parseInt(box.dataset.index) === index));
            displayParagraphBoxes(orderedBoxes, 'paragraph-boxes-container');
            enableDragAndDrop('paragraph-boxes-container');

            if (currentGame.status === 'playing') {
            } else {
            }
        }
    }


    newGameButton.addEventListener('click', () => showScreen(newGameSetupScreen));

    startGameButton.addEventListener('click', () => {
        startNewGame(gameTextInput.value);
    });

    finishButton.addEventListener('click', finishGame);

    menuButton.addEventListener('click', () => {
        loadSavedGamesList();
        toggleSidebar();
    });

    document.addEventListener('click', (event) => {
        if (!sidebar.contains(event.target) && !menuButton.contains(event.target) && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    reshuffleButton.addEventListener('click', reshuffleSavedGameParagraphs);
    editTextButton.addEventListener('click', editTextAndRestartGame);
    continueGameButton.addEventListener('click', continueSavedGame);

    confirmRestartButton.addEventListener('click', () => {
        restartGame();
        hideConfirmationDialog();
    });

    cancelRestartButton.addEventListener('click', hideConfirmationDialog);

    window.addEventListener('beforeunload', (event) => {
        if (currentGame && currentGame.status === 'playing') {
          // Guardar el estado actual del juego antes de que se cierre la página
          currentGame.currentParagraphOrder = getCurrentParagraphOrder(
            "paragraph-boxes-container"
          );
          saveGame(currentGame);
          // Eliminar la restricción para evitar la confirmación de recarga
          delete event["returnValue"];
        }
      });

    showScreen(startScreen);
    loadSavedGamesList();

    backHomeButton.addEventListener('click', () => {
        showScreen(startScreen);
        // Limpiar datos del juego actual
        currentGame = null;
        originalParagraphs = [];
        paragraphBoxesContainer.innerHTML = '';
        gameMessage.textContent = '';
        gameMessage.classList.add('hidden');
        backHomeButton.classList.add('hidden');
    });
});