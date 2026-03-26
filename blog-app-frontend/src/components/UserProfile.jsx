import { useEffect, useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { useAuth } from "../store/authStore"

import {
  pageWrapper,
  pageTitleClass,
  articleCardClass,
  articleTitle,
  articleExcerpt,
  articleMeta,
  linkClass,
  loadingClass,
  emptyStateClass
} from "../styles/common"

function UserProfile(){

 const { currentUser } = useAuth()

 const [articles,setArticles] = useState([])
 const [loading,setLoading] = useState(true)

 useEffect(()=>{

  const fetchArticles = async()=>{

   const toastId = toast.loading("Fetching articles...")

   try{

    const res = await axios.get(
     `http://localhost:4000/user-api/articles/${currentUser._id}`,
     {withCredentials:true}
    )

    setArticles(res.data.payload)

    toast.success("Articles loaded",{id:toastId})

   }catch(err){

    toast.error("Failed to load articles",{id:toastId})

   }finally{

    setLoading(false)

   }

  }

  if(currentUser){
   fetchArticles()
  }

 },[currentUser])


 if(loading){
  return <div className={loadingClass}>Loading articles...</div>
 }

 if(!articles.length){
  return <div className={emptyStateClass}>No articles found</div>
 }

 return(

  <div className={pageWrapper}>

   <h1 className={pageTitleClass}>
    Articles
   </h1>

   {/* RESPONSIVE GRID */}
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

    {articles.map(article => (

     <div key={article._id} className={articleCardClass}>

      <h3 className={articleTitle}>
       {article.title}
      </h3>

      <p className={articleExcerpt}>
       {article.content.slice(0,100)}...
      </p>

      <span className={articleMeta}>
       Category: {article.category}
      </span>

      {/* READ MORE */}
      <Link
       to={`/article/${article._id}`}
       className={linkClass}
      >
       Read more...
      </Link>

     </div>

    ))}

   </div>

  </div>

 )

}

export default UserProfile