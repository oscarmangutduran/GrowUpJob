import { useState } from 'react';
import { Mail, Shield, Eye, EyeOff, User, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo, BrandText } from './Logo';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }: RegisterScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<'trabajador' | 'empresa'>('trabajador');

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center md:justify-end bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url("/bg-login.jpg")' }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20"></div>

      {/* Glassmorphism Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md h-full md:h-auto min-h-screen md:min-h-[90vh] md:mr-[10%] bg-black/40 backdrop-blur-xl md:rounded-3xl border border-white/20 shadow-2xl flex flex-col justify-center px-8 py-8 relative z-10 overflow-y-auto"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-8 bg-white/90 py-3 px-6 rounded-2xl shadow-sm mx-auto w-fit mt-8 md:mt-0">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <BrandText className="text-2xl" />
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onRegisterSuccess(); }}>
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/90 ml-1">Nombre completo</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Ingresa tu nombre" 
                className="w-full bg-white rounded-xl py-3 pl-11 pr-4 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#E31B23] focus:outline-none transition-shadow font-medium text-sm"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/90 ml-1">Correo electrónico</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="email" 
                placeholder="Ingresa tu correo" 
                className="w-full bg-white rounded-xl py-3 pl-11 pr-4 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#E31B23] focus:outline-none transition-shadow font-medium text-sm"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/90 ml-1">Contraseña</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Mínimo 8 caracteres" 
                className="w-full bg-white rounded-xl py-3 pl-11 pr-11 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#E31B23] focus:outline-none transition-shadow font-medium text-sm"
                required
                minLength={8}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-white/90 ml-1">Confirmar Contraseña</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="Repite tu contraseña" 
                className="w-full bg-white rounded-xl py-3 pl-11 pr-11 text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#E31B23] focus:outline-none transition-shadow font-medium text-sm"
                required
                minLength={8}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role Selector */}
          <div className="space-y-1 pt-2">
            <label className="text-xs font-medium text-white/90 ml-1 mb-2 block">¿Qué estás buscando?</label>
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setRole('trabajador')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${role === 'trabajador' ? 'bg-[#334195] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
              >
                <User className="w-4 h-4" />
                Empleo
              </button>
              <button
                type="button"
                onClick={() => setRole('empresa')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${role === 'empresa' ? 'bg-[#334195] text-white shadow-md' : 'text-white/60 hover:text-white'}`}
              >
                <Briefcase className="w-4 h-4" />
                Talento
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6 pt-2">
            <p className="text-sm text-white/70">
              ¿Ya tienes una cuenta? <br />
              <button type="button" onClick={onNavigateToLogin} className="text-white font-semibold hover:underline mt-1">Inicia sesión aquí</button>
            </p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full bg-[#E31B23] hover:bg-[#C9161D] text-white rounded-xl py-3.5 font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-red-900/50 transition-colors"
          >
            Crear cuenta <span className="text-lg">→</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
