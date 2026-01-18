'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import * as z  from "zod"
import Link from "next/link"
import { JSX, useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signupSchema } from "@/src/schemas/signupSchema"
import axios,{AxiosError} from 'axios'
import { ApiResponse } from "@/src/types/ApiResponse"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

const page = (): JSX.Element => {
  const [username , setUsername] = useState('')
  const [usernamemessage,setUsernamemessage] = useState('')
  const [isCheckingUsername , setisCheckingUsername] = useState(false)
  const [isSubmitting,setisSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername,500)
  const router = useRouter()
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver:zodResolver(signupSchema),
    defaultValues:{
      username: '',
      email: '',
      password: ''
    }
  })

useEffect(() => {
  const checkusernameUnique = async () => {
    if (username){

    setisCheckingUsername(true);
    setUsernamemessage('');

    try {
      const response = await axios.get(
        `/api/check-username-unique?username=${username}`
      );
      setUsernamemessage(response.data.message);
    } catch (error) {
      const axioserrors = error as AxiosError<ApiResponse>;
      setUsernamemessage(
        axioserrors.response?.data.message ?? "Error checking username"
      );
    } finally {
      setisCheckingUsername(false);
    }
   }
  };
  checkusernameUnique();
}, [username]);

  const onsubmit = async (data: z.infer<typeof signupSchema>) => {
  setisSubmitting(true)
  try {
    const response = await axios.post<ApiResponse>('/api/sign-up', data)

    if (!response.data.success) {
      throw new Error(response.data.message)
    }
  toast(
  "Signup Successful",  
  {
    description: "Please check your email to verify your account."
  }
)
    router.replace(`/verify/${data.username}`)
  } catch (error) {
    const axioserror = error as AxiosError<ApiResponse>
    toast.error(
      axioserror.response?.data?.message || 'Signup failed'
    )
  } finally {
    setisSubmitting(false)
  }
}
  return (
   <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
         join Anonymous Chat
        </h1>
        <p className="mb-4">Sign up here</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onsubmit)}
        className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    debounced(e.target.value)
                  }} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" 
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
            {
              isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                Please wait
                </>
              ) : ('Signup')
            }
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

