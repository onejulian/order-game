// game.js
function parseParagraphs(text) {
    return text.trim().split('\n\n').filter(paragraph => paragraph.trim() !== '');
}

function createParagraphBoxes(paragraphs) {
    const boxes = paragraphs.map((paragraph, index) => {
        const box = document.createElement('div');
        box.classList.add('paragraph-box');
        box.textContent = paragraph;
        box.setAttribute('draggable', true);
        box.dataset.index = index;
        return box;
    });
    return boxes;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayParagraphBoxes(boxes, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (containerId === 'paragraph-boxes-container') {
        let upButton = container.parentNode.querySelector('.up-button');
        let downButton = container.parentNode.querySelector('.down-button');
        let scrollInterval;
        let touchTimeout; // Nuevo timeout para diferenciar entre toque simple y mantener presionado

        const startScrolling = (direction) => {
            clearInterval(scrollInterval);
            scrollInterval = setInterval(() => {
                container.scrollTop += direction;
            }, 100);
        };

        const stopScrolling = () => {
            clearInterval(scrollInterval);
        };

        // Función para desplazamiento a pasos (toque simple)
        const stepScroll = (direction) => {
            container.scrollTop += direction;
        };

        if (!upButton) {
            upButton = document.createElement('button');
            upButton.textContent = '↑';
            upButton.classList.add('scroll-button', 'up-button');

            // Eventos para mouse
            upButton.addEventListener('mousedown', () => {
                touchTimeout = setTimeout(() => startScrolling(-50), 200); // Iniciar desplazamiento continuo después de 200ms
            });
            upButton.addEventListener('mouseup', () => {
                clearTimeout(touchTimeout);
                stopScrolling();
            });
            upButton.addEventListener('mouseleave', () => {
                clearTimeout(touchTimeout);
                stopScrolling();
            });
            upButton.addEventListener('click', () => stepScroll(-50)); // Desplazamiento a pasos con clic

            // Eventos para pantallas táctiles
            upButton.addEventListener('touchstart', () => {
                touchTimeout = setTimeout(() => startScrolling(-50), 200); // Iniciar desplazamiento continuo después de 200ms
            });
            upButton.addEventListener('touchend', () => {
                clearTimeout(touchTimeout);
                stopScrolling();
            });
            upButton.addEventListener('touchcancel', () => {
                clearTimeout(touchTimeout);
                stopScrolling();
            });
            upButton.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });
        }

        if (!downButton) {
            downButton = document.createElement('button');
            downButton.textContent = '↓';
            downButton.classList.add('scroll-button', 'down-button');

            // Eventos para mouse
            downButton.addEventListener('mousedown', () => {
                touchTimeout = setTimeout(() => startScrolling(50), 200); // Iniciar desplazamiento continuo después de 200ms
            });
            downButton.addEventListener('mouseup', () => {
                clearTimeout(touchTimeout);
                stopScrolling();
            });
            downButton.addEventListener('mouseleave', () => {
                clearTimeout(touchTimeout);
                stopScrolling();
            });
            downButton.addEventListener('click', () => stepScroll(50)); // Desplazamiento a pasos con clic

            // Eventos para pantallas táctiles
            downButton.addEventListener('touchstart', () => {
                touchTimeout = setTimeout(() => startScrolling(50), 200); // Iniciar desplazamiento continuo después de 200ms
            });
            downButton.addEventListener('touchend', () => {
                clearTimeout(touchTimeout);
                stopScrolling();
            });
            downButton.addEventListener('touchcancel', () => {
                clearTimeout(touchTimeout);
                stopScrolling();
            });
            downButton.addEventListener('contextmenu', (event) => {
                event.preventDefault();
            });
        }

        // Añadir botones al contenedor
        let buttonContainer = container.parentNode.querySelector('.scroll-buttons-container');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.classList.add('scroll-buttons-container');
            container.parentNode.insertBefore(buttonContainer, container);
        }

        if (!buttonContainer.contains(upButton)) {
            buttonContainer.appendChild(upButton);
        }

        if (!buttonContainer.contains(downButton)) {
            buttonContainer.appendChild(downButton);
        }
    }

    boxes.forEach(box => container.appendChild(box));
}

function checkParagraphOrder(containerId) {
    const container = document.getElementById(containerId);
    const boxes = Array.from(container.children);
    let isCorrect = true;
    boxes.forEach((box, index) => {
        if (parseInt(box.dataset.index) !== index) {
            isCorrect = false;
        }
    });
    return isCorrect;
}

function getCurrentParagraphOrder(containerId) {
    const container = document.getElementById(containerId);
    return Array.from(container.children).map(box => parseInt(box.dataset.index));
}

function reorderParagraphBoxes(containerId, order) {
    const container = document.getElementById(containerId);
    const boxes = Array.from(container.children);
    const orderedBoxes = new Array(boxes.length);

    boxes.forEach(box => {
        const originalIndex = parseInt(box.dataset.index);
        const currentPosition = Array.from(container.children).indexOf(box);
        orderedBoxes[currentPosition] = box;
    });

    container.innerHTML = '';

    order.forEach(index => {
        const boxToAppend = orderedBoxes.find(box => parseInt(box.dataset.index) === index);
        if (boxToAppend) {
            container.appendChild(boxToAppend);
        }
    });
}