import { useEffect, useState } from "react";
import { useAuth } from "../store/authStore";
import axios from "axios";
import toast from "react-hot-toast";

function DeletedArticles() {
  const { currentUser } = useAuth();
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchDeleted = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/author-api/articles/${currentUser._id}`,
          { withCredentials: true }
        );
        // Filter for only inactive ones
        setArticles(res.data.payload.filter(a => !a.isArticleActive));
      } catch (err) {
        toast.error("Failed to load deleted articles");
      }
    };
    if (currentUser) fetchDeleted();
  }, [currentUser]);

  const handleRestore = async (id) => {
    try {
      const res = await axios.patch(
        `http://localhost:4000/author-api/articles/${id}/status`,
        { isArticleActive: true },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Article restored");
        setArticles(articles.filter(a => a._id !== id));
      }
    } catch (err) {
      toast.error("Failed to restore article");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-6 text-2xl font-bold text-red-600">Trash / Deleted Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.length > 0 ? (
          articles.map((article) => (
            <div key={article._id} className="border rounded-lg p-4 bg-gray-50 opacity-80">
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4 h-20 overflow-hidden text-sm">{article.content.substring(0, 100)}...</p>
              <button
                onClick={() => handleRestore(article._id)}
                className="text-green-600 font-medium hover:underline"
              >
                Restore Article
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No deleted articles found.</p>
        )}
      </div>
    </div>
  );
}

export default DeletedArticles;
