"use client"

import Layout from "@/components/Layout"
import { useEffect, useState } from "react"
import ConfirmModal from "@/components/ConfirmModal"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
export default function CategoriesPage(){
const router = useRouter()
const [name,setName] = useState("")
const [parent,setParent] = useState("")
const [categories,setCategories] = useState<any[]>([])
const [properties,setProperties] = useState<any[]>([])
const [editedCategory,setEditedCategory] = useState<any>(null)
const [categoryToDelete,setCategoryToDelete] = useState(null);
useEffect(()=>{
 fetchCategories()
},[])

async function fetchCategories(){
 const res = await fetch("/api/categories")
 const data = await res.json()
 setCategories(data)
}

function addProperty(){
 setProperties(prev => [...prev,{name:"",values:""}])
}

function updatePropertyName(index:number,value:string){
 const props = [...properties]
 props[index].name = value
 setProperties(props)
}

function updatePropertyValues(index:number,value:string){
 const props = [...properties]
 props[index].values = value
 setProperties(props)
}

function removeProperty(index:number){
 const props = [...properties]
 props.splice(index,1)
 setProperties(props)
}

async function saveCategory(ev:any){
 ev.preventDefault()

 const data = {
  name,
  parent: parent || null,
  properties: properties.map(p => ({
   name: p.name,
   values: p.values.split(",").map((v:string)=>v.trim())
  }))
 }

 if(editedCategory){

  await fetch(`/api/categories/${editedCategory._id}`,{
   method:"PUT",
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(data)
  })
  toast.success("Category updated successfully")
 }else{

  await fetch("/api/categories",{
   method:"POST",
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(data)
  })
    toast.success("Category created")

}

setName("")
setParent("")
setProperties([])
setEditedCategory(null)

 fetchCategories()
}

function editCategory(cat:any){
 setEditedCategory(cat)
 setName(cat.name)
 setParent(cat.parent || "")
 setProperties(
  (cat.properties || []).map((p:any)=>({
   name:p.name,
   values:p.values.join(",")
  }))

 )

}

async function deleteCategory(id:string){ 

 await fetch(`/api/categories/${id}`,{
  method:"DELETE"
 })
 toast.success("Category deleted")
 setCategoryToDelete(null)
 fetchCategories()
}

return (

<Layout>

    <div className="flex justify-center">

    <div className="bg-white rounded-lg shadow p-6 max-w-4xl w-full ">

    <div className="flex justify-center">
    <h1 className="text-xl font-semibold mb-6">
    {editedCategory ? "Edit Category" : "New Category"}
    </h1>
    </div>

    <form onSubmit={saveCategory}>

    <div className="flex gap-4 mb-6">

    <input
    value={name}
    onChange={ev=>setName(ev.target.value)}
    placeholder="Category name"
    className="border rounded-md p-2 w-1/2 h-12"
    />

    <select
    value={parent}
    onChange={ev=>setParent(ev.target.value)}
    className="border rounded-md p-2 w-1/2 h-12"
    >

    <option value="">No parent</option>

    {categories.map(cat=>(
    <option key={cat._id} value={cat._id}>
    {cat.name}
    </option>
    ))}

    </select>

    </div>

    {/* properties */}

    <div className="mb-6">

    <div className="flex justify-between items-center mb-3">

    <h3 className="font-semibold text-lg">Properties</h3>

    <button
    type="button"
    onClick={addProperty}
    className="bg-blue-200 px-3 py-1 rounded hover:bg-blue-300 cursor-pointer"
    >
    + Add property
    </button>

    </div>

    <div>

    {properties.map((prop,index)=>(

    <div key={index} className="flex gap-3 items-center">

    <input
    value={prop.name}
    onChange={(ev)=>updatePropertyName(index,ev.target.value)}
    placeholder="Property name"
    className="border rounded p-2 w-1/3"
    />

    <input
    value={prop.values}
    onChange={(ev)=>updatePropertyValues(index,ev.target.value)}
    placeholder="Values (comma separated)"
    className="border rounded p-2 w-1/2"
    />

    <button
    type="button"
    onClick={()=>removeProperty(index)}
    className="btn-delete px-3 py-2"
    >
    Remove
    </button>

    </div>

    ))}

    </div>

    </div>

    <div className="flex justify-center gap-2 mt-4">
    
    <button
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
    >
    Save Category
    </button>
    {editedCategory && (

        <button
        type="button"
        onClick={() => {
            setName("")
            setParent("")
            setProperties([])
            setEditedCategory(null)
            router.push("/categories")
          }}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 cursor-pointer"
        >
        Cancel
        </button>
    )}

    </div>

    </form>

    </div>

    </div>

    <div className="mt-2">
    {!editedCategory && (

   
    <table className="products">

    <thead>

    <tr>
    <th>Name</th>
    <th>Parent</th>
    <th>Action</th>
    </tr>

    </thead>

    <tbody>

    {categories.map(cat=>{

    const parent = categories.find(c=>c._id === cat.parent)

    return(

    <tr key={cat._id} className="border-t hover:bg-gray-50">

    <td>
    {cat.name}
    </td>

    <td>
    {parent?.name || "-"}
    </td>

    <td>

    <button
    onClick={()=>editCategory(cat)}
    className="btn-edit"
    >
    Edit
    </button>

    <button
    onClick={()=>setCategoryToDelete(cat)}
    className="btn-delete"
    >
    Delete
    </button>

    </td>

    </tr>

    )

    })}

    </tbody>

    </table>
    )}
    {categoryToDelete && (
          <ConfirmModal
            title={`Delete "${categoryToDelete.name}" ?`}
            onConfirm={()=>deleteCategory(categoryToDelete._id)}
            onCancel={()=>setCategoryToDelete(null)}
          />
    )}
    </div>

</Layout>

)

}