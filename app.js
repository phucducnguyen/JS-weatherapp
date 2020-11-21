const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

window.addEventListener('DOMContentLoaded',()=>{
    //App
    const weather={};

    weather.temperature ={
        unit: "celsius"
    }

    const KELVIN = 273;
    const key = "6be1d5fada6040ff0d47bd3014ff0998"

    //check geolocation
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }else{
        notificationElement.style.display = "block";
        notificationElement.innerHTML = `<p>Browser doesn't Support Geolocation</p>`;
    }

    //user position
    function setPosition(position){
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeather(lat,lon);
    }

    function showError(error){
        notificationElement.style.display ="block";
        notificationElement.innerHTML = `<p> ${error.message} </p>`
    }

    function getWeather(lat,lon){
        let api =`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;

        fetch(api)
        .then(function(response){
            let data= response.json();
            return data;
        })
        .then(function(data){
            weather.temperature.value =Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconID = data.weather[0].icon;
            weather.city =data.name;
            weather.country = data.sys.country;
        })
        .then(function(){
            displayWeather();
        });
    }
    // Weather to UI
    function displayWeather(){
        iconElement.innerHTML = `<img src="icons/${weather.iconID}.png"/>`;
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        descElement.innerHTML = weather.description;
        locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    }

    // C to F conversion
    function CtoF(temp){
        return( temp * 9/5)+32;
    }

    //click temp
    tempElement.addEventListener("click",()=>{
        if(weather.temperature.value === undefined)return;
        if(weather.temperature.unit =="celsius"){
            let fa = CtoF(weather.temperature.value);
            fa = Math.floor(fa);

            tempElement.innerHTML = `${fa}°<span>F</span>`;
            weather.temperature.unit="fahrenheit";
        }
        else{
            tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
            weather.temperature.unit="celsius";
        }
        
    })
});