import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import InputField from './InputField';
import Button from './Button';
import Logo from './Logo';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have the necessary tokens from the email link
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        if (error.message.includes('not configured')) {
          setError('Password reset service is not configured yet. Please contact support.');
        } else {
          setError(error.message);
        }
      } else {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="px-6 py-8 bg-slate-900 flex flex-col items-center">
              <Logo className="h-24 w-24 mb-1" />
              <p className="text-slate-300 text-sm">Inventory Management System</p>
            </div>
            
            <div className="px-6 sm:px-8 py-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold text-slate-800 mb-4">Password Updated!</h1>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                Your password has been successfully updated. You'll be redirected to the login page shortly.
              </p>
              
              <Button
                type="button"
                variant="primary"
                fullWidth
                onClick={() => navigate('/')}
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-slate-200 to-transparent z-0" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="px-6 py-8 bg-slate-900 flex flex-col items-center">
            <Logo className="h-24 w-24 mb-1" />
            <p className="text-slate-300 text-sm">Inventory Management System</p>
          </div>
          
          <div className="px-6 sm:px-8 py-8">
            <div className="flex items-center mb-6">
              <div className="mr-3 p-2 bg-teal-100 rounded-lg">
                <Lock className="h-5 w-5 text-teal-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Set New Password</h1>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
                <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <InputField
                  label="New Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff size={18} className="transition-all" /> : 
                    <Eye size={18} className="transition-all" />
                  }
                </button>
              </div>
              
              <div className="relative">
                <InputField
                  label="Confirm New Password"
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 
                    <EyeOff size={18} className="transition-all" /> : 
                    <Eye size={18} className="transition-all" />
                  }
                </button>
              </div>
              
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
                Password must be at least 6 characters long
              </div>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
              >
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;