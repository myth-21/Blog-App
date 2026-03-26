### BACKEND DEVELOPMENT

1. Create git repo
    git init

2. Add .gitignore file

3. Create .env file for environment variables and Read data from .env with "dotenv" module
    npm install dotenv

4. Generate package.json
    npm init -y

5. Create express application
    npm install express    

6. Connect to database
    npm install mongoose

7.  Add middleware( body parser, err handling middleware)  

8. Design schemas and create models

9. Design REST APIs for all resources


### Registeration & login

10. Registeration & login in common for USER & AUTHOR, create a seperate service to reuse

11. The Client wont send role. It just redirects to a specific API based on role selection. The hardcoded role assigned by API routes.















folder naming is in lower case

INSTALLATION OF REACT
npm create vite@latest 
   (y):y
   project-name:.
   framework: react
   varient: javascript
   beta version: no
   install:yes
   
TAILWIND CSS
npm install tailwindcss @tailwindcss/vite
in vite.config.js--->add tailwindcss() beside react
in index.css --> add @import "tailwindcss";

ctrl+shift+p -->user settings (json) --> add->"editor.quickSuggestions": {
        "strings": "on"
    },
    "tailwindCSS.experimental.configFile": null,

terminal-->npm run dev


npm i react-hook-form  --->react hook

rfce -------> to directly generate the jsx 

==========================================================================================================================================================================

side effects:
  1. a component can render initially before displaying content
  2. if the component is about to make an API request it should wait until the initial render is completed
  3. if both initial rendering and API request happen together , it leads to unexpected bugs in the application
  4. no dependency array -- useEffect hook runs after every render ->useEffect(()=>{side effect})
  5. empty array[] -- useEffect hook runs once on mount  -> useEffect(()=>{side effect},[])
  6. with dependencies -- runs when dependencies change -> useEffect(()=>{side effect},[dependency])


==========================================================================================================================================================================

ROUTING STEPS:
  1. design route layout
  2. npm i react-router
  3. 


==========================================================================================================================================================================
  
STATE MANAGEMENT:
state management means sharing state across appln and achieve sync in state across appln

STEPS:
1. create context object
2. every context object has a context provider and context consumer
3. context provider is used to provide state through context objrect whereas the components can consume the state through the context object
4. a component can consume the state of context provider with usecontext hook


make sure every context contains only one state then it works properly if morethan one state is used then uneccessary re-rendering takes place as it takes the complete thing as object solution for this is redux for large appln


==========================================================================================================================================================================

npm i cors --->in the backend