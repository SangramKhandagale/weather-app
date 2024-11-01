import Card from '@mui/material/Card';
import "./infoBox.css"

import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import Typography from '@mui/material/Typography';

export default function InfoBox({info}){
    const IMG="https://media.istockphoto.com/id/512218646/photo/storm-sky-rain.jpg?s=612x612&w=0&k=20&c=RoUDM9BMwqW8NkPXjzAzlDKCHPOmdZhmmeT3jGA2EaM="
const HOT="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgb0H-HdnvpSeTWRg1VeLN2qN0M5HF_FyJvQ&s"
const cold="https://thumbs.dreamstime.com/b/thermometer-snow-shows-low-temperatures-zero-low-temperatures-degrees-celsius-fahrenheit-cold-winter-weather-zero-102786329.jpg"
const rain="https://media.istockphoto.com/id/512218646/photo/storm-sky-rain.jpg?s=612x612&w=0&k=20&c=RoUDM9BMwqW8NkPXjzAzlDKCHPOmdZhmmeT3jGA2EaM="
  
    return(
        <div className="info">
            <h1>WeatherInfo-{info.weather}</h1>
            <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={
          info.humidity>80
          ? rain 
          :info.temp>15
          ? HOT
        : cold}
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        {info.city}
        </Typography>
        <Typography variant="body2" color='text.secondary' component={"span"}>
         <p> Temperature={info.temp}&deg;</p>
         <p>Humidity={info.humidity}</p>
         <p>Min Temp={info.tempMin}&deg;</p>
         <p>Max Temp={info.tempMax}&deg;</p>
         <p>The weather can be described as {info.weather} and feels like={info.feelslike}&deg;</p>
        </Typography>
      </CardContent>
     
    </Card>
        </div>
    )
}