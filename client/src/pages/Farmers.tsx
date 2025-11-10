import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Farmer {
  _id: string;
  name: string;
  email?: string;
  location?: {
    county: string;
    subCounty?: string;
  };
  rating?: number;
  profileImage?: string;
}

const Farmers = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedFarmers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await apiClient.get('/users/saved-farmers');
        setFarmers(response.data.savedFarmers || []);
      } catch (err) {
        console.error('Failed to fetch saved farmers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedFarmers();
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return farmers;
    return farmers.filter(f => 
      f.name.toLowerCase().includes(q) ||
      (f.location?.county || '').toLowerCase().includes(q) ||
      (f.location?.subCounty || '').toLowerCase().includes(q) ||
      (f.email || '').toLowerCase().includes(q)
    );
  }, [query, farmers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Find Farmers</h1>
            <p className="text-sm text-gray-600">Search and discover local farmers near you.</p>
          </div>
          <div className="w-80">
            <label htmlFor="farmer-search" className="sr-only">Search farmers</label>
            <div className="flex items-center space-x-2">
              <Input
                id="farmer-search"
                placeholder="Search by name, location, or produce"
                value={query}
                onChange={e => setQuery(e.target.value)}
                aria-label="Search farmers"
              />
              <Button onClick={() => { /* noop, input handles it */ }}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading your saved farmers...</div>
        ) : farmers.length === 0 && !query ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">You haven't saved any farmers yet.</p>
            <p className="text-sm">Place an order to automatically save farmers you've bought from!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.length === 0 && query && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No farmers found for "{query}".
              </div>
            )}

            {results.map(f => {
              const locationStr = f.location ? `${f.location.county}${f.location.subCounty ? ', ' + f.location.subCounty : ''}` : 'Location not specified';
              return (
                <Card key={f._id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{f.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-500">{locationStr}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Rating: {f.rating ?? '—'}</div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" onClick={() => navigate(`/farmers/${f._id}`)}>View Profile</Button>
                        <Button onClick={() => alert('Message farmer feature coming soon')}>Message</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Farmers;
