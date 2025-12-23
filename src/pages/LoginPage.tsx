import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const passwordType = useMemo(() => (showPassword ? 'text' : 'password'), [showPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiLogin({ email, password });
      login(data.token, data.user);
      const redirectTo = location.state?.from?.pathname || '/admin';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--offwhite)]">
      <div className="min-h-screen grid lg:grid-cols-2">
        <div className="hidden lg:block relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-black/70" />
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  'url(https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?q=80&w=1920&auto=format&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,177,47,0.25),transparent_60%)]" />
          </div>

          <div className="relative h-full p-16 flex flex-col justify-between">
            <div>
              <div className="text-white/90 text-xs font-semibold tracking-[0.28em] uppercase">
                ADAH Creatives
              </div>
              <div className="mt-10 max-w-lg">
                <h1 className="serif text-5xl text-white leading-tight">
                  Admin Portal
                </h1>
                <p className="mt-5 text-white/70 leading-relaxed">
                  Sign in to manage projects and update page content while keeping the live site elegant and consistent.
                </p>
              </div>
            </div>

            <div className="text-white/50 text-xs tracking-wide">
              Protected area. Authorized access only.
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <img
                src="/images/logo.png"
                srcSet="/images/logo.png 1x, /images/logo@2x.png 2x"
                alt="Adah Creatives"
                className="mx-auto h-16 w-auto"
              />
              <p className="mt-4 text-[11px] text-gray-500 font-semibold tracking-[0.28em] uppercase">
                Admin Portal
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)] p-7 sm:p-8">
              <div className="text-center">
                <h2 className="serif text-3xl text-black tracking-wide">Sign In</h2>
                <p className="mt-2 text-sm text-gray-500">Enter your credentials to continue.</p>
              </div>

              {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    Email
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black text-sm transition-colors outline-none"
                      placeholder="admin@adah.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    Password
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={passwordType}
                      autoComplete="current-password"
                      required
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black/20 focus:border-black text-sm transition-colors outline-none"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-black transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-semibold tracking-wide text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black/30 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Adah Creatives
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
