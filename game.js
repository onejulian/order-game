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