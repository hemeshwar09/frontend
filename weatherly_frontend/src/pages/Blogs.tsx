import { Calendar, User, Eye, Heart, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Blogs = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Understanding Weather Patterns: A Complete Guide",
      excerpt: "Dive deep into the science behind weather formation and learn how to predict local weather changes using natural indicators.",
      author: "Dr. Sarah Johnson",
      date: "December 15, 2024",
      readTime: "8 min read",
      views: 1247,
      likes: 89,
      comments: 23,
      image: "🌦️",
      category: "Science"
    },
    {
      id: 2,
      title: "Climate Change and Extreme Weather Events",
      excerpt: "Exploring the connection between global climate change and the increasing frequency of extreme weather phenomena worldwide.",
      author: "Prof. Michael Chen",
      date: "December 12, 2024",
      readTime: "12 min read",
      views: 2156,
      likes: 156,
      comments: 34,
      image: "🌪️",
      category: "Climate"
    },
    {
      id: 3,
      title: "The Art of Weather Photography",
      excerpt: "Tips and techniques for capturing stunning weather phenomena, from lightning storms to rainbow formations.",
      author: "Emma Rodriguez",
      date: "December 10, 2024",
      readTime: "6 min read",
      views: 892,
      likes: 67,
      comments: 18,
      image: "📸",
      category: "Photography"
    },
    {
      id: 4,
      title: "Seasonal Weather Trends Across the Globe",
      excerpt: "A comprehensive analysis of how different regions experience seasonal changes and what drives these patterns.",
      author: "Dr. James Wilson",
      date: "December 8, 2024",
      readTime: "10 min read",
      views: 1578,
      likes: 112,
      comments: 28,
      image: "🌍",
      category: "Global"
    }
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-weather-text-primary mb-4">Weather Blogs</h1>
          <p className="text-weather-text-secondary text-lg">
            Discover insights, science, and stories about weather and climate from experts around the world.
          </p>
        </div>

        {/* Featured Post */}
        <div className="glass-card rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-weather-accent-purple text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
            <span className="text-weather-text-muted">{blogPosts[0].category}</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-weather-text-primary mb-4">
                {blogPosts[0].title}
              </h2>
              <p className="text-weather-text-secondary mb-6 text-lg leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-weather-text-muted" />
                  <span className="text-weather-text-secondary">{blogPosts[0].author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-weather-text-muted" />
                  <span className="text-weather-text-secondary">{blogPosts[0].date}</span>
                </div>
              </div>

              <Button className="bg-gradient-to-r from-weather-accent-purple to-weather-accent-pink border-0 text-white hover:opacity-90">
                Read Full Article
              </Button>
            </div>
            
            <div className="text-8xl text-center">{blogPosts[0].image}</div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post) => (
            <Card key={post.id} className="glass-card border-0 overflow-hidden hover:scale-105 transition-transform duration-200">
              <div className="p-6">
                <div className="text-4xl mb-4 text-center">{post.image}</div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-weather-glass text-weather-text-primary px-2 py-1 rounded text-xs">
                    {post.category}
                  </span>
                  <span className="text-weather-text-muted text-sm">{post.readTime}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-weather-text-primary mb-3 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-weather-text-secondary mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-weather-text-muted" />
                    <span className="text-sm text-weather-text-secondary">{post.author}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-weather-text-muted">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;