// drag.js
function enableDragAndDrop(containerId) {
    const container = document.getElementById(containerId);
    let draggedItem = null;
    let offsetY = 0; // Desplazamiento vertical relativo al elemento arrastrado

    function handleDragStart(event) {
        draggedItem = event.target;
        event.target.classList.add('dragging');

        if (event.type === 'touchstart') {
            event.preventDefault();
            const touch = event.changedTouches[0];
            offsetY = touch.clientY - event.target.getBoundingClientRect().top; // Calcula el desplazamiento inicial
            // event.dataTransfer.setData('text', touch.target.id);
        } else {
            offsetY = event.offsetY; // Para eventos de mouse, usa offsetY directamente
        }
    }

    function handleDragEnd(event) {
        event.target.classList.remove('dragging');
        draggedItem = null;
        offsetY = 0; // Reinicia el desplazamiento
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

        // Desplazamiento automático
        const containerRect = container.getBoundingClientRect();
        const threshold = 20; // Define una zona cerca del borde para activar el desplazamiento

        if (touch.clientY - containerRect.top < threshold) {
            container.scrollTop -= 10; // Desplazarse hacia arriba
        } else if (containerRect.bottom - touch.clientY < threshold) {
            container.scrollTop += 10; // Desplazarse hacia abajo
        }

        if (target && target !== draggedItem && target.classList.contains('paragraph-box')) {
            const parent = container;
            const draggedIndex = Array.from(parent.children).indexOf(draggedItem);
            const targetIndex = Array.from(parent.children).indexOf(target);

            if (draggedIndex < targetIndex) {
                if (draggedItem.nextElementSibling !== target.nextElementSibling) {
                    parent.insertBefore(draggedItem, target.nextElementSibling);
                }
            } else {
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
        offsetY = 0; // Reinicia el desplazamiento
    }

    container.addEventListener('dragstart', handleDragStart);
    container.addEventListener('dragend', handleDragEnd);
    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('drop', handleDrop);

    container.addEventListener('touchstart', handleDragStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);
}