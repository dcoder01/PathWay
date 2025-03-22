import React, { useEffect, useState } from 'react'

import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import { Loader, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { login, register } from '@/store/authSlice'

const Login = () => {

    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const { loading, user } = useSelector((state) => state.authSlice);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        dispatch(login(input)).then((data) => {


            if (data?.payload?.success) {
                toast.success("Logged in successfully");
                navigate('/home')
            } else {
                toast.error(data?.payload || "SLogin failed! Try again.");
            }
        });

    }

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md p-6 border border-gray-200 rounded-md shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign in to your account</h1>
                    <p className="mt-2">
                        Don't have an account
                        <Link className="font-medium ml-2 text-primary hover:underline" to="/auth/login">
                            Login
                        </Link>
                    </p>
                </div>

                <form onSubmit={submitHandler} className="space-y-4">
                  
                    <div>
                        <Label className="mb-2">Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="d@gmail.com"
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Abc@123"
                        />
                    </div>

                    {loading ? (
                        <Button className="w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full cursor-pointer">
                            Login
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );

}

export default Login