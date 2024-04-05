import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import icons from './assets/download.png'
import { unstable_renderSubtreeIntoContainer } from 'react-dom'

function App() {
  const [weatherData, setWeatherData] = useState({
    name: 'City Name',
    sys: { country: 'Country Code' },
    main: { temp: 0, feels_like: 0 },
    dt: 0,
    wind: { speed: 0 },
    clouds: { all: 0 }

  });
  const [city, setCity] = useState('karachi')
  const api_key = '62311769b147fe4784452618e896aced'
  const [forecast, setForecast] = useState([])
  const [forecastDetails, setForecastDetails] = useState(null)




  const getWeather = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`
    ).then((res) => res.json())
      .then((data) => {
        setWeatherData(data)
        console.log(data)
      }).catch(err => {
        console.log(err)
      })
  }

  const getforecast = () => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}`
    ).then((res) => res.json())
      .then((data) => {
        setForecast(data.list)
        console.log(data.list)
      }).catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`
    ).then((res) => res.json())
      .then((data) => {
        setWeatherData(data)
        console.log(data)
      }).catch(err => {
        console.log(err)
      })
  }, [])

  const handleSearch = () => {
    getWeather(city)
    getforecast(city)
  }

  const handleToggle = (index) => {
    setForecastDetails((prevIndex) => (prevIndex === index ? null : index))
  }

  const formatUnixTimestamp = (timestamp) => {


    if (!timestamp || isNaN(timestamp)) {
      return { time: 'N/A', date: 'N/A' };
    }
    
    const date = new Date(timestamp * 1000);
    const dates = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const times = { hour: '2-digit', minute: '2-digit' }
    const formatedTime = date.toLocaleTimeString('en-US', times);
    const formetedDate = date.toLocaleDateString('en-US', dates)
    return { time: formatedTime, Date: formetedDate }
  };



  const formatTime = (dt_txt) => {
    const date = new Date(dt_txt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formattedHours = hours % 12 || 12; 
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <>
      <div className="main">

        <div className="navbar">
          <h3>Weather App</h3>
          <div>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder='Enter city'/>
            <button className='srbtn' onClick={handleSearch}>Search</button>
          </div>
        </div>


        <div className="firstcontainer">

          <div className="inner-container">
            <div className='currentCondition'>
              {weatherData ? (
                <h1>{weatherData.name + ',' + weatherData.sys.country}</h1>
              ) : (
                <p>Loading...</p>
              )}
              <div className='temp'>
                <div className="icon">
                  {weatherData.weather && weatherData.weather.length > 0 ? (
                    weatherData.weather.map((weatherItem) => (
                      <div key={weatherItem.id}>
                        <img
                          src={`http://openweathermap.org/img/w/${weatherItem.icon}.png`}
                          alt={weatherItem.description}
                          className='image'
                          height='200px'
                          width='200px'
                          color='white'
                        />
                        <p>{weatherItem.main}</p>

                      </div>
                    ))
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
                <div className='temperature'>
                  {weatherData ? (
                    `${(weatherData.main.temp - 273.15).toFixed(1)}°C`
                  ) : (
                    <p>Loading...</p>
                  )}

                </div>

              </div>
              <div className='date'>
                <div>
                  <p>Date: {formatUnixTimestamp(weatherData.dt).Date}</p>
                  <p>Time: {formatUnixTimestamp(weatherData.dt).time}</p>
                </div>
                <div className='feel'>
                  <p>Feel: {`${(weatherData.main.feels_like - 273.15).toFixed(1)}°C`}</p>

                </div>

              </div>
            </div>
            <div className='others'>
              <div className='other'>
                <div>
                  <p className='info-head'>Weather Info</p>
                  <ul>
                    <li>Min. Temp:<span className='info'>{`${(weatherData.main.temp_min - 273.15).toFixed(1)}°C`}</span></li>
                    <li>Max. Temp:<span className='info'>{`${(weatherData.main.temp_max - 273.15).toFixed(1)}°C`}</span></li>
                    <li>Humidity: <span className='info'>{weatherData.main.humidity}%</span> </li>
                    <li>Sunrise:<span className='info' >{formatUnixTimestamp(weatherData.sys.sunrise).time}</span> </li>
                    <li>Sunset:<span className='info' >{formatUnixTimestamp(weatherData.sys.sunset).time}</span> </li>
                    <li>Wind:<span className='info'>{(weatherData.wind.speed * 3.6).toFixed(1)}Km/h</span></li>
                    <li>Clouds:<span className='info'>{weatherData.clouds.all}%</span> </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='forecast'>
              <div className='forecast-container'>
                <div>
                  <p>Forecast</p>
                </div>

                {
                  forecast.map((forecastItem, index) => {
                    const forecastDate = new Date(forecastItem.dt_txt);

                    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                    const dayName = dayNames[forecastDate.getDay()];
                    const IsdetailcontainerOpen = index === forecastDetails
                    return (

                      <div key={index}>
                        <div className='forecast_data'>
                          <span className='day'>
                            <p style={{ textAlign: 'left' }}>{dayName}</p>
                            <p>{formatTime(forecastItem.dt_txt)}</p>
                          </span>
                          <span className="image">
                            {forecastItem.weather && forecastItem.weather.length > 0 ? (
                              forecastItem.weather.map((weatherItem) => (
                                <div key={weatherItem.id}>
                                  <img
                                    src={`http://openweathermap.org/img/w/${weatherItem.icon}.png`}
                                    alt={weatherItem.description}
                                    className='image'
                                    height='30'
                                    width='30'
                                    color='white'
                                  />
                                  <p style={{fontSize:'12pt', marginTop:'-10px'}}>{weatherItem.main}</p>

                                </div>
                              ))
                            ) : (
                              <p>Loading...</p>
                            )}
                          </span>
                          <span className='forecast_temp'>
                            <p>
                              {`${(forecastItem.main.temp - 273.15).toFixed(1)}°C`}
                            </p>
                          </span>
                          <span >
                            <p className='btn' onClick={() => handleToggle(index)}>  {IsdetailcontainerOpen ? <span>&#9650;</span> : <span>&#9660;</span>}</p>
                          </span>

                        </div>
                        {
                          IsdetailcontainerOpen && (
                            <div className="forecast-info">
                              <ul>
                                <li>Min. Temp:<span className='info'>{`${(forecastItem.main.temp_min - 273.15).toFixed(1)}°C`}</span></li>
                                <li>Max. Temp:<span className='info'>{`${(forecastItem.main.temp_max - 273.15).toFixed(1)}°C`}</span></li>
                                <li>Humidity: <span className='info'>{forecastItem.main.humidity}%</span> </li>
                                <li>Sunrise:<span className='info' >{formatUnixTimestamp(forecastItem.sys.sunrise).time}</span> </li>
                                <li>Sunset:<span className='info' >{formatUnixTimestamp(forecastItem.sys.sunset).time}</span> </li>
                                <li>Wind:<span className='info'>{(forecastItem.wind.speed * 3.6).toFixed(1)}Km/h</span></li>
                                <li>Clouds:<span className='info'>{forecastItem.clouds.all}%</span> </li>
                              </ul>
                            </div>
                          )
                        }
                      </div>

                    )
                  })
                }



              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default App
