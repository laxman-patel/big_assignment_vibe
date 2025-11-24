import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image, Send } from 'lucide-react';

export default function CreatePost({ onPostCreated }) {
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content) return;

        setUploading(true);
        try {
            let mediaUrl = null;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                const uploadRes = await axios.post('http://localhost:3003/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                mediaUrl = uploadRes.data.url;
            }

            const authorId = localStorage.getItem('username') || 'anonymous';
            await axios.post('http://localhost:3002/posts', {
                content,
                authorId,
                mediaUrl
            });

            // Track event
            await axios.post('http://localhost:3005/track', {
                event: 'PostCreated',
                data: { authorId, hasMedia: !!mediaUrl }
            });

            setContent('');
            setFile(null);
            if (onPostCreated) onPostCreated();
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card className="mb-6">
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full p-2 bg-background text-foreground border rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="What's happening?"
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer p-2 hover:bg-accent rounded-full transition-colors">
                                <Image className="w-5 h-5 text-primary" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </label>
                            {file && <span className="text-sm text-muted-foreground">{file.name}</span>}
                        </div>
                        <Button type="submit" disabled={!content || uploading}>
                            {uploading ? 'Posting...' : <><Send className="w-4 h-4 mr-2" /> Post</>}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
