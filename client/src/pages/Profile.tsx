import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Camera, Save, ArrowLeft } from 'lucide-react';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  profileImage?: string;
  location?: {
    county?: string;
    subCounty?: string;
  };
  mpesaNumber?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    county: '',
    subCounty: '',
    mpesaNumber: '',
  });

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.users.getMyProfile();
      const user = res.data.user;
      setProfile(user);
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        county: user.location?.county || '',
        subCounty: user.location?.subCounty || '',
        mpesaNumber: user.mpesaNumber || '',
      });
    } catch (err) {
      console.error('Failed to load profile', err);
      toast({ title: 'Error', description: 'Failed to load profile', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please select an image file', variant: 'destructive' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Image size must be less than 5MB', variant: 'destructive' });
      return;
    }

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      const uploadRes = await api.upload.profileImage(formDataUpload);
      const imageUrl = uploadRes.data.imageUrl;

      // Update profile with new image URL
      const updateRes = await api.users.updateMyProfile({ profileImage: imageUrl });
      setProfile(updateRes.data.user);
      
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.profileImage = imageUrl;
      localStorage.setItem('user', JSON.stringify(userData));

      toast({ title: 'Success', description: 'Profile image updated successfully' });
    } catch (err) {
      console.error('Failed to upload image', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to upload image', 
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        location: {
          county: formData.county,
          subCounty: formData.subCounty,
        },
        mpesaNumber: formData.mpesaNumber,
      };

      const res = await api.users.updateMyProfile(updateData);
      setProfile(res.data.user);
      
      // Update localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.name = res.data.user.name;
      userData.phone = res.data.user.phone;
      localStorage.setItem('user', JSON.stringify(userData));

      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (err) {
      console.error('Failed to update profile', err);
      toast({ 
        title: 'Error', 
        description: err.response?.data?.message || 'Failed to update profile', 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24">
        <div className="container mx-auto px-4">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24">
        <div className="container mx-auto px-4">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 pt-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Click on the avatar to change your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-32 w-32 cursor-pointer" onClick={handleImageClick}>
                <AvatarImage src={profile.profileImage} alt={profile.name} />
                <AvatarFallback className="text-3xl">
                  {profile.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div 
                className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors"
                onClick={handleImageClick}
              >
                <Camera className="h-4 w-4 text-white" />
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              aria-label="Upload profile picture"
            />
            {uploading && <p className="mt-2 text-sm text-muted-foreground">Uploading...</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="254712345678"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="county">County</Label>
                <Input
                  id="county"
                  name="county"
                  value={formData.county}
                  onChange={handleInputChange}
                  placeholder="e.g., Nairobi"
                />
              </div>
              <div>
                <Label htmlFor="subCounty">Sub County</Label>
                <Input
                  id="subCounty"
                  name="subCounty"
                  value={formData.subCounty}
                  onChange={handleInputChange}
                  placeholder="e.g., Westlands"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mpesaNumber">M-Pesa Number</Label>
              <Input
                id="mpesaNumber"
                name="mpesaNumber"
                value={formData.mpesaNumber}
                onChange={handleInputChange}
                placeholder="254712345678"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Used for receiving payments and withdrawals
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
