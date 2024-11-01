import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "./Search.css"
import { useState } from 'react';


export default function SearchBox({updateInfo}){

    let [city,setCity]=useState("")
    let[error,seterror]=useState(false)

    const API_URL="https://api.openweathermap.org/data/2.5/weather"
    const API_KEY="4299fdb99bba3879b32a664465eb7f3d"

    let getweatherinfo=async()=>{
        try{
            let response=await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`)
      
        let jsonResponse=await response.json()
        console.log(jsonResponse)
        let result={
            city:city,
            temp: jsonResponse.main.temp,
            tempMin: jsonResponse.main.temp_min,
            tempMax: jsonResponse.main.temp_max,
            humidity: jsonResponse.main.humidity,
            feelsLike: jsonResponse.main.feels_like,
            weather : jsonResponse.weather[0].description

        }
        console.log(result)
        return result
        }catch(err){
           throw err;
        }
    }

   

let handleChange=(evt)=>{
    setCity(evt.target.value)

}

let handleSubmit=async(evt)=>{
   try{
    evt.preventDefault();
    console.log(city);
    setCity("");
   let newinfo= await getweatherinfo();
   updateInfo(newinfo)
   }catch(err){
    seterror(true)

   }
    
}
    return(
        <div className="search"> 
        <h3>Search for Weather</h3>

        <form onSubmit={handleSubmit}>
        <TextField id="city"
         label="City name" 
         variant="outlined" 
         required
         value={city}
       onChange={handleChange}
        />
         <br /><br />
        <Button variant="contained" type="submit">Send</Button>
        {error && <p>No such place exist</p> }
        </form>

        </div>
    )
}