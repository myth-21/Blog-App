import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [users, setUsers] = useState([]);
  const [view, setView] = useState("articles"); // 'articles' or 'users'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artRes, userRes] = await Promise.all([
          axios.get("http://localhost:4000/admin-api/articles", { withCredentials: true }),
          axios.get("http://localhost:4000/admin-api/users", { withCredentials: true })
        ]);
        setArticles(artRes.data.payload);
        setUsers(userRes.data.payload);
      } catch (err) {
        toast.error("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const endpoint = currentStatus ? "block" : "unblock";
      const res = await axios.patch(
        `http://localhost:4000/admin-api/${endpoint}/${userId}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: !currentStatus } : u));
        setArticles(articles.map(art => art.author?._id === userId ? { ...art, author: { ...art.author, isActive: !currentStatus } } : art));
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const toggleArticleStatus = async (articleId, currentStatus) => {
    try {
      const res = await axios.patch(
        `http://localhost:4000/author-api/articles/${articleId}/status`,
        { isArticleActive: !currentStatus },
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setArticles(articles.map(art => art._id === articleId ? { ...art, isArticleActive: !currentStatus } : art));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h2>
            <p className="text-gray-500 mt-1">Manage your platform's content and users</p>
          </div>
          <div className="inline-flex p-1 bg-gray-100 rounded-lg">
            <button 
              onClick={() => setView("articles")}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                view === 'articles' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Articles
            </button>
            <button 
              onClick={() => setView("users")}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                view === 'users' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Users
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {view === "articles" ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Article Info</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Author Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Article Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.map((art) => (
                    <tr key={art._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {art.author?.profileImageUrl ? (
                            <img src={art.author.profileImageUrl} alt="author" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-bold text-gray-900">{art.title}</div>
                            <div className="text-xs text-gray-500">{art.author?.firstName} • {art.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          art.author?.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                        }`}>
                          {art.author?.isActive ? "Active" : "Blocked"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          art.isArticleActive 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-orange-100 text-orange-800"
                        }`}>
                          {art.isArticleActive ? "Live" : "Deleted"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/article/${art._id}`)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => toggleArticleStatus(art._id, art.isArticleActive)}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded transition-colors text-white ${
                              art.isArticleActive 
                              ? "bg-red-500 hover:bg-red-600" 
                              : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {art.isArticleActive ? "Delete" : "Restore"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Profile</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-400">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                          user.role === 'AUTHOR' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => toggleUserStatus(user._id, user.isActive)}
                          className={`inline-flex items-center px-4 py-2 border border-transparent text-xs font-bold rounded-md shadow-sm text-white transition-all duration-200 ${
                            user.isActive 
                            ? "bg-red-600 hover:bg-red-700" 
                            : "bg-green-600 hover:bg-green-700"
                          } focus:outline-none`}
                        >
                          {user.isActive ? "Block User" : "Unblock User"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

