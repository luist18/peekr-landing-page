
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import type { JoinWaitlistInput, WaitlistResponse } from '../../server/src/schema';

function App() {
  const [waitlistCount, setWaitlistCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState<JoinWaitlistInput>({
    email: '',
    name: null,
    company: null
  });

  const loadWaitlistCount = useCallback(async () => {
    try {
      const result = await trpc.getWaitlistCount.query();
      setWaitlistCount(result.count);
    } catch (error) {
      console.error('Failed to load waitlist count:', error);
    }
  }, []);

  useEffect(() => {
    loadWaitlistCount();
  }, [loadWaitlistCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response: WaitlistResponse = await trpc.joinWaitlist.mutate(formData);
      if (response.success) {
        setSubmitted(true);
        setMessage(response.message);
        loadWaitlistCount(); // Refresh count
        // Reset form
        setFormData({
          email: '',
          name: null,
          company: null
        });
      } else {
        setMessage(response.message);
      }
    } catch (error) {
      console.error('Failed to join waitlist:', error);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-slate-900">peekr</div>
          <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
            {waitlistCount} on waitlist
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 max-w-4xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-6xl font-bold text-slate-900 mb-8 leading-tight">
            Monitor your API calls
            <br />
            <span className="text-blue-600">before they break</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get real-time observability, monitoring, and alerting for slow requests 
            and rate limiting errors across all your third-party API integrations.
          </p>

          {/* Waitlist Form */}
          <Card className="max-w-md mx-auto border-slate-200 shadow-sm">
            <CardContent className="p-8">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Join the waitlist
                    </h3>
                  </div>
                  
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev: JoinWaitlistInput) => ({ ...prev, email: e.target.value }))
                    }
                    className="border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                    required
                  />
                  
                  <Input
                    placeholder="Your name (optional)"
                    value={formData.name || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev: JoinWaitlistInput) => ({
                        ...prev,
                        name: e.target.value || null
                      }))
                    }
                    className="border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                  />
                  
                  <Input
                    placeholder="Company (optional)"
                    value={formData.company || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev: JoinWaitlistInput) => ({
                        ...prev,
                        company: e.target.value || null
                      }))
                    }
                    className="border-slate-200 focus:border-blue-600 focus:ring-blue-600"
                  />
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                  >
                    {isLoading ? 'Joining...' : 'Get early access'}
                  </Button>
                  
                  {message && !submitted && (
                    <p className="text-sm text-red-600 text-center">{message}</p>
                  )}
                </form>
              ) : (
                <div className="text-center py-4">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    You're on the list!
                  </h3>
                  <p className="text-slate-600 text-sm">{message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="py-20 border-t border-slate-100">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Real-time Monitoring</h3>
              <p className="text-slate-600">
                Track API performance and catch issues before they impact your users.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h11a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Alerts</h3>
              <p className="text-slate-600">
                Get notified instantly when APIs are slow or hitting rate limits.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Deep Analytics</h3>
              <p className="text-slate-600">
                Understand usage patterns and optimize your API integrations.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-12 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-slate-900 font-bold text-xl mb-2">peekr</div>
          <p className="text-slate-500 text-sm">
            API observability made simple. Coming soon.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
