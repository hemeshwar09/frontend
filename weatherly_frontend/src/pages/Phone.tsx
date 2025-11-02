import { Phone as PhoneIcon, MessageSquare, Bell, Download, Star, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Phone = () => {
  const weatherAlerts = [
    {
      id: 1,
      type: "Storm Warning",
      message: "Severe thunderstorm expected in your area. Take shelter immediately.",
      severity: "high",
      time: "2 minutes ago",
      location: "London, UK"
    },
    {
      id: 2,
      type: "Temperature Alert",
      message: "Temperature dropping to 2°C tonight. Protect outdoor plants.",
      severity: "medium",
      time: "15 minutes ago",
      location: "Manchester, UK"
    },
    {
      id: 3,
      type: "Rain Forecast",
      message: "Heavy rain expected starting 3 PM. Carry an umbrella.",
      severity: "low",
      time: "1 hour ago",
      location: "Bristol, UK"
    }
  ];

  const appFeatures = [
    {
      icon: Bell,
      title: "Weather Alerts",
      description: "Get instant notifications for severe weather conditions in your area"
    },
    {
      icon: MessageSquare,
      title: "SMS Updates",
      description: "Receive text message updates for important weather changes"
    },
    {
      icon: PhoneIcon,
      title: "Voice Forecast",
      description: "Call our automated system for detailed weather forecasts"
    },
    {
      icon: Download,
      title: "Offline Access",
      description: "Download weather data for offline viewing when connectivity is poor"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'low': return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      default: return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-weather-text-primary mb-4">Mobile Weather</h1>
          <p className="text-weather-text-secondary text-lg">
            Stay connected with weather updates on your mobile device, anytime, anywhere.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mobile App Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* App Download */}
            <div className="glass-card rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-weather-text-primary mb-4">
                    Download Weatherly App
                  </h2>
                  <p className="text-weather-text-secondary mb-6 text-lg leading-relaxed">
                    Get the full Weatherly experience on your mobile device. Real-time weather data, 
                    push notifications, and offline access all in one beautiful app.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <Button className="bg-gradient-to-r from-weather-accent-purple to-weather-accent-pink border-0 text-white hover:opacity-90">
                      <Download className="w-4 h-4 mr-2" />
                      Download for iOS
                    </Button>
                    <Button variant="outline" className="glass-card border-weather-glass-border">
                      <Download className="w-4 h-4 mr-2" />
                      Download for Android
                    </Button>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-weather-text-muted">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>4.8 Rating</span>
                    </div>
                    <div>1M+ Downloads</div>
                    <div>Free</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-56 bg-gradient-to-br from-weather-accent-purple to-weather-accent-pink rounded-3xl mx-auto flex items-center justify-center relative">
                    <Smartphone className="w-16 h-16 text-white" />
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* App Features */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-weather-text-primary mb-6">Mobile Features</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {appFeatures.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="weather-card rounded-xl p-6">
                      <IconComponent className="w-8 h-8 text-weather-accent-purple mb-4" />
                      <h4 className="text-lg font-semibold text-weather-text-primary mb-2">
                        {feature.title}
                      </h4>
                      <p className="text-weather-text-secondary">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SMS Service */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-semibold text-weather-text-primary mb-6">SMS Weather Service</h3>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-weather-text-secondary mb-6">
                    Get weather updates sent directly to your phone via SMS. Perfect for when you need 
                    quick updates without internet access.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-weather-accent-blue rounded-full"></div>
                      <span className="text-weather-text-secondary">Text "WEATHER" to 12345 for current conditions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-weather-accent-purple rounded-full"></div>
                      <span className="text-weather-text-secondary">Text "FORECAST" to 12345 for 5-day outlook</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-weather-accent-pink rounded-full"></div>
                      <span className="text-weather-text-secondary">Text "ALERTS ON" to 12345 to enable notifications</span>
                    </div>
                  </div>

                  <Button variant="outline" className="glass-card border-weather-glass-border">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
                
                <div className="weather-card rounded-xl p-6 bg-gradient-to-br from-weather-glass to-weather-card">
                  <div className="space-y-4">
                    <div className="text-sm text-weather-text-muted text-right">12345</div>
                    <div className="bg-weather-accent-purple/20 rounded-lg p-3 text-sm text-weather-text-primary">
                      Weather Update: London, UK<br/>
                      Temperature: 28°C<br/>
                      Condition: Partly Cloudy<br/>
                      Rain: 2% chance
                    </div>
                    <div className="text-xs text-weather-text-muted text-right">Sent 5 min ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Sidebar */}
          <div className="space-y-6">
            {/* Live Alerts */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5 text-weather-accent-purple" />
                <h3 className="text-xl font-semibold text-weather-text-primary">Live Alerts</h3>
              </div>
              
              <div className="space-y-4">
                {weatherAlerts.map((alert) => (
                  <div key={alert.id} className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{alert.type}</h4>
                      <span className="text-xs opacity-75">{alert.time}</span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="text-xs opacity-75">{alert.location}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-weather-text-primary mb-4">Need Help?</h3>
              <p className="text-weather-text-secondary mb-6 text-sm">
                Having trouble with the mobile app or SMS service? Our support team is here to help.
              </p>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full glass-card border-weather-glass-border justify-start">
                  <PhoneIcon className="w-4 h-4 mr-2" />
                  Call Support: 1-800-WEATHER
                </Button>
                <Button variant="outline" className="w-full glass-card border-weather-glass-border justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Live Chat Support
                </Button>
              </div>
            </div>

            {/* App Stats */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-weather-text-primary mb-4">App Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-weather-text-secondary">Active Users</span>
                  <span className="text-weather-text-primary font-semibold">2.4M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-weather-text-secondary">Daily Forecasts</span>
                  <span className="text-weather-text-primary font-semibold">850K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-weather-text-secondary">Alerts Sent</span>
                  <span className="text-weather-text-primary font-semibold">125K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-weather-text-secondary">App Rating</span>
                  <span className="text-weather-text-primary font-semibold">4.8/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phone;