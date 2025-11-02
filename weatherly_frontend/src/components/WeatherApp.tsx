import { Search, Cloud, Droplets, Wind, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, FC } from "react";
import { useQuery } from "@tanstack/react-query";

interface WeatherCity {
  name: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

interface Region {
  title: string;
  color: string;
  cities: string[];
}

interface Regions {
  [key: string]: Region;
}

const WeatherApp: FC = () => {
  const [city, setCity] = useState<string>("London");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions: Regions = {
    asia: {
      title: "Asia & Pacific",
      color: "weather-accent-purple",
      cities: ["Tokyo", "Mumbai", "Beijing", "Singapore", "Seoul", "Bangkok", "Shanghai", "Hong Kong", "Jakarta"]
    },
    europe: {
      title: "Europe",
      color: "weather-accent-blue",
      cities: ["London", "Paris", "Rome", "Madrid", "Berlin", "Amsterdam", "Vienna", "Stockholm", "Prague"]
    },
    americas: {
      title: "Americas",
      color: "weather-accent-pink",
      cities: ["New York", "Los Angeles", "Toronto", "Chicago", "Miami", "Vancouver", "San Francisco", "Mexico City", "Rio de Janeiro"]
    },
    middleEastAfrica: {
      title: "Middle East & Africa",
      color: "weather-accent-orange",
      cities: ["Dubai", "Cairo", "Istanbul", "Cape Town", "Tel Aviv", "Doha", "Riyadh", "Johannesburg", "Nairobi"]
    },
    oceania: {
      title: "Oceania",
      color: "weather-accent-green",
      cities: ["Sydney", "Melbourne", "Auckland", "Wellington", "Brisbane", "Perth", "Adelaide", "Christchurch"]
    }
  };

  const { data, isFetching, refetch, error: weatherError } = useQuery({
    queryKey: ["weather-current", city],
    queryFn: async () => {
      try {
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/weather/current?city=${encodeURIComponent(city)}&units=metric`);
        if (!resp.ok) {
          const error = await resp.json();
          throw new Error(error.error?.message || "Failed to fetch weather");
        }
        return resp.json();
      } catch (error) {
        console.error("Weather fetch error:", error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 300000, // Consider data fresh for 5 minutes
  });

  const { data: otherCitiesData, isFetching: isLoadingGlobal, error: globalError } = useQuery({
    queryKey: ["weather-multiple"],
    queryFn: async () => {
      try {
        const allCities = Object.values(regions).flatMap(region => region.cities);
        const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/weather/multiple?cities=${allCities.join(",")}&units=metric`);
        if (!resp.ok) {
          const error = await resp.json();
          throw new Error(error.error?.message || "Failed to fetch weather for other cities");
        }
        return resp.json();
      } catch (error) {
        console.error("Global weather fetch error:", error);
        throw error;
      }
    },
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 300000, // Consider data fresh for 5 minutes
    retry: 1
  });

  const globalCities: WeatherCity[] = otherCitiesData?.map(city => ({
    name: city.name,
    temp: Math.round(city.main.temp),
    condition: city.weather[0].main,
    humidity: city.main.humidity,
    windSpeed: Math.round(city.wind.speed * 3.6),
    icon: city.weather[0].icon
  })) || [];

  const currentWeather = {
    city: data ? `${data.name}${data.sys?.country ? ", " + data.sys.country : ""}` : "London, UK",
    condition: data?.weather?.[0]?.description || "partly cloud",
    temperature: Math.round(data?.main?.temp ?? 28),
    feelsLike: Math.round(data?.main?.feels_like ?? 7),
    cloudCover: Math.round(data?.clouds?.all ?? 8),
    rain: Math.round((data?.rain?.["1h"] ?? 0) as number),
    humidity: Math.round(data?.main?.humidity ?? 65),
    ultraviolet: 7,
    windSpeed: Math.round((data?.wind?.speed ?? 26) * 3.6),
    date: new Date().toLocaleDateString(undefined, { weekday: "long" }),
    dayTemp: Math.round(data?.main?.temp_max ?? 12),
    windTemp: Math.round(data?.main?.temp_min ?? 16),
    icon: data?.weather?.[0]?.icon
  };

  const sidebarItems = [
    { name: "Home", path: "/", active: true },
    { name: "Blogs", path: "/blogs", active: false },
    { name: "Map", path: "/map", active: false },
    { name: "Photos", path: "/photos", active: false },
    { name: "Videos", path: "/videos", active: false },
    { name: "Phone", path: "/phone", active: false }
  ];

  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 sidebar-glass p-6 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-weather-accent-purple to-weather-accent-pink flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-weather-text-primary">Weatherly</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`block w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-primary/20 text-primary border border-primary/30 glow" 
                  : "text-weather-text-secondary hover:text-weather-text-primary hover:bg-weather-glass"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="space-y-2">
          <Link
            to="/signin"
            className="block w-full text-center px-4 py-3 rounded-lg bg-gradient-to-r from-weather-accent-purple to-weather-accent-pink text-white hover:opacity-90 transition-opacity duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="block w-full text-center px-4 py-3 rounded-lg border border-weather-glass-border text-weather-text-secondary hover:text-weather-text-primary hover:bg-weather-glass transition-colors duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Header with Search */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-weather-text-muted w-5 h-5" />
              <Input 
                placeholder="Search for city..."
                className={`pl-10 glass-card border-0 bg-weather-glass text-weather-text-primary placeholder:text-weather-text-muted ${
                  weatherError ? 'border-red-500' : ''
                }`}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && refetch()}
              />
            </div>
            {weatherError && (
              <p className="text-sm text-red-500 mt-1">
                {weatherError instanceof Error ? weatherError.message : 'Error fetching weather data'}
              </p>
            )}
          </div>
          <Button onClick={() => refetch()} disabled={isFetching} className="ml-4 glass-card bg-weather-accent-pink hover:bg-weather-accent-purple border-0 text-white">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Weather Display */}
          <div className="col-span-8">
            <div className="glass-card rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-weather-text-primary mb-2 flex items-center gap-3">
                    {currentWeather.city}
                    <img 
                      src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                      alt={currentWeather.condition}
                      className="w-12 h-12"
                    />
                  </h2>
                  <p className="text-lg text-weather-text-secondary capitalize">{currentWeather.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-weather-text-primary mb-1">{currentWeather.date}</p>
                  <div className="flex items-center gap-2 text-weather-text-secondary justify-end">
                    <Sun className="w-4 h-4" />
                    <span>UV Index: {currentWeather.ultraviolet}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-8">
                  <div className="text-7xl font-bold bg-gradient-to-r from-weather-accent-blue via-weather-accent-purple to-weather-accent-pink bg-clip-text text-transparent">
                    {currentWeather.temperature}°
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-weather-text-secondary">
                      <span>Feels like:</span>
                      <span className="text-weather-text-primary font-semibold">{currentWeather.feelsLike}°</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm px-2 py-1 rounded-full bg-weather-accent-blue/20 text-weather-accent-blue">
                        H: {currentWeather.dayTemp}°
                      </span>
                      <span className="text-sm px-2 py-1 rounded-full bg-weather-accent-pink/20 text-weather-accent-pink">
                        L: {currentWeather.windTemp}°
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2 text-weather-text-secondary">
                    <Cloud className="w-4 h-4" />
                    <span>Cloud Cover: </span>
                    <span className="text-weather-text-primary font-semibold">{currentWeather.cloudCover}%</span>
                  </div>
                  <div className="flex items-center gap-2 text-weather-text-secondary">
                    <Wind className="w-4 h-4" />
                    <span>Wind Speed: </span>
                    <span className="text-weather-text-primary font-semibold">{currentWeather.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Cards Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="weather-card rounded-xl p-6 text-center">
                <div className="text-weather-text-secondary mb-2">Feel like</div>
                <div className="text-2xl font-bold text-weather-accent-blue">
                  {currentWeather.feelsLike}°
                </div>
              </div>
              <div className="weather-card rounded-xl p-6 text-center">
                <div className="text-weather-text-secondary mb-2">Cloud</div>
                <div className="text-2xl font-bold text-weather-accent-purple">
                  {currentWeather.cloudCover}%
                </div>
              </div>
              <div className="weather-card rounded-xl p-6 text-center">
                <div className="text-weather-text-secondary mb-2">Rain</div>
                <div className="text-2xl font-bold text-weather-accent-pink">
                  {currentWeather.rain}°
                </div>
              </div>
            </div>

            {/* Additional Weather Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="weather-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Droplets className="w-5 h-5 text-weather-accent-blue" />
                  <span className="text-weather-text-secondary">Humidity</span>
                </div>
                <div className="text-2xl font-bold text-weather-accent-blue">
                  {currentWeather.humidity}%
                </div>
              </div>
              <div className="weather-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Sun className="w-5 h-5 text-weather-accent-purple" />
                  <span className="text-weather-text-secondary">Ultraviolet</span>
                </div>
                <div className="text-2xl font-bold text-weather-accent-purple">
                  {currentWeather.ultraviolet}
                </div>
              </div>
              <div className="weather-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Wind className="w-5 h-5 text-weather-accent-pink" />
                  <span className="text-weather-text-secondary">Cloudy</span>
                </div>
                <div className="text-2xl font-bold text-weather-accent-pink">
                  {currentWeather.windSpeed} km/h
                </div>
              </div>
            </div>
          </div>

          {/* Other Cities Sidebar */}
          <div className="col-span-4">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-weather-text-primary">Global Weather</h3>
                <div className="flex gap-2">
                  {Object.entries(regions).map(([key, region]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedRegion(selectedRegion === key ? null : key)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        selectedRegion === key 
                          ? `w-4 bg-${region.color}` 
                          : `bg-${region.color}/50 hover:bg-${region.color}`
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative">
                {isLoadingGlobal && (
                  <div className="absolute inset-0 flex items-center justify-center bg-weather-glass/50 backdrop-blur-sm z-10 rounded-xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-weather-accent-blue" />
                  </div>
                )}

                <div className="space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(regions)
                    .filter(([key]) => !selectedRegion || selectedRegion === key)
                    .map(([key, region]) => (
                      <div key={key}>
                        <h4 className={`text-sm font-semibold text-${region.color} mb-3 flex items-center gap-2`}>
                          <span className={`w-2 h-2 rounded-full bg-${region.color}`} />
                          {region.title}
                        </h4>
                        <div className="space-y-3">
                          {globalCities
                            .filter(city => region.cities.includes(city.name))
                            .map((city, index) => (
                            <div 
                              key={index} 
                              onClick={() => setCity(city.name)}
                              className={`glass-card p-3 rounded-xl cursor-pointer transition-all group
                                ${city.name === data?.name ? 'ring-2 ring-weather-accent-blue' : 'hover:bg-weather-glass/50'}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-weather-text-primary font-medium flex items-center gap-2">
                                  {city.name}
                                  {city.name === data?.name && (
                                    <span className="text-xs bg-weather-accent-blue/20 text-weather-accent-blue px-2 py-0.5 rounded-full">
                                      Active
                                    </span>
                                  )}
                                </span>
                                <span className="text-weather-text-primary font-semibold">{city.temp}°</span>
                              </div>
                              <div className="flex items-center justify-between text-sm text-weather-text-secondary">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={`https://openweathermap.org/img/wn/${city.icon}.png`}
                                    alt={city.condition}
                                    className="w-6 h-6"
                                  />
                                  <span className="capitalize">{city.condition.toLowerCase()}</span>
                                </div>
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex items-center gap-1">
                                    <Droplets className="w-3 h-3" />
                                    <span>{city.humidity}%</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Wind className="w-3 h-3" />
                                    <span>{city.windSpeed}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
