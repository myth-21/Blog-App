import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

function ArticleDetails() {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const { currentUser } = useAuth();
  const { register, handleSubmit, reset } = useForm();

  const fetchArticle = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/common-api/articles/${articleId}`
      );
      setArticle(res.data.payload);
    } catch (err) {
      toast.error("Failed to load article");
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const onCommentSubmit = async (data) => {
    try {
      const res = await axios.put(
        "http://localhost:4000/user-api/articles/",
        {
          articleId: article._id,
          user: currentUser._id,
          comment: data.comment,
        },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Comment added");
        setArticle(res.data.payload);
        reset();
      }
    } catch (err) {
      console.error("Comment failed:", err);
      toast.error("Failed to add comment");
    }
  };

  if (!article) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
            {article.category}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">{article.title}</h1>
        <p className="mb-6 text-sm text-gray-600">
          By <span className="font-medium">{article.author?.firstName}</span>
        </p>
        <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
          {article.content}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Comments</h2>
        <div className="mb-6 space-y-4">
          {article.comments?.length > 0 ? (
            article.comments.map((c, idx) => (
              <div key={idx} className="rounded border bg-gray-50 p-3">
                <p className="text-sm text-gray-800">{c.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet.</p>
          )}
        </div>

        {(currentUser?.role === "USER" || currentUser?.role === "AUTHOR") ? (
          <form onSubmit={handleSubmit(onCommentSubmit)} className="flex gap-2">
            <input
              type="text"
              {...register("comment", { required: true })}
              placeholder="Add a comment..."
              className="flex-1 rounded border p-2 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              Post
            </button>
          </form>
        ) : (
          <div className="bg-blue-50 p-4 rounded text-center">
            <p className="text-sm text-blue-700">
                Please <Link to="/login" className="font-bold underline">Login</Link> as a User or Author to post comments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleDetails;
