$(document).ready(function() {
    // Obtener la fecha y hora actual
    const now = new Date();
    const hoursToHide = 3; // Horas después de las cuales se ocultan eventos

    // Convertir la hora actual en minutos
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    // Iterar sobre cada título de sección
    $('.title-section-widget').each(function() {
        const titleText = $(this).text().trim();
        const dateMatch = titleText.match(/(\d{1,2}) de (\w+) de (\d{4})/);
        
        if (dateMatch) {
            const eventDay = parseInt(dateMatch[1], 10);
            const eventMonth = new Date(Date.parse(dateMatch[2] + " 1")).getMonth(); // Convertir el mes
            const eventYear = parseInt(dateMatch[3], 10);
            const eventDate = new Date(eventYear, eventMonth, eventDay); // Crear objeto Date para el evento

            // Verificar si la fecha del evento es hoy
            if (eventDate.toDateString() === now.toDateString()) {
                // Iterar sobre los eventos de este día
                $(this).next('ol').find('.dailyevent').each(function() {
                    const eventHour = parseInt($(this).find('.dailyhour').text().trim().split(':')[0], 10);
                    const eventMinute = parseInt($(this).find('.dailyhour').text().trim().split(':')[1], 10);
                    const eventTimeInMinutes = eventHour * 60 + eventMinute; // Convertir la hora del evento en minutos

                    // Comprobar si el evento ya ha pasado y han pasado más de 3 horas
                    if (currentTimeInMinutes > eventTimeInMinutes + hoursToHide * 60) {
                        $(this).hide(); // Ocultar el evento
                    }
                });
            }
        }
    });
});
