import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", "Technology", "Health", "Travel", "Lifestyle", "Programming"];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get("http://localhost:4000/common-api/articles");
        setArticles(res.data.payload);
        setFilteredArticles(res.data.payload);
      } catch (err) {
        console.error("Failed to fetch public articles");
      }
    };
    fetchArticles();
  }, []);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === "All") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(articles.filter((a) => a.category === cat));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-center text-white">
        <h1 className="mb-4 text-5xl font-extrabold tracking-tight">Explore the World of Ideas</h1>
        <p className="mx-auto max-w-2xl text-xl opacity-90">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <div
                key={article._id}
                onClick={() => navigate(`/article/${article._id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-100"
              >
                <div className="h-48 w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform">
                    {/* Placeholder for image */}
                    <span className="text-4xl font-bold opacity-20 uppercase">{article.category}</span>
                </div>
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {article.content}
                  </p>
                  <div className="flex items-center gap-3 border-t pt-4">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                        {article.author?.firstName ? article.author.firstName[0] : "?"}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {article.author?.firstName} {article.author?.lastName}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500">
              No articles found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
