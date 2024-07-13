"use client"

import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import {z} from "zod" 
import toast, { Toaster } from "react-hot-toast";
import SubmitButton from "@/components/SubmitButton";

type formElement={
    email: string,
    fname: string,
    lname: string,
    password: string,
    age:number
}

type ErrorType = {
    fname?: { _errors: string[] };
    lname?: { _errors: string[] };
    email?: { _errors: string[] };
    age?: { _errors: string[] };
    password?: { _errors: string[] };
    confirm_password?: { _errors: string[] };
  };

export default function SignupPage(){
    const router=useRouter()
    const [fname, setfname]=useState("")
    const [lname, setlname]=useState("")
    const [email, setemail]=useState("")
    const [age, setage]=useState(0)
    const [password, setpassword]=useState("")
    const [errors, seterrors]=useState<ErrorType>({})
    const [confirm_password, setconfirm_password]=useState("")
    const bodyContent={fname, lname, age, password,email,confirm_password}
    const submitForm=async()=>{
        const form_result=createUserFormSchema.safeParse(bodyContent);
        if(!form_result.success){
            seterrors(form_result.error.format())
            return
        }
        try{
            const response = await fetch("api/signup",{
                method:"POST",
                headers: { "Content-Type": "application/json" },
                body:JSON.stringify(bodyContent),
            })
            if(response.status===200){
                router.push('/login')
            } else{
                const rep=await response.json()
                console.log(response)
                toast.error(rep.msg)
            }
        } catch(e){
            console.log(e)
            toast.error("Server Error")
        }
    }
    return(
        <>
        <Toaster/>
        <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form action={submitForm}>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">First Name</label>
                <input type="text" id="name"  value={fname} onChange={(e)=>{setfname(e.currentTarget.value)}} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"/>
                {errors.fname &&errors.fname._errors && <div className="text-destructive">{errors.fname._errors[0]}</div>}
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
                <input type="text" id="name" value={lname} onChange={(e)=>{setlname(e.currentTarget.value)}} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"/>
                {errors.lname && errors.lname._errors && <div className="text-destructive">{errors.lname._errors[0]}</div>}
            </div>
            <div className="mb-4">
                <label  className="block text-gray-700 font-semibold mb-2">Email</label>
                <input type="email" id="email" value={email} onChange={(e)=>{setemail(e.currentTarget.value)}} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"/>
                {errors.email && errors.email._errors && <div className="text-destructive">{errors.email._errors[0]}</div>}
            </div>
            <div className="mb-4">
                <label  className="block text-gray-700 font-semibold mb-2">Age</label>
                <input type="number" id="age" name="age"value={age} onChange={(e)=>{setage(e.currentTarget.valueAsNumber)}} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"/>
                {errors.age && errors.age._errors && <div className="text-destructive">{errors.age._errors[0]}</div>}
            </div>
            <div className="mb-4">
                <label  className="block text-gray-700 font-semibold mb-2">Password</label>
                <input type="password" id="password" name="password" value={password} onChange={(e)=>{setpassword(e.currentTarget.value)}} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500" required/>
                {errors.password && errors.password._errors[0] && <div className="text-destructive">{errors.password._errors[0]}</div>}
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
                <input type="password" id="confirm_password"value={confirm_password} onChange={(e)=>{setconfirm_password(e.currentTarget.value)}} name="confirm_password" className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500" required/>
                {errors.confirm_password && errors.confirm_password._errors[0] && <div className="text-destructive">{errors.confirm_password._errors[0]}</div>}
            </div>
            <SubmitButton/>
        </form>
        <p className="mt-4 text-center">
            Already have an account? <a href="/login" className="text-blue-500 hover:underline">Sign In</a>
        </p>
    </div>
    </>
    )
}

const createUserFormSchema = z.object({
    fname: z.string().nonempty("Name is required").regex(/^[A-Za-z]+$/i, "Only letters are allowed"),
    lname: z.string().nonempty("Name is required").regex(/^[A-Za-z]+$/i, "Only letters are allowed"),
    password: z.string().nonempty("Password is required"),

    confirm_password: z.string().nonempty("Confirm password is required"),
    age:z.number().min(10, "Age must be greater than 10")
  })
  .refine(({ password, confirm_password}) => password === confirm_password, {
    message: "Password doesn't match",
    path: ["confirm_password"]
  })

//   const SubmitButton = () => {
//     const { pending } = useFormStatus();
    
//     return (
//         <>
//             <button
//                 className={`w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ${pending ? "opacity-50 cursor-not-allowed" : ""}`}
//                 disabled={pending}
//                 type="submit"
//             >
//                 {pending ? "Submitting.." : "Submit"}
//             </button>
//         </>
//     );
// };
