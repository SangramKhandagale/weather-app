import { useState } from "react"
import "./App.css"
import SearchBox from "./Search"
import InfoBox from "./infoBox"


function App() {

  const [weatherInfo,setWeatherInfo]=useState({
    city:"Mumbai",
    feelslike:23,
    temp:25,
    tempMin:25,
    tempMax:35,
    humidity:47,
    weather:"haze"
});

let updateInfo=(newinfo)=>{
  setWeatherInfo(newinfo)
}



 return(
  <div>
<SearchBox updateInfo={updateInfo}></SearchBox>
<InfoBox info={weatherInfo}></InfoBox>

  </div>
 )
}

export default App
