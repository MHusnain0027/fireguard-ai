"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminPage(){

const router = useRouter();

const [checking,setChecking]=useState(true);


useEffect(()=>{


const admin = localStorage.getItem(
"fireguard_admin"
);


if(!admin){

router.push("/login");

}

else{

setChecking(false);

}


},[]);



function logout(){

localStorage.removeItem(
"fireguard_admin"
);

router.push("/login");

}




if(checking){

return(

<main className="min-h-screen flex items-center justify-center bg-black">

<h1 className="text-green-400 text-3xl font-bold">

Checking Access...

</h1>

</main>

)

}



return(

<main

className="relative min-h-screen bg-cover bg-center p-6"

style={{

backgroundImage:"url('/fire-bg.jpg')"

}}

>


<div className="absolute inset-0 bg-black/60"></div>



<div className="relative z-10 max-w-4xl mx-auto">



<div className="bg-white/10 backdrop-blur-xl border border-green-400/30 rounded-3xl p-10">


<h1 className="text-5xl text-center font-bold text-green-400">

🔐 FireGuard AI Admin Panel

</h1>



<p className="text-center text-gray-300 mt-4">

Manage Fire Alarm Database

</p>




<div className="mt-10 grid md:grid-cols-2 gap-5">



<Link href="/">

<div className="bg-green-500/20 border border-green-400 rounded-xl p-8 text-center hover:bg-green-500/40 cursor-pointer">

<h2 className="text-3xl">

🏠

</h2>

<p className="text-white font-bold mt-3">

Dashboard

</p>


</div>

</Link>






<Link href="/admin">

<div className="bg-blue-500/20 border border-blue-400 rounded-xl p-8 text-center">


<h2 className="text-3xl">

📂

</h2>


<p className="text-white font-bold mt-3">

Upload Database

</p>


</div>

</Link>



</div>




<button

onClick={logout}

className="mt-10 w-full bg-red-500 text-white py-4 rounded-xl font-bold"

>

🚪 Logout

</button>



</div>



</div>


</main>


)


}
