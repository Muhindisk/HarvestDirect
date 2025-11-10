import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Calendar, User, ArrowRight, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const Blog = () => {
  const featuredPost = {
    title: "How Technology is Transforming Agriculture in East Africa",
    excerpt: "Explore how digital platforms are revolutionizing the way farmers connect with markets, improving livelihoods and food security across the region.",
    author: "Sarah Kimani",
    date: "October 20, 2025",
    category: "Technology",
    readTime: "8 min read",
    image: "featured"
  };

  const blogPosts = [
    {
      title: "10 Tips for Successful Produce Marketing",
      excerpt: "Learn the best strategies to market your farm produce effectively and maximize your profits on digital platforms.",
      author: "John Odhiambo",
      date: "October 18, 2025",
      category: "Marketing",
      readTime: "6 min read"
    },
    {
      title: "Understanding Quality Standards: A Farmer's Guide",
      excerpt: "Everything you need to know about meeting quality standards and achieving certification for premium pricing.",
      author: "Mary Wanjiru",
      date: "October 15, 2025",
      category: "Quality",
      readTime: "7 min read"
    },
    {
      title: "The Future of Farm-to-Market Supply Chains",
      excerpt: "How direct marketplace platforms are reducing waste and creating value for both farmers and consumers.",
      author: "David Mutua",
      date: "October 12, 2025",
      category: "Industry",
      readTime: "5 min read"
    },
    {
      title: "Seasonal Planting Guide for Maximum Profitability",
      excerpt: "Plan your planting schedule to take advantage of market demand and seasonal pricing opportunities.",
      author: "Grace Achieng",
      date: "October 10, 2025",
      category: "Farming",
      readTime: "10 min read"
    },
    {
      title: "Success Story: How Kariuki Farm Tripled Revenue",
      excerpt: "Meet a farmer who transformed his business by embracing digital marketplace platforms and modern farming techniques.",
      author: "Peter Kariuki",
      date: "October 8, 2025",
      category: "Success Stories",
      readTime: "6 min read"
    },
    {
      title: "Navigating Payment and Escrow Systems Safely",
      excerpt: "A comprehensive guide to understanding and using escrow systems to protect your transactions.",
      author: "Sarah Kimani",
      date: "October 5, 2025",
      category: "Safety",
      readTime: "5 min read"
    },
    {
      title: "Sustainable Farming Practices for Long-term Success",
      excerpt: "Implementing sustainable practices that benefit your farm, the environment, and your bottom line.",
      author: "James Mwangi",
      date: "October 3, 2025",
      category: "Sustainability",
      readTime: "9 min read"
    },
    {
      title: "Buyer's Guide: How to Source Quality Produce Online",
      excerpt: "Tips for buyers on how to find reliable farmers and ensure consistent quality in your orders.",
      author: "Alice Njeri",
      date: "October 1, 2025",
      category: "Buying",
      readTime: "7 min read"
    },
    {
      title: "The Impact of Mobile Money on Agricultural Trade",
      excerpt: "How mobile payment systems are making agricultural commerce more accessible and efficient.",
      author: "Michael Otieno",
      date: "September 28, 2025",
      category: "Finance",
      readTime: "6 min read"
    }
  ];

  const categories = [
    "All Posts",
    "Technology",
    "Marketing",
    "Farming",
    "Success Stories",
    "Quality",
    "Industry",
    "Safety",
    "Sustainability"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                HarvestDirect Blog
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Insights, tips, and stories from the world of agricultural commerce
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="pl-12 py-6 text-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-12">
                    <BookOpen className="h-32 w-32 text-primary/40" />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <Badge className="self-start mb-4">{featuredPost.category}</Badge>
                    <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{featuredPost.date}</span>
                      </div>
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <Button>
                      Read More <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-12">Latest Articles</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <Card key={index} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge variant="secondary" className="self-start mb-2">{post.category}</Badge>
                      <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col">
                      <CardDescription className="mb-4 line-clamp-3 flex-1">
                        {post.excerpt}
                      </CardDescription>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{post.date}</span>
                          </div>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <Button variant="link" className="p-0 h-auto mt-4 self-start">
                        Read Article <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button size="lg" variant="outline">
                  Load More Articles
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-primary/5">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl mb-4">Subscribe to Our Newsletter</CardTitle>
                  <CardDescription className="text-base">
                    Get the latest articles, insights, and tips delivered to your inbox every week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="flex-1"
                    />
                    <Button className="sm:w-auto">
                      Subscribe
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
