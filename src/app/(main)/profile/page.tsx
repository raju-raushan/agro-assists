"use client";

import { useState, type ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SectionTitle } from '@/components/SectionTitle';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Edit3, UploadCloud, Save } from 'lucide-react';

// Mock user data
const initialUserData = {
  name: "Alex Farmer",
  email: "alex.farmer@example.com",
  farmName: "Green Acres Farm",
  location: "Sonoma County, CA",
  bio: "Dedicated to sustainable farming and innovative agricultural practices. Specializing in organic produce.",
  profilePictureUrl: "https://placehold.co/200x200.png",
};

export default function ProfilePage() {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set initial preview if URL exists
    if (userData.profilePictureUrl) {
      setProfilePicturePreview(userData.profilePictureUrl);
    }
  }, [userData.profilePictureUrl]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // In a real app, you'd send this data to a backend
    console.log("Saving user data:", { ...userData, profilePictureUrl: profilePicturePreview });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been (mock) saved.",
    });
    if (profilePicturePreview) {
      setUserData(prev => ({...prev, profilePictureUrl: profilePicturePreview}));
    }
  };

  return (
    <div className="space-y-8">
      <SectionTitle title="User Profile" description="Manage your account details and preferences." />

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2"><UserCircle className="text-primary"/>{isEditing ? "Edit Profile" : userData.name}</CardTitle>
            <CardDescription>{userData.email}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="ml-auto">
            <Edit3 className="mr-2 h-4 w-4" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            <Avatar className="h-32 w-32 border-4 border-primary">
              <AvatarImage src={profilePicturePreview || undefined} alt={userData.name} data-ai-hint="person farming"/>
              <AvatarFallback>{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {isEditing && (
              <div className="w-full md:w-auto">
                <Label htmlFor="profilePicture" className="mb-2 block text-sm font-medium text-foreground">Profile Picture</Label>
                <div className="relative flex items-center justify-center w-full p-2 border-2 border-dashed rounded-md border-border hover:border-primary">
                   <UploadCloud className="w-6 h-6 mr-2 text-muted-foreground"/>
                   <span className="text-sm text-muted-foreground">Upload new image</span>
                  <Input id="profilePicture" type="file" onChange={handlePictureChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
                </div>
              </div>
            )}
          </div>

          {isEditing ? (
            <form className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={userData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={userData.email} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="farmName">Farm Name</Label>
                <Input id="farmName" name="farmName" value={userData.farmName} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={userData.location} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" value={userData.bio} onChange={handleInputChange} rows={4} />
              </div>
            </form>
          ) : (
            <div className="space-y-4 rounded-md border bg-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Farm Name</Label>
                  <p className="font-medium text-foreground">{userData.farmName || "Not set"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="font-medium text-foreground">{userData.location || "Not set"}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Bio</Label>
                <p className="font-medium text-foreground whitespace-pre-wrap">{userData.bio || "No bio set."}</p>
              </div>
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter>
            <Button onClick={handleSave} className="ml-auto bg-primary hover:bg-primary/90">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
