$(document).ready(function() {
    // Obtener la fecha y hora actual
    const now = new Date();
    const hoursToHide = 3; // Horas después de las cuales se ocultan eventos

    // Convertir la hora actual en minutos
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    // Mapeo de meses en español a inglés
    const monthMap = {
        "Enero": "January",
        "Febrero": "February",
        "Marzo": "March",
        "Abril": "April",
        "Mayo": "May",
        "Junio": "June",
        "Julio": "July",
        "Agosto": "August",
        "Septiembre": "September",
        "Octubre": "October",
        "Noviembre": "November",
        "Diciembre": "December"
    };

    // Iterar sobre cada título de sección
    $('.title-section-widget').each(function() {
        const titleText = $(this).text().trim();
        const dateMatch = titleText.match(/(\d{1,2}) de (\w+) de (\d{4})/);

        if (dateMatch) {
            const eventDay = parseInt(dateMatch[1], 10);
            const monthName = dateMatch[2];
            const englishMonth = monthMap[monthName] || monthName; // Convertir al nombre en inglés si es necesario
            const eventMonth = new Date(Date.parse(englishMonth + " 1")).getMonth();
            const eventYear = parseInt(dateMatch[3], 10);
            const eventDate = new Date(eventYear, eventMonth, eventDay); // Crear objeto Date para el evento

            // Verificar si la fecha del evento es anterior a hoy
            if (eventDate < now.setHours(0, 0, 0, 0)) {
                $(this).hide(); // Ocultar el encabezado del día anterior
                $(this).next('ol').find('.dailyevent').hide(); // Ocultar todos los eventos del día anterior
            } else if (eventDate.toDateString() === now.toDateString()) {
                // Iterar sobre los eventos del día de hoy
                let allEventsHidden = true;
                $(this).next('ol').find('.dailyevent').each(function() {
                    const eventHour = parseInt($(this).find('.dailyhour').text().trim().split(':')[0], 10);
                    const eventMinute = parseInt($(this).find('.dailyhour').text().trim().split(':')[1], 10);
                    const eventTimeInMinutes = eventHour * 60 + eventMinute; // Convertir la hora del evento en minutos

                    // Comprobar si el evento ya ha pasado y han pasado más de 3 horas
                    if (currentTimeInMinutes > eventTimeInMinutes + hoursToHide * 60) {
                        $(this).hide(); // Ocultar el evento
                    } else {
                        allEventsHidden = false; // Hay al menos un evento visible, no ocultar el encabezado
                    }
                });

                // Si todos los eventos del día de hoy están ocultos, también ocultar el encabezado
                if (allEventsHidden) {
                    $(this).hide(); // Ocultar el encabezado del día actual si todos los eventos están ocultos
                }
            }
        }
    });
});
