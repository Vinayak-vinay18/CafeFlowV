import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { MdCoffee, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

const Login = () => {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@cafeflow.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);

  if (!loading && isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email');
      return;
    }
    setForgotSubmitting(true);
    try {
      const res = await authService.forgotPassword(forgotEmail);
      toast.success(res.data.message || 'Reset instructions sent');
      setForgotMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-orange-light px-4 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-300/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md glass rounded-3xl shadow-2xl p-8 sm:p-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-orange-gradient flex items-center justify-center text-white shadow-soft mb-4">
            <MdCoffee size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">CafeFlow</h1>
          <p className="text-sm text-gray-500 mt-1">Smart Cafe Billing & Management System</p>
        </div>

        {!forgotMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-text">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@cafeflow.com"
                  className="input-field pl-10"
                />
              </div>
            </div>
            <div>
              <label className="label-text">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setForgotMode(true)}
                className="text-xs text-primary-600 font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center flex">
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>

            <p className="text-center text-xs text-gray-400 pt-2">
              Demo credentials: admin@cafeflow.com / Admin@123
            </p>
          </form>
        ) : (
          <form onSubmit={handleForgot} className="space-y-4">
            <p className="text-sm text-gray-500">
              Enter your registered email address and we'll send you reset instructions.
            </p>
            <div>
              <label className="label-text">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@cafeflow.com"
                  className="input-field pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={forgotSubmitting} className="btn-primary w-full justify-center flex">
              {forgotSubmitting ? 'Sending...' : 'Send Reset Instructions'}
            </button>
            <button
              type="button"
              onClick={() => setForgotMode(false)}
              className="text-xs text-gray-500 hover:underline w-full text-center block"
            >
              Back to Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Login;
