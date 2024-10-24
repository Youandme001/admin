/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { useEffect, useState } from "react";
import { fire , storage} from '../../components/firebase-config';
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, getDocs } from "firebase/firestore";

function StoreImageTextFirebase(){
    const [txt,setTxt] = useState('')
    const [img,setImg] = useState('')
    const [data,setData] = useState([])


    const handleUpload = (e) =>{
        console.log(e.target.files[0])
        const imgs = ref(storage,`userImages/${v4()}`)
        uploadBytes(imgs,e.target.files[0]).then(data=>{
            console.log(data,"imgs")
            getDownloadURL(data.ref).then(val=>{
                setImg(val)
            })
        })
    }

    const handleClick = async () =>{
            const valRef = collection(fire,'users')
            await addDoc(valRef,{txtVal:txt,imageUrl:img})
            alert("Data added successfully")
    }

    const getData = async () =>{
        const valRef = collection(fire,'users')
        const dataDb = await getDocs(valRef)
        const allData = dataDb.docs.map(val=>({...val.data(),id:val.id}))
        setData(allData)
        console.log(dataDb)
    }

    useEffect(()=>{
        getData()
})
    console.log(data,"datadata")

    return(
        <div>
             <input onChange={(e)=>setTxt(e.target.value)} /><br/>
             <input type="file" onChange={(e)=>handleUpload(e)} /><br/><br/>
             <button onClick={handleClick}>Add</button>

 {data.map((value, index) => (
        <div key={index}>
          <h1>{value.txtVal}</h1>
          <img src={value.imageUrl} height='200px' width='200px' alt={`img-${index}`} />
        </div>
      ))}
    </div>
    )
}
export default StoreImageTextFirebase;