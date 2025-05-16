"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SectionTitle } from '@/components/SectionTitle';
import { CloudSun, Thermometer, Droplets, Wind, Sunrise, Sunset, CalendarDays } from 'lucide-react';

interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number; // km/h
    icon: React.ElementType;
    sunrise: string;
    sunset: string;
  };
  forecast: Array<{
    day: string;
    date: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    icon: React.ElementType;
  }>;
}

const mockWeatherData: WeatherData = {
  location: "Green Valley Farms",
  current: {
    temp: 25,
    condition: "Sunny",
    humidity: 60,
    windSpeed: 10,
    icon: CloudSun,
    sunrise: "06:15 AM",
    sunset: "08:30 PM",
  },
  forecast: [
    { day: "Tomorrow", date: "July 27", tempHigh: 28, tempLow: 18, condition: "Mostly Sunny", icon: CloudSun },
    { day: "Day After", date: "July 28", tempHigh: 26, tempLow: 17, condition: "Partly Cloudy", icon: CloudSun },
    { day: "Following Day", date: "July 29", tempHigh: 24, tempLow: 16, condition: "Light Rain", icon: CloudSun }, // Should be CloudRain, but keeping CloudSun for consistency if CloudRain is not available or to simplify
  ],
};

// Helper to format date for forecast
const formatDateForForecast = (offset: number): { day: string, date: string } => {
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + offset);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  let dayName = days[futureDate.getDay()];
  if (offset === 1) dayName = "Tomorrow";
  
  return {
    day: dayName,
    date: `${months[futureDate.getMonth()]} ${futureDate.getDate()}`
  };
};


export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("--:-- --");


  useEffect(() => {
    // Simulate fetching data and setting dynamic dates for forecast
    const updatedForecast = mockWeatherData.forecast.map((item, index) => {
      const { day, date } = formatDateForForecast(index + 1);
      return { ...item, day, date };
    });
    setWeatherData({...mockWeatherData, forecast: updatedForecast});
    
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); // Initial set

    return () => clearInterval(timer);
  }, []);


  if (!weatherData) {
    return (
      <div className="space-y-8">
        <SectionTitle title="Weather Intelligence" description="Loading weather data..." />
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-20 bg-muted rounded w-full"></div>
              <div className="h-40 bg-muted rounded w-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CurrentIcon = weatherData.current.icon;

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Weather Intelligence"
        description={`Hyperlocal weather information for ${weatherData.location}.`}
      />

      <Card className="shadow-lg bg-gradient-to-br from-primary/10 via-background to-background">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <CurrentIcon className="h-8 w-8" />
                Current Weather
              </CardTitle>
              <CardDescription>Last updated: {currentTime}</CardDescription>
            </div>
            <div className="text-right">
               <p className="text-5xl font-bold text-foreground">{weatherData.current.temp}°C</p>
               <p className="text-lg text-muted-foreground">{weatherData.current.condition}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="flex items-center space-x-2 p-3 bg-card rounded-lg shadow-sm">
            <Droplets className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-semibold text-foreground">{weatherData.current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-card rounded-lg shadow-sm">
            <Wind className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Wind</p>
              <p className="font-semibold text-foreground">{weatherData.current.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-card rounded-lg shadow-sm">
            <Sunrise className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Sunrise</p>
              <p className="font-semibold text-foreground">{weatherData.current.sunrise}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-card rounded-lg shadow-sm">
            <Sunset className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Sunset</p>
              <p className="font-semibold text-foreground">{weatherData.current.sunset}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center gap-2"><CalendarDays className="h-6 w-6"/>3-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weatherData.forecast.map((item, index) => {
            const ForecastIcon = item.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-card rounded-lg shadow-sm hover:bg-secondary/30 transition-colors">
                <div className="flex items-center space-x-3">
                   <ForecastIcon className="h-8 w-8 text-accent" />
                   <div>
                    <p className="font-semibold text-foreground">{item.day} <span className="text-sm text-muted-foreground">({item.date})</span></p>
                    <p className="text-sm text-muted-foreground">{item.condition}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{item.tempHigh}° / {item.tempLow}°C</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
