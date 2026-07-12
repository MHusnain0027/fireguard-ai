"use client";

import { useState } from "react";
import Link from "next/link";

export default function UploadPage(){

const [file,setFile]=useState<File | null>(null);
const [message,setMessage]=useState("");



async function uploadExcel(){

if(!file){

setMessage("Please select Excel file");

return;

}


const formData=new FormData();

formData.append(
"file",
file
);



const res = await fetch(
"/api/upload",
{
method:"POST",
body:formData
}
);


const data=await res.json();



if(data.success){

setMessage(
`✅ ${data.total} Records Imported Successfully`
);

}
else{

setMessage(
"❌ Upload Failed"
);

}



}



return(

<main

className="relative min-h-screen bg-cover bg-center p-6"

style={{
backgroundImage:"url('/fire-bg.jpg')"
}}

>


<div className="absolute inset-0 bg-black/60"></div>



<div className="relative z-10 max-w-xl mx-auto mt-20">


<div className="bg-white/10 backdrop-blur-xl border border-green-400/30 rounded-3xl p-10">


<h1 className="text-4xl text-center text-green-400 font-bold">

📂 Upload FACP Database

</h1>


<p className="text-gray-300 text-center mt-3">

Upload Excel Fire Alarm Location File

</p>



<input

type="file"

accept=".xlsx,.xls"

className="mt-8 w-full bg-white text-black p-4 rounded-xl"

onChange={(e)=>
setFile(
e.target.files?.[0] || null
)
}

/>



<button

onClick={uploadExcel}

className="mt-6 w-full bg-green-500 text-black font-bold py-4 rounded-xl"

>

📤 Upload Database

</button>




{
message &&

<p className="text-green-400 text-center mt-5 font-bold">

{message}

</p>

}



<Link href="/admin">

<button

className="mt-5 w-full border border-green-400 text-green-400 py-3 rounded-xl"

>

⬅ Back Admin Panel

</button>

</Link>



</div>


</div>



</main>

)


}
