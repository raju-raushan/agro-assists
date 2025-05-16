
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SectionTitle } from '@/components/SectionTitle';
import { MessageSquare, Send, ThumbsUp, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface Post {
  id: string;
  author: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  imageUrl?: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: 'Alice Farmer',
    avatarUrl: 'https://placehold.co/100x100.png',
    content: 'Just harvested my first batch of organic tomatoes! They look amazing. Any tips for storing them long-term?',
    timestamp: '2 hours ago',
    likes: 15,
    comments: 4,
    imageUrl: 'https://placehold.co/600x400.png',

  },
  {
    id: '2',
    author: 'Bob Agriculturist',
    avatarUrl: 'https://placehold.co/100x100.png',
    content: 'Dealing with some stubborn pests on my corn crop. Has anyone tried neem oil solutions? What was your experience?',
    timestamp: '5 hours ago',
    likes: 8,
    comments: 12,
  },
  {
    id: '3',
    author: 'Charlie Planter',
    avatarUrl: 'https://placehold.co/100x100.png',
    content: 'Excited to try out the new crop rotation plan suggested by AgriAssist. Hoping for better soil health this season!',
    timestamp: '1 day ago',
    likes: 22,
    comments: 6,
  },
];


export default function CommunityPage() {
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const { toast } = useToast();
  const { user } = useAuth(); // Get the authenticated user

  const handlePostSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
        toast({ title: "Empty Post", description: "Cannot submit an empty post.", variant: "destructive"});
        return;
    }
    if (!user) {
        toast({ title: "Not Logged In", description: "You must be logged in to post.", variant: "destructive"});
        return;
    }

    const newPost: Post = {
      id: String(Date.now()),
      author: user.name, // Use the logged-in user's name
      avatarUrl: 'https://placehold.co/100x100.png', // Default avatar for new posts
      content: newPostContent,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast({ title: "Post Submitted", description: "Your thoughts have been shared with the community!"});
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Farmer's Community Hub"
        description="Connect, share, and learn with fellow farmers."
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquare className="text-primary"/>Share Your Thoughts</CardTitle>
          <CardDescription>Post updates, ask questions, or share your farming experiences.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <Textarea
              placeholder="What's on your mind, farmer?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={4}
              className="text-base"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Send className="mr-2 h-4 w-4"/> Post to Community
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="text-2xl font-semibold text-primary">Community Feed</h3>
        {posts.map((post) => (
          <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-start gap-4">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={post.avatarUrl} alt={post.author} data-ai-hint="farmer profile"/>
                <AvatarFallback>{post.author.substring(0,1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{post.author}</CardTitle>
                <CardDescription>{post.timestamp}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 whitespace-pre-wrap mb-4">{post.content}</p>
              {post.imageUrl && (
                <div className="my-4 rounded-lg overflow-hidden border">
                   <Image src={post.imageUrl} alt="Post image" width={600} height={400} className="w-full object-cover max-h-96" data-ai-hint="community post"/>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-start gap-6 border-t pt-4">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <ThumbsUp className="mr-2 h-4 w-4" /> {post.likes} Likes
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <MessageCircle className="mr-2 h-4 w-4" /> {post.comments} Comments
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary ml-auto">
                Reply
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

