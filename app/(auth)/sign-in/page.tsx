'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import * as z  from "zod"
import Link from "next/link"
import { JSX, useEffect, useState } from "react"
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"
import { signinSchema } from "@/src/schemas/signinSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/src/types/ApiResponse"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

const page = (): JSX.Element => {
  const [isSubmitting,setisSubmitting] = useState(false)

  const router = useRouter()
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver:zodResolver(signinSchema),
    defaultValues:{
      identifier: '',
      password: ''
    }
  })

  const onsubmit = async (data: z.infer<typeof signinSchema>) => {
    const result = await signIn('credentials',{
      redirect:false,
      identifier : data.identifier,
      password: data.password
    })
    if(result?.error){
      toast(
        "Login Failed",
        {
          description: "Incorrect username or password",
        }
      )
    }
    if(result?.url) {
      router.replace("/dashboard")
    }
  }

  return (
   <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          join Anonymous Chat
        </h1>
        <p className="mb-4">Sign in here</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)}
        className="space-y-6">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                  <Input placeholder="email/username" 
                  {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input type = "password" placeholder="password" 
                  {...field}
                 />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            Sign in
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Already a member?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
   </div>
  )
}

export default page

