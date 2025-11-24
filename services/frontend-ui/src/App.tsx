import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Send, User, MessageSquare, Heart, Repeat } from 'lucide-react'
import { authApi, postApi } from '@/lib/api'

// Types
interface Post {
  id: string
  content: string
  author: string
  timestamp: string
  likes: number
  comments: number
}

interface User {
  username: string
  email?: string
  token?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [view, setView] = useState<'login' | 'signup' | 'feed'>('login')
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')

  // Auth State
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  // Check for existing token
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUsername = localStorage.getItem('username')
    if (token && savedUsername) {
      setUser({ username: savedUsername, token })
      setView('feed')
    }
  }, [])

  // Fetch posts when entering feed
  useEffect(() => {
    if (view === 'feed') {
      fetchPosts()
    }
  }, [view])

  const fetchPosts = async () => {
    try {
      const response = await postApi.get('/posts')
      setPosts(response.data)
    } catch (err) {
      console.error('Failed to fetch posts', err)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await authApi.post('/login', { username, password })
      const { token, username: userUsername } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('username', userUsername)

      setUser({ username: userUsername, token })
      setView('feed')
    } catch (err) {
      setError('Invalid credentials')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await authApi.post('/signup', { username, password })
      const { token, username: userUsername } = response.data

      localStorage.setItem('token', token)
      localStorage.setItem('username', userUsername)

      setUser({ username: userUsername, token })
      setView('feed')
    } catch (err) {
      setError('Signup failed. Username might be taken.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    setUser(null)
    setView('login')
    setUsername('')
    setPassword('')
    setEmail('')
  }

  const handleCreatePost = async () => {
    if (!newPost.trim()) return

    try {
      await postApi.post('/posts', {
        content: newPost,
        authorId: user?.username // Sending username as authorId for now
      })
      setNewPost('')
      fetchPosts() // Refresh feed
    } catch (err) {
      console.error('Failed to create post', err)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {view === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {view === 'login'
                ? 'Enter your credentials to access your account'
                : 'Enter your details to create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={view === 'login' ? handleLogin : handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {view === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  // Email is optional in auth-service for now, but good for UI
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full">
                {view === 'login' ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => {
                setView(view === 'login' ? 'signup' : 'login')
                setError('')
              }}
            >
              {view === 'login'
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              V
            </div>
            Vibe
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              {user.username}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Create Post */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <Textarea
                  placeholder="What's happening?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-lg"
                />
                <div className="flex justify-end border-t pt-4">
                  <Button onClick={handleCreatePost} disabled={!newPost.trim()}>
                    <Send className="mr-2 h-4 w-4" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
                  <AvatarFallback>{post.author[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{post.author}</span>
                    <span className="text-muted-foreground text-sm">@{post.author}</span>
                    <span className="text-muted-foreground text-sm">· {new Date(post.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 pl-[4.5rem]">
                <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </CardContent>
              <CardFooter className="pl-[4.5rem] pb-4 pt-2">
                <div className="flex gap-6 text-muted-foreground">
                  <button className="flex items-center gap-2 hover:text-primary transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                    <Heart className="h-4 w-4" />
                    <span className="text-xs">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                    <Repeat className="h-4 w-4" />
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
