import { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function UserDashboard() {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get(
            `http://localhost:4000/user-api/articles/${currentUser._id}`, // passing ID even if ignored by updated backend
            { withCredentials: true }
        );
        if (res.status === 200) {
            setArticles(res.data.payload);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load articles");
      }
    };
    if (currentUser) {
        fetchArticles();
    }
  }, [currentUser]);

  const handleReadArticle = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Latest Articles</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div
              key={article._id}
              className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {article.category}
                </span>
                <span className="text-xs text-gray-500">
                    {new Date(article.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2 truncate">
                {article.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                  By {article.author?.firstName} {article.author?.lastName}
              </p>
              <p className="text-gray-600 mb-4 h-20 overflow-hidden text-sm">
                {article.content.substring(0, 150)}...
              </p>
              
              <button
                onClick={() => handleReadArticle(article._id)}
                className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 text-sm"
              >
                Read More
              </button>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No articles available at the moment.
          </p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
