import React, { useEffect, useState } from 'react'

import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { RadioGroup } from '../../components/ui/radio-group'
import { Button } from '../../components/ui/button'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux'

import { Loader, Loader2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { logout, register } from '@/store/authSlice'

const Register = () => {

    const [input, setInput] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector((state) => state.authSlice);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        dispatch(register(input)).then((data) => {


            if (data?.payload?.success) {
                toast.success("signed up successfully! waitng for approval.");
                setTimeout(() => {
                    dispatch(logout());
                  }, 1500);
            } else {
                toast.error(data?.payload || "Signup failed! Try again.");
            }
        });

    }

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-md p-6 border border-gray-200 rounded-md shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign Up into your Account</h1>
                    <p className="mt-2">
                        Already have an account?
                        <Link className="font-medium ml-2 text-primary hover:underline" to="/auth/login">
                            Login
                        </Link>
                    </p>
                </div>
    
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <Label className="mt-2 mb-2">Full Name</Label>
                        <Input
                            type="text"
                            value={input.name}
                            name="name"
                            onChange={changeEventHandler}
                            placeholder="Debajyoti"
                        />
                    </div>
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
                    <div className='flex items-center justify-between'>
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="coordinator"
                                    checked={input.role === 'coordinator'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Coordinator</Label>
                            </div>
                        </RadioGroup>
                       
                    </div>
    
                    {loading ? (
                        <Button className="w-full">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full cursor-pointer">
                            Signup
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
    
}

export default Register