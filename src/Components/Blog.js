import {useState,useRef, useEffect} from "react";
import {db} from "../firebaseInit";
import { collection, addDoc,getDocs, onSnapshot, deleteDoc,doc } from "firebase/firestore"; //affDoc is the function which will help in adding new document



// function blogsReducer(state,action){
//     switch(action.type)
//     {
//         case "ADD":
//             return [action.blog, ...state];//the current blog alongwith all the other blogs is contained in state(...->rest function)
//         case "REMOVE":
//             return state.filter((blog,index)=> index !== action.index);
//         default:
//             return [];
//     }
// }

export default function Blog(){

    //useState is going to initialize any values
    // const [title,setTitle] = useState("");
    // const [content,setContent] = useState("");
    const [formData,setFormData] = useState({title:"", content:""});//trying to pass object in useState
    const [blogs,setBlogs] = useState([]);//this will help us to populate title and content together as one unit..it is in the form of array
    //const [blogs,dispatch] = useReducer(blogsReducer,[]);//blogsReducer is the function and [] is the empty array
    const titleRef = useRef(null);//when I will click on Add...after that I want to change the focus to title blank
    
    //when we mount our app on the DOM we want to shift the focus on the title bar...for that we are using useEffect
    useEffect(()=>{
        titleRef.current.focus();
    },[]);//now why are we passing empty dependencies...because we want the focus on title bar only during initial rendering
    //now that is now equivalent to component did mount 
    
    //when we want to mount the component on the DOM..then we use useEffect...for initial rendering
    //for retrieving the data from the database
     useEffect(()=>{
        // async function fetchData(){
        //    const snapShot = await getDocs(collection(db,"blogs"));
        //    console.log(snapShot);
        //    const blogs = snapShot.docs.map((doc)=>{//storing all the blogs in the blogs variable...traversing the map
        //       return{
        //          id: doc.id,
        //          ...doc.data()
        //       }
        //    })
        //    setBlogs(blogs);//setting the state
        // }

        // fetchData();
        
        //using onsnapShot for creating a listener
        //now I have made it real time updates
        const unSub = onSnapshot(collection(db,"blogs"),(snapShot)=>{
            const blogs = snapShot.docs.map((doc)=>{//storing all the blogs in the blogs variable...traversing the map
                      return{
                         id: doc.id,
                         ...doc.data()
                      }
                   })
                   setBlogs(blogs);//setting the state
                
                })      
        
     },[]);




    useEffect(()=>{
        if(blogs.length)
        {
            document.title = blogs[0].title;
        }
        else{
            document.title = "No Blogs!!";
        }
    },[blogs])//here I am putting blogs as dependencies because I want the title to change as blogs are getting updated

    //Passing the synthetic event as argument to stop refreshing the page on submit
    async function handleSubmit(e){
        e.preventDefault();
       // setBlogs([{title:formData.title,content: formData.content},...blogs]);//using rest operator of JS...it will help us to store all our previous blogs
        //dispatch({type:"ADD" ,blog:{title: formData.title,content: formData.content}});
        // setTitle("");//isse kya hoga na..ki jab add par click karenge tab automatically form main jo blank hain woh clean ho jayega
        // setContent("");
        // Add a new document with a generated id.
         await addDoc(collection(db, "blogs"), {
            title: formData.title,
            content: formData.content,
             createdOn: new Date()
         });
          //console.log("Document written with ID: ", docRef.id);





        setFormData({title:"",content:""});
        titleRef.current.focus();//titleRef refers to the blank of title row
    }

    async function removeBlog(id){
        //setBlogs is local state..not real time updates
       // setBlogs(blogs.filter((blog,index)=> i !== index));//setBlogs should now contain all the blogs except the blog which we want to delete
        //dispatch({type:"REMOVE",index:i});//we have to mention the type

        const docRef = doc(db,"blogs",id);//since I want to delete a speific document from the database...so using doc
        //the id of the doc is being used to delete the document
        await deleteDoc(docRef);
        //ab jake database se remove hoga woh particular document
    }
    
    return(
        <>
           <h1>Write a Blog!!</h1>
           <div section="className">
              <form onSubmit={handleSubmit}>
                 <Row label="Title">
                    <input className="input" placeholder="Enter the title of your blog"
                      value = {formData.title}
                       onChange = {(e) => setFormData({title: e.target.value,content: formData.content})}
                       //we have to mention about content even though it is not getting updated(in this instance) because
                       //when we are changing the object we have to change the whole object...we just cannot change a part of it
                       ref = {titleRef}//we have set our ref to the title field
                    />
                 </Row>
                   <Row label="Content">
                       <textarea className="input content" placeholder="Content of the blog goes here"
                         value = {formData.content}
                         required
                         onChange = {(e) => setFormData({title:formData.title,content: e.target.value})}
                       />
                   </Row>
                   
                 <button className="btn">ADD</button>
              </form>
           </div>
            <hr/>

            <h2>Blogs</h2>
            {/**using a map */}
             {blogs.map((blog,i)=>(
                <div className="blog" key={i}>
                     <h3>{blog.title}</h3>
                     <p>{blog.content}</p>

                     <div className="blog-btn">
                        <button onClick={()=> removeBlog(blog.id)} className="btn remove">
                            Delete
                        </button>
                     </div>
                </div>
                 
             ))}
        </>

    )

}

//Row component to introduce a new row section in the form
function Row(props){
    const {label} = props;
    return(
        <>
         <label>{label}<br/></label>
         {props.children}
         <hr/>
        </>
    )
}