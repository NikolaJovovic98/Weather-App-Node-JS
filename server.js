const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require('body-parser');//3rd party npm modul za fetchovanje podataka iz forme kroz req.body
const axios = require("axios");
const { response } = require("express");
const { log } = require("console");
const port = process.env.PORT || 3000;

const app = express();
app.set("view engine","hbs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('views', path.join("public", "views")); //Moglo je i bez path.join samo public/views 

hbs.registerHelper("getCurrentYear",()=>{
    return (new Date()).getFullYear();
});
hbs.registerHelper("doesExist",(value)=>{
    return value !== undefined;
});
hbs.registerPartials(__dirname + "/public/views/components");

app.get("/",(req,res)=>{
    res.render('home.hbs',{
        projectName:"Practice Node Js!"
    });
});

app.get("/weather",(req,res)=>{
    res.render('weather.hbs');
});

app.get("/about",(req,res)=>{
    res.render('about.hbs');
});

app.post("/weather",async (req,res)=>{
    const tempObject = await fetchLocation(req.body.location);
    res.render('weather.hbs',{
      temperature:tempObject.temp,
      weather:tempObject.weather, 
      location:req.body.location
   });
});

function fetchLocation(location){
    const encodedLocation = encodeURIComponent(location);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedLocation}&units=metric&appid=a052126ea41abdeb22ddde8d7e401671`;
    return axios.get(url)
   .then(response=>{
      return {
          temp: response.data.main.temp,
          weather:response.data.weather[0].main
          }
     })
     .catch(error=>{
        console.log(error.message);
    });
}

app.listen(port,()=>{
    console.log("Server is running...");
});
