import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

function AddArticle() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation(); // To check if we are editing

  useEffect(() => {
    if (state) {
      setValue("title", state.title);
      setValue("category", state.category);
      setValue("content", state.content);
    }
  }, [state, setValue]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        author: currentUser._id,
        // Only needed for create, but harmless for update if ignored or handled
        isArticleActive: true 
      };

      if (state) {
        // UPDATE
        // The backend expects: { articleId, title, category, content, author }
        // The payload above has title, category, content, author. 
        // We need to add articleId.
        const updatePayload = {
            ...payload,
            articleId: state._id
        }

        const res = await axios.put(
          "http://localhost:4000/author-api/articles",
          updatePayload,
          { withCredentials: true }
        );

        if (res.status === 200) {
            toast.success("Article updated successfully");
            navigate("/author-dashboard");
        }

      } else {
        // CREATE
        const res = await axios.post(
          "http://localhost:4000/author-api/articles",
          payload,
          { withCredentials: true }
        );
        if (res.status === 201) {
            toast.success("Article created successfully");
            navigate("/author-dashboard");
        }
      }

      
    } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-bold">
        {state ? "Edit Article" : "Write new Article"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full rounded border p-2"
          />
           {errors.title && (
              <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>
            )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            {...register("category", { required: "Category is required" })}
            className="w-full rounded border p-2"
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Health">Health</option>
            <option value="Travel">Travel</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Programming">Programming</option>
          </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>
            )}
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium">Content</label>
          <textarea
            {...register("content", { required: "Content is required" })}
            rows="10"
            className="w-full rounded border p-2"
          ></textarea>
           {errors.content && (
              <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
            )}
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {state ? "Update" : "Publish"}
        </button>
      </form>
    </div>
  );
}

export default AddArticle;
