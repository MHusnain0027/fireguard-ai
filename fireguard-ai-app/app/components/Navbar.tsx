"use client";

import Link from "next/link";
import { useState } from "react";


export default function Navbar(){


const [menuOpen,setMenuOpen] = useState(false);



const menuItems = [

{
name:"🏠 Home",
link:"/"
},

{
name:"📋 Patrol Reports",
link:"/patrol"
},

{
name:"🚨 Incident Report",
link:"/fire-alarm-report"
},

{
name:"📊 History",
link:"/incidents"
},

{
name:"🔐 Admin",
link:"/admin"
}

];



return (

<nav className="
bg-slate-900/80
backdrop-blur-xl
text-white
px-5
py-4
shadow-lg
relative
z-50
border-b
border-green-400/20
">



<div className="
max-w-7xl
mx-auto
flex
items-center
justify-between
">





<h1 className="
brand-fire
text-2xl
font-bold
text-green-400
hover:scale-105
transition
cursor-pointer
">

🔥 FireGuard AI

</h1>







<button

onClick={()=>setMenuOpen(!menuOpen)}

className="
group
text-3xl
text-green-400
transition
duration-300
"

>


<span

className={`
inline-block
transition-transform
duration-300
${menuOpen ? "rotate-90" : ""}
`}

>

☰

</span>


</button>






</div>








<div

className={`
absolute
right-5
top-16
w-64
transition-all
duration-500
origin-top-right

${
menuOpen

?

"opacity-100 scale-100 translate-y-0"

:

"opacity-0 scale-95 -translate-y-5 pointer-events-none"

}

`}


>


<div

className="
bg-black/70
backdrop-blur-2xl
border
border-green-400/40
rounded-3xl
p-4
shadow-2xl
"


>



{
menuItems.map((item,index)=>(


<Link

key={index}

href={item.link}

onClick={()=>setMenuOpen(false)}

className="
block
px-4
py-3
rounded-xl
text-gray-200
hover:text-green-400
hover:bg-green-400/10
hover:translate-x-2
transition-all
duration-300
"

>

{item.name}


</Link>


))

}



</div>


</div>





</nav>

);


}