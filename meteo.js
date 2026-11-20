fetch("conf.json")
    .then(response => response.json())
    .then(data => {
        console.log(data);

        fetch("https://geocoding-api.open-meteo.com/v1/search?name="
        + data.ville
        + "&count=1&language=fr&format=json")
        .then(response => response.json())
        .then(geo => {
            console.log(geo);
            const latitude = geo.results[0].latitude;
            const longitude = geo.results[0].longitude;
            console.log(latitude);
            console.log(longitude);

            fetch("https://api.open-meteo.com/v1/forecast?latitude="
                + latitude
                + "&longitude="
                + longitude
                + "&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe/Paris")
                .then(response => response.json())
                .then(weather => {
                    console.log(weather);
                });
        });
    });