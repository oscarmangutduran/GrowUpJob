import { useState } from 'react';
import { Mail, Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center md:justify-end bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url("/bg-login.jpg")' }}
    >
      {/* Overlay for slightly darkening the background image if needed */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Glassmorphism Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md h-full md:h-auto min-h-screen md:min-h-[85vh] md:mr-[10%] bg-black/40 backdrop-blur-xl md:rounded-3xl border border-white/20 shadow-2xl flex flex-col justify-center px-8 py-10 relative z-10"
      >
        <h1 className="text-4xl font-bold text-white text-center mb-10 tracking-tight">Login</h1>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLoginSuccess(); }}>
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90 ml-1">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                placeholder="Ingresa tu correo" 
                className="w-full bg-white rounded-xl py-3.5 pl-12 pr-4 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#E31B23] focus:outline-none transition-shadow font-medium"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90 ml-1">Contraseña</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Ingresa tu contraseña" 
                className="w-full bg-white rounded-xl py-3.5 pl-12 pr-12 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#E31B23] focus:outline-none transition-shadow font-medium"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-start">
            <a href="#" className="text-sm text-white/70 hover:text-white transition-colors italic">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Divider */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="flex-shrink-0 mx-4 text-white/60 text-sm">o continúa con</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          {/* Social Login Button */}
          <button type="button" className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl py-3.5 transition-all font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-white/70">
              ¿No tienes una cuenta? <br />
              <a href="#" className="text-white font-semibold hover:underline">Regístrate aquí</a>
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#E31B23] hover:bg-[#C9161D] text-white rounded-xl py-4 font-bold flex items-center justify-center gap-2 mt-8 shadow-lg shadow-red-900/50 transition-colors"
          >
            Ingresar <span className="text-lg">→</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
