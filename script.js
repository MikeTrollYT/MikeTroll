// Cierra el popup cuando se hace clic en el botón de cierre
document.getElementById('popupCloseButton').addEventListener('click', function () {
    document.getElementById('newProjectPopup').style.display = 'none';
});

// Cierra el popup cuando se hace clic en "Ver Proyecto"
document.getElementById('viewProjectButton').addEventListener('click', function () {
    document.getElementById('newProjectPopup').style.display = 'none';
});
