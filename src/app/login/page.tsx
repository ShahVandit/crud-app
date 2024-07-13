"use client";

import { useCallback, useState } from "react";
import { verify } from "jsonwebtoken"
import { parse } from "cookie";
import Cookies from 'js-cookie';
import { toast, Toaster } from "react-hot-toast";
import SubmitButton from "@/components/SubmitButton"
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const submitLogin = async() => {
        // e.preventDefault();
        console.log("Submit clicked");
        const body = { username, password };
        if(!username || !password) toast.error("Fill in all fields")        
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            
            if (response.status === 200) {
                const json=await response.json()
                Cookies.set('authToken', json.token)
                localStorage.setItem('user', json.user.role)
                // const userDataString=typeof userData==='string' ? userData:'';
                if(json.user.role=='user'){
                    router.push('/dashboard');
                } else{
                    router.push('/login');
                }
            } else{
                const errormsg=await response.json()
                toast.error(errormsg.msg)
            }
        } catch (e) {
            console.log(e)
            toast.error("Failed to connect");
        }
    }
    
    return (
        <>
            <Toaster />
            <div className="bg-gray-100 flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                    <form action={submitLogin}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-semibold mb-2">Email</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.currentTarget.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-semibold mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <label className="inline-flex items-center">
                                    <input type="checkbox" className="form-checkbox" />
                                    <span className="ml-2 text-gray-700">Remember me</span>
                                </label>
                            </div>
                            <a href="#" className="text-blue-500 hover:underline">Forgot password?</a>
                        </div>
                        <SubmitButton />
                    </form>
                    <p className="mt-4 text-center">
                        Don&apos;t have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign Up</a>
                    </p>
                </div>
            </div>
        </>
    );
}
