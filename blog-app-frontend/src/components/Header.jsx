import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";

import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
  primaryBtn
} from "../styles/common";

function Header() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className={navbarClass}>
      <div className={navContainerClass}>
        <div className={`${navBrandClass} flex items-center gap-2`}>
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span className="tracking-tight">MyBlogs</span>
        </div>

        <div className={navLinksClass}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? navLinkActiveClass : navLinkClass
            }
          >
            Home
          </NavLink>

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? navLinkActiveClass : navLinkClass
                }
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? navLinkActiveClass : navLinkClass
                }
              >
                Register
              </NavLink>
            </>
          ) : (
            <>
              {currentUser?.role === "USER" && (
                <NavLink
                  to="/user-dashboard"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Dashboard
                </NavLink>
              )}
              {currentUser?.role === "AUTHOR" && (
                <>
                  <NavLink
                    to="/author-dashboard"
                    className={({ isActive }) =>
                      isActive ? navLinkActiveClass : navLinkClass
                    }
                  >
                    My Articles
                  </NavLink>
                  <NavLink
                    to="/add-article"
                    className={({ isActive }) =>
                      isActive ? navLinkActiveClass : navLinkClass
                    }
                  >
                    Add Article
                  </NavLink>
                  <NavLink
                    to="/deleted-articles"
                    className={({ isActive }) =>
                      isActive ? navLinkActiveClass : navLinkClass
                    }
                  >
                    Trash
                  </NavLink>
                </>
              )}
              {currentUser?.role === "ADMIN" && (
                <NavLink
                  to="/admin-dashboard"
                  className={({ isActive }) =>
                    isActive ? navLinkActiveClass : navLinkClass
                  }
                >
                  Admin Panel
                </NavLink>
              )}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {currentUser?.profileImageUrl ? (
                    <img 
                      src={currentUser.profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 border border-blue-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser?.firstName}
                  </span>
                </div>
                <button onClick={handleLogout} className={primaryBtn}>
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;