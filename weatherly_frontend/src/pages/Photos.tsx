import { Download, Heart, Share2, Camera, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Photos = () => {
  const weatherPhotos = [
    {
      id: 1,
      title: "Lightning Storm over London",
      location: "London, UK",
      date: "December 14, 2024",
      photographer: "Alex Thompson",
      category: "Storm",
      likes: 234,
      downloads: 45,
      description: "Spectacular lightning display captured during last night's thunderstorm",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      title: "Morning Mist in Scottish Highlands",
      location: "Edinburgh, Scotland",
      date: "December 13, 2024",
      photographer: "Sarah McKenzie",
      category: "Fog",
      likes: 189,
      downloads: 67,
      description: "Beautiful morning fog rolling through the highland valleys",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Rainbow After Rain",
      location: "Bristol, UK",
      date: "December 12, 2024",
      photographer: "James Wilson",
      category: "Rainbow",
      likes: 312,
      downloads: 89,
      description: "Perfect double rainbow formation after afternoon shower",
      color: "from-yellow-500 to-green-500"
    },
    {
      id: 4,
      title: "Sunset Through Storm Clouds",
      location: "Manchester, UK",
      date: "December 11, 2024",
      photographer: "Emma Rodriguez",
      category: "Sunset",
      likes: 156,
      downloads: 34,
      description: "Golden hour breaking through dramatic storm clouds",
      color: "from-orange-500 to-red-500"
    },
    {
      id: 5,
      title: "Snow-covered Countryside",
      location: "York, UK",
      date: "December 10, 2024",
      photographer: "Michael Chen",
      category: "Snow",
      likes: 278,
      downloads: 56,
      description: "Peaceful winter landscape after fresh snowfall",
      color: "from-blue-400 to-white"
    },
    {
      id: 6,
      title: "Dramatic Cloud Formation",
      location: "Birmingham, UK",
      date: "December 9, 2024",
      photographer: "Lisa Parker",
      category: "Clouds",
      likes: 198,
      downloads: 42,
      description: "Mammatus clouds creating stunning patterns in the sky",
      color: "from-gray-500 to-slate-600"
    }
  ];

  const categories = ["All", "Storm", "Fog", "Rainbow", "Sunset", "Snow", "Clouds"];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-weather-text-primary mb-4">Weather Photography</h1>
          <p className="text-weather-text-secondary text-lg">
            Stunning weather phenomena captured by our community of photographers.
          </p>
        </div>

        {/* Category Filter */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={category === "All" ? 
                  "bg-gradient-to-r from-weather-accent-purple to-weather-accent-pink border-0 text-white" :
                  "glass-card border-weather-glass-border hover:bg-weather-glass"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Photo Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherPhotos.map((photo) => (
            <Card key={photo.id} className="glass-card border-0 overflow-hidden group hover:scale-105 transition-all duration-300">
              {/* Photo Placeholder */}
              <div className={`h-48 bg-gradient-to-br ${photo.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white/80" />
                </div>
                
                {/* Photo Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" className="glass-card border-0 text-white hover:bg-white/20">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="glass-card border-0 text-white hover:bg-white/20">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {photo.category}
                  </span>
                </div>
              </div>

              {/* Photo Info */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-weather-text-primary mb-2">
                  {photo.title}
                </h3>
                
                <p className="text-weather-text-secondary mb-4 line-clamp-2">
                  {photo.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-weather-text-muted">
                    <MapPin className="w-4 h-4" />
                    <span>{photo.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-weather-text-muted">
                    <Calendar className="w-4 h-4" />
                    <span>{photo.date}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-weather-text-muted">
                    <Camera className="w-4 h-4" />
                    <span>by {photo.photographer}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-weather-glass-border mt-4">
                  <div className="flex items-center gap-4 text-sm text-weather-text-muted">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{photo.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      <span>{photo.downloads}</span>
                    </div>
                  </div>
                  
                  <Button size="sm" className="bg-gradient-to-r from-weather-accent-purple to-weather-accent-pink border-0 text-white hover:opacity-90">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Upload Section */}
        <div className="glass-card rounded-2xl p-8 mt-12 text-center">
          <Camera className="w-16 h-16 text-weather-accent-purple mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-weather-text-primary mb-4">
            Share Your Weather Photos
          </h3>
          <p className="text-weather-text-secondary mb-6 max-w-2xl mx-auto">
            Captured an amazing weather moment? Share it with our community and inspire others with the beauty of nature.
          </p>
          <Button className="bg-gradient-to-r from-weather-accent-purple to-weather-accent-pink border-0 text-white hover:opacity-90">
            <Camera className="w-4 h-4 mr-2" />
            Upload Photo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Photos;