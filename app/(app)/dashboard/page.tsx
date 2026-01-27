'use client'

import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, RefreshCcw } from 'lucide-react'
import { Messsage } from '@/src/model/user.model'
import { acceptMessageSchema } from '@/src/schemas/acceptMessageSchema'
import { ApiResponse } from '@/src/types/ApiResponse'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import MessageCard from '@/components/MessageCard'
import { User } from 'next-auth'

const DashboardPage = () => {
  const { data: session } = useSession()

  const [messages, setMessages] = useState<Messsage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')

  const hasFetched = useRef(false)

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessages: false,
    },
  })

  const { watch, setValue, getValues } = form
  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = (messageId: string) => {
    setMessages(prev =>
      prev.filter(msg => msg._id.toString() !== messageId)
    )
  }
  const fetchAcceptMessage = async () => {
    setIsSwitchLoading(true)
    try {
      const res = await axios.get<ApiResponse>('/api/acceptmessage')
      setValue('acceptMessages', res.data.isAcceptingMessages ?? false)
      return res.data.isAcceptingMessages
    } catch {
      toast.error('Failed to fetch message settings')
      return false
    } finally {
      setIsSwitchLoading(false)
    }
  }

  const fetchMessages = async (refresh = false) => {
    setIsLoading(true)
    try {
      const res = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(Array.isArray(res.data.messages) ? res.data.messages : [])

      if (refresh) toast.success('Showing latest messages')
    } catch {
      toast.error('Failed to fetch messages')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwitchChange = async (checked: boolean) => {
    setIsSwitchLoading(true)
    try {
      const res = await axios.post<ApiResponse>(
        '/api/acceptmessage',
        { acceptMessages: checked }
      )

      setValue('acceptMessages', checked)

      if (!checked) setMessages([])

      toast.success(res.data.message)
    } catch {
      toast.error('Failed to update settings')
    } finally {
      setIsSwitchLoading(false)
    }
  }
  useEffect(() => {
    if (!session?.user || hasFetched.current) return

    hasFetched.current = true

    setBaseUrl(
      `${window.location.protocol}//${window.location.host}`
    )

    ;(async () => {
      const isAccepting = await fetchAcceptMessage()
      if (isAccepting) {
        fetchMessages()
      }
    })()
  }, [session?.user])

  if (!session?.user) {
    return <div className="p-6 text-center">Please login</div>
  }

  const username = (session.user as User)?.username
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success('Profile URL copied')
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-6">User's Dashboard</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Copy Your Link and open a new tab</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="border w-full p-2 rounded"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <Switch
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span>
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>

      <Separator />

      {acceptMessages && (
        <Button
          className="mt-4"
          onClick={() => fetchMessages(true)}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      )}

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {!acceptMessages ? (
          <p className="text-gray-500">
            Message receiving is turned OFF
          </p>
        ) : messages.length > 0 ? (
          messages.map(msg => (
            <MessageCard
              key={msg._id.toString()}
              message={{ ...msg, _id: msg._id.toString() }}
              onmessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display</p>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
