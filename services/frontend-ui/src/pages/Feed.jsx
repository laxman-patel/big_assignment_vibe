import { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:3004/feed');
            setPosts(res.data);
        } catch (error) {
            console.error('Error fetching feed:', error);
        }
    };

    useEffect(() => {
        if (!username) {
            navigate('/login');
            return;
        }
        fetchPosts();

        // Track feed view
        axios.post('http://localhost:3005/track', {
            event: 'FeedViewed',
            data: { username }
        });
    }, [username, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Home</h1>
                    <div className="flex items-center gap-4">
                        <span>@{username}</span>
                        <Button variant="outline" onClick={handleLogout}>Logout</Button>
                    </div>
                </div>

                <CreatePost onPostCreated={fetchPosts} />

                <div className="space-y-4">
                    {posts.map((post) => (
                        <Card key={post.id}>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <span className="font-bold">@{post.authorId}</span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(post.timestamp).toLocaleString()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-wrap mb-4">{post.content}</p>
                                {post.mediaUrl && (
                                    <img
                                        src={post.mediaUrl}
                                        alt="Post attachment"
                                        className="rounded-lg max-h-96 w-full object-cover"
                                    />
                                )}
                                {post.isRecommended && (
                                    <div className="mt-2 text-xs text-blue-500 font-semibold">
                                        Recommended for you
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
