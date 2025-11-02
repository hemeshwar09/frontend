import { Play, Eye, ThumbsUp, Share2, Clock, Calendar, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Videos = () => {
  const weatherVideos = [
    {
      id: 1,
      title: "Incredible Lightning Storm Timelapse",
      description: "Watch as nature unleashes its power in this stunning 4K timelapse of a lightning storm over the city.",
      duration: "2:45",
      views: 125420,
      likes: 3241,
      uploadDate: "3 days ago",
      creator: "Storm Chaser Pro",
      category: "Storm",
      thumbnail: "from-purple-600 to-pink-600"
    },
    {
      id: 2,
      title: "Morning Fog Formation in Real-time",
      description: "Mesmerizing footage showing how morning fog develops and flows through valleys and urban landscapes.",
      duration: "4:12",
      views: 89750,
      likes: 2187,
      uploadDate: "5 days ago",
      creator: "Nature's Canvas",
      category: "Fog",
      thumbnail: "from-blue-500 to-cyan-400"
    },
    {
      id: 3,
      title: "Tornado Formation - Documentary",
      description: "Educational video explaining how tornadoes form, featuring real footage and expert commentary.",
      duration: "15:30",
      views: 234567,
      likes: 5892,
      uploadDate: "1 week ago",
      creator: "Weather Science",
      category: "Educational",
      thumbnail: "from-gray-600 to-slate-700"
    },
    {
      id: 4,
      title: "Aurora Borealis Over Mountains",
      description: "Breathtaking northern lights display captured in stunning detail over snow-capped mountain peaks.",
      duration: "3:28",
      views: 167832,
      likes: 4123,
      uploadDate: "2 weeks ago",
      creator: "Arctic Explorer",
      category: "Aurora",
      thumbnail: "from-green-500 to-blue-600"
    },
    {
      id: 5,
      title: "Hurricane Eye Wall - Aerial View",
      description: "Rare aerial footage from inside a hurricane's eye wall, showing the incredible power of nature.",
      duration: "6:15",
      views: 345123,
      likes: 7654,
      uploadDate: "3 weeks ago",
      creator: "Storm Hunters",
      category: "Hurricane",
      thumbnail: "from-orange-600 to-red-600"
    },
    {
      id: 6,
      title: "Hailstorm in Slow Motion",
      description: "Watch hailstones fall in incredible slow motion detail, revealing the beauty in destructive weather.",
      duration: "1:58",
      views: 78456,
      likes: 1876,
      uploadDate: "1 month ago",
      creator: "Slow Mo Weather",
      category: "Hail",
      thumbnail: "from-blue-400 to-white"
    }
  ];

  const categories = ["All", "Storm", "Educational", "Timelapse", "Hurricane", "Aurora", "Fog"];
  const featuredVideo = weatherVideos[0];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-weather-text-primary mb-4">Weather Videos</h1>
          <p className="text-weather-text-secondary text-lg">
            Watch amazing weather phenomena from around the world in stunning detail.
          </p>
        </div>

        {/* Featured Video */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className={`relative h-64 bg-gradient-to-br ${featuredVideo.thumbnail} rounded-xl overflow-hidden group cursor-pointer`}>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                  <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm backdrop-blur-sm">
                {featuredVideo.duration}
              </div>
              
              <div className="absolute top-4 left-4">
                <span className="bg-weather-accent-purple text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-weather-text-primary mb-4">
                {featuredVideo.title}
              </h2>
              <p className="text-weather-text-secondary mb-6 text-lg leading-relaxed">
                {featuredVideo.description}
              </p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-weather-text-muted" />
                  <span className="text-weather-text-secondary">{featuredVideo.creator}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-weather-text-muted" />
                  <span className="text-weather-text-secondary">{featuredVideo.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-weather-text-muted" />
                  <span className="text-weather-text-secondary">{featuredVideo.uploadDate}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-weather-accent-purple to-weather-accent-pink border-0 text-white hover:opacity-90">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
                <Button variant="outline" className="glass-card border-weather-glass-border">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
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

        {/* Video Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weatherVideos.slice(1).map((video) => (
            <Card key={video.id} className="glass-card border-0 overflow-hidden group hover:scale-105 transition-all duration-300">
              {/* Video Thumbnail */}
              <div className={`relative h-48 bg-gradient-to-br ${video.thumbnail} cursor-pointer`}>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                  </div>
                </div>
                
                <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm backdrop-blur-sm">
                  {video.duration}
                </div>

                <div className="absolute top-3 left-3">
                  <span className="bg-black/50 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
                    {video.category}
                  </span>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-weather-text-primary mb-2 line-clamp-2">
                  {video.title}
                </h3>
                
                <p className="text-weather-text-secondary mb-4 line-clamp-2 text-sm">
                  {video.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-weather-text-muted">
                    <User className="w-4 h-4" />
                    <span>{video.creator}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-weather-text-muted">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{video.uploadDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-weather-glass-border">
                  <div className="flex items-center gap-1 text-sm text-weather-text-muted">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{video.likes.toLocaleString()}</span>
                  </div>
                  
                  <Button size="sm" className="bg-gradient-to-r from-weather-accent-purple to-weather-accent-pink border-0 text-white hover:opacity-90">
                    <Play className="w-4 h-4 mr-2" />
                    Watch
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Upload Section */}
        <div className="glass-card rounded-2xl p-8 mt-12 text-center">
          <Play className="w-16 h-16 text-weather-accent-purple mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-weather-text-primary mb-4">
            Share Your Weather Videos
          </h3>
          <p className="text-weather-text-secondary mb-6 max-w-2xl mx-auto">
            Captured incredible weather footage? Share your videos with our community and help others experience the power of nature.
          </p>
          <Button className="bg-gradient-to-r from-weather-accent-purple to-weather-accent-pink border-0 text-white hover:opacity-90">
            <Play className="w-4 h-4 mr-2" />
            Upload Video
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Videos;