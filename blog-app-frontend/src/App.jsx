import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Toaster } from "react-hot-toast"

import RootLayout from "./components/RootLayout"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import UserDashboard from "./components/UserDashboard"
import AuthorDashboard from "./components/AuthorDashboard"
import AdminDashboard from "./components/AdminDashboard"
import ArticleDetails from "./components/ArticleDetails"
import AddArticle from "./components/AddArticle"
import DeletedArticles from "./components/DeletedArticles"
import ProtectedRoute from "./components/ProtectedRoute"
import Unauthorized from "./components/Unauthorized"

const router = createBrowserRouter([
 {
  path:"/",
  element:<RootLayout/>,
  children:[
   { index:true, element:<Home/> },
   { path:"login", element:<Login/> },
   { path:"register", element:<Register/> },
   { path:"user-dashboard", element: (
    <ProtectedRoute allowedRoles={["USER"]}>
      <UserDashboard/>
    </ProtectedRoute>
   ) },
   { path:"author-dashboard", element: (
    <ProtectedRoute allowedRoles={["AUTHOR"]}>
      <AuthorDashboard/>
    </ProtectedRoute>
   ) },
   { path:"admin-dashboard", element: (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <AdminDashboard/>
    </ProtectedRoute>
   ) },
   { path:"add-article", element: (
    <ProtectedRoute allowedRoles={["AUTHOR"]}>
      <AddArticle/>
    </ProtectedRoute>
   ) },
   { path:"deleted-articles", element: (
    <ProtectedRoute allowedRoles={["AUTHOR"]}>
      <DeletedArticles/>
    </ProtectedRoute>
   ) },

   { path:"article/:articleId", element:<ArticleDetails/> },
   { path:"unauthorized", element:<Unauthorized/> }
  ]
 }
])

import { useEffect } from "react"
import { useAuth } from "./store/authStore"

function App(){
 const { checkAuth } = useAuth();

 useEffect(() => {
   checkAuth();
 }, [checkAuth]);

 return (
   <>
    <Toaster position="top-right"/>
    <RouterProvider router={router}/>
   </>
 )
}

export default App