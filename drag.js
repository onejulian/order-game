// drag.js
function enableDragAndDrop(containerId) {
    const container = document.getElementById(containerId);
    let draggedItem = null;

    function handleDragStart(event) {
        draggedItem = event.target;
        event.target.classList.add('dragging');
        if (event.type === 'touchstart') {
            event.preventDefault();
            const touch = event.changedTouches[0];
            event.dataTransfer.setData('text', touch.target.id);
        }
    }

    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
        draggedItem = null;
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDrop(event) {
        event.preventDefault();
        if (
            event.target.classList.contains('paragraph-box') &&
            event.target !== draggedItem
        ) {
            const targetItem = event.target;
            const parent = container;
            const draggedIndex = Array.from(parent.children).indexOf(draggedItem);
            const targetIndex = Array.from(parent.children).indexOf(targetItem);

            if (draggedIndex < targetIndex) {
                parent.insertBefore(draggedItem, targetItem.nextElementSibling);
            } else {
                parent.insertBefore(draggedItem, targetItem);
            }
        }
    }

    function handleTouchMove(event) {
        if (!draggedItem) return;
        event.preventDefault();

        const touch = event.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);

        if (target && target !== draggedItem && target.classList.contains('paragraph-box')) {
            const parent = container;
            const draggedIndex = Array.from(parent.children).indexOf(draggedItem);
            const targetIndex = Array.from(parent.children).indexOf(target);

            if (draggedIndex < targetIndex) {
                // Comprobar si el elemento a insertar ya es el siguiente hermano
                if (draggedItem.nextElementSibling !== target.nextElementSibling) {
                    parent.insertBefore(draggedItem, target.nextElementSibling);
                }
            } else {
                // Comprobar si el elemento a insertar ya es el mismo
                if (draggedItem !== target) {
                    parent.insertBefore(draggedItem, target);
                }
            }
        }
    }

    function handleTouchEnd(event) {
        if (!draggedItem) return;
        event.preventDefault();
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }

    container.addEventListener('dragstart', handleDragStart);
    container.addEventListener('dragend', handleDragEnd);
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);

    container.addEventListener('touchstart', handleDragStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
}