import { MapPin, Cloud, Sun, CloudRain, Snowflake, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Map = () => {
  const weatherLocations = [
    { name: "London", temp: 28, condition: "Partly Cloudy", lat: 51.5074, lng: -0.1278, icon: Cloud, color: "text-weather-accent-blue" },
    { name: "Manchester", temp: 7, condition: "Rainy", lat: 53.4808, lng: -2.2426, icon: CloudRain, color: "text-weather-accent-purple" },
    { name: "Edinburgh", temp: 19, condition: "Sunny", lat: 55.9533, lng: -3.1883, icon: Sun, color: "text-yellow-400" },
    { name: "Bristol", temp: 22, condition: "Cloudy", lat: 51.4545, lng: -2.5879, icon: Cloud, color: "text-gray-400" },
    { name: "York", temp: 20, condition: "Partly Cloudy", lat: 53.9600, lng: -1.0873, icon: Cloud, color: "text-weather-accent-blue" },
    { name: "Birmingham", temp: 15, condition: "Thunderstorm", lat: 52.4862, lng: -1.8904, icon: Zap, color: "text-weather-accent-pink" },
    { name: "Liverpool", temp: 12, condition: "Snow", lat: 53.4084, lng: -2.9916, icon: Snowflake, color: "text-blue-200" }
  ];

  const mapRegions = [
    { name: "North", cities: ["Edinburgh", "York", "Manchester", "Liverpool"], avgTemp: 14.5 },
    { name: "Central", cities: ["Birmingham"], avgTemp: 15 },
    { name: "South", cities: ["London", "Bristol"], avgTemp: 25 },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-weather-text-primary mb-4">Weather Map</h1>
          <p className="text-weather-text-secondary text-lg">
            Interactive weather map showing real-time conditions across different regions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-weather-text-primary">Live Weather Map</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="glass-card border-weather-glass-border">
                    Satellite
                  </Button>
                  <Button variant="outline" size="sm" className="glass-card border-weather-glass-border">
                    Radar
                  </Button>
                  <Button variant="outline" size="sm" className="glass-card border-weather-glass-border">
                    Temperature
                  </Button>
                </div>
              </div>

              {/* Simulated Map Area */}
              <div className="weather-card rounded-xl p-8 h-96 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"></div>
                
                {/* Map Pins */}
                <div className="relative h-full">
                  {weatherLocations.map((location, index) => {
                    const IconComponent = location.icon;
                    return (
                      <div
                        key={location.name}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                        style={{
                          left: `${20 + (index * 12)}%`,
                          top: `${30 + (index * 8)}%`
                        }}
                      >
                        <div className="weather-card rounded-lg p-3 group-hover:scale-110 transition-transform duration-200">
                          <div className="flex items-center gap-2">
                            <IconComponent className={`w-5 h-5 ${location.color}`} />
                            <div className="text-sm">
                              <div className="font-semibold text-weather-text-primary">{location.name}</div>
                              <div className="text-weather-text-secondary">{location.temp}°</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 glass-card rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-weather-text-primary mb-2">Legend</h4>
                  <div className="space-y-1 text-xs text-weather-text-secondary">
                    <div className="flex items-center gap-2">
                      <Sun className="w-3 h-3 text-yellow-400" />
                      <span>Sunny</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cloud className="w-3 h-3 text-gray-400" />
                      <span>Cloudy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-3 h-3 text-weather-accent-blue" />
                      <span>Rainy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              {mapRegions.map((region) => (
                <Card key={region.name} className="glass-card border-0 p-4">
                  <h3 className="font-semibold text-weather-text-primary mb-2">{region.name} Region</h3>
                  <div className="text-2xl font-bold temp-gradient mb-2">{region.avgTemp}°</div>
                  <div className="text-sm text-weather-text-secondary">
                    {region.cities.length} cities
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Locations */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-weather-text-primary mb-4">Weather Stations</h3>
              <div className="space-y-3">
                {weatherLocations.map((location) => {
                  const IconComponent = location.icon;
                  return (
                    <div key={location.name} className="weather-card rounded-lg p-3 hover:bg-weather-glass transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`w-5 h-5 ${location.color}`} />
                          <div>
                            <div className="font-medium text-weather-text-primary">{location.name}</div>
                            <div className="text-sm text-weather-text-muted">{location.condition}</div>
                          </div>
                        </div>
                        <div className="text-lg font-semibold text-weather-text-primary">
                          {location.temp}°
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Map Controls */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-weather-text-primary mb-4">Map Layers</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-weather-text-secondary">Temperature</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-weather-text-secondary">Precipitation</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-weather-text-secondary">Wind Speed</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-weather-text-secondary">Pressure</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;