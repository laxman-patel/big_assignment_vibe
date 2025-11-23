import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, ShoppingCart, Database, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(false)

    const products = [
        { id: 'prod-1', name: 'MacBook Pro', price: '$1999' },
        { id: 'prod-2', name: 'iPhone 15', price: '$999' },
        { id: 'prod-3', name: 'Sony XM5', price: '$349' },
        { id: 'prod-4', name: 'Dell UltraSharp', price: '$599' },
        { id: 'prod-5', name: 'Keychron Q1', price: '$199' },
    ]

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/product/stats')
            const data = await res.json()
            // Transform for Recharts
            const formatted = data.map(d => ({
                name: products.find(p => p.id === d.ProductId)?.name || d.ProductId,
                clicks: d.ClickCount
            })).sort((a, b) => b.clicks - a.clicks)
            setStats(formatted)
        } catch (e) {
            console.error("Failed to fetch stats", e)
        }
    }

    const handleClick = async (productId) => {
        try {
            await fetch('/api/ingest/click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, userId: `user-${Math.floor(Math.random() * 1000)}` })
            })
            // Optimistic update or just wait for poll
        } catch (e) {
            console.error("Click failed", e)
        }
    }

    const handleSeed = async () => {
        setLoading(true)
        try {
            await fetch('/api/product/seed', { method: 'POST' })
            alert("Database seeded!")
        } catch (e) {
            console.error("Seed failed", e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const interval = setInterval(fetchStats, 2000)
        fetchStats()
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-background p-8 text-foreground">
            <div className="mx-auto max-w-6xl space-y-8">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">Clickstream Analyzer</h1>
                        <p className="text-muted-foreground">Real-time cross-cloud analytics dashboard</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={handleSeed} disabled={loading}>
                            <Database className="mr-2 h-4 w-4" />
                            {loading ? 'Seeding...' : 'Seed Data'}
                        </Button>
                        <Button>
                            <Activity className="mr-2 h-4 w-4" />
                            Live Status
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                    {/* Product Interaction Area */}
                    <Card className="col-span-3 border-zinc-800 bg-zinc-950/50">
                        <CardHeader>
                            <CardTitle>Simulate Traffic</CardTitle>
                            <CardDescription>Click products to generate Kafka events</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="flex items-center justify-between rounded-lg border border-zinc-800 p-4 transition-colors hover:bg-zinc-900">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <ShoppingCart className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-muted-foreground">{product.price}</p>
                                        </div>
                                    </div>
                                    <Button size="sm" onClick={() => handleClick(product.id)}>
                                        <Zap className="mr-2 h-3 w-3" />
                                        Click
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Analytics Chart */}
                    <Card className="col-span-4 border-zinc-800 bg-zinc-950/50">
                        <CardHeader>
                            <CardTitle>Real-Time Analytics</CardTitle>
                            <CardDescription>Top performing products (1-min window)</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
                                            itemStyle={{ color: '#fff' }}
                                            cursor={{ fill: '#27272a' }}
                                        />
                                        <Bar
                                            dataKey="clicks"
                                            fill="#fff"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    )
}

export default App
