import { useState, type FormEvent } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useGoogleLogin } from '@react-oauth/google';
import { Logo, BrandText } from './Logo';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('remember_me') === 'true';
  });
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('remembered_email') || '';
  });

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch('http://localhost:8000/api/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_token: tokenResponse.access_token
          })
        });

        const data = await response.json();

        if (response.ok && data.status === 'success') {
          localStorage.setItem('auth_token', data.token);
          onLoginSuccess();
        } else {
          setError(data.message || 'Error al autenticar con Google en el servidor');
        }
      } catch (err) {
        console.error(err);
        setError('No se pudo conectar con el servidor (¿está encendido en el puerto 8000?)');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError('Error en la ventana de Google. Comprueba que el Client ID es correcto.');
    }
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem('remember_me', 'true');
      localStorage.setItem('remembered_email', email);
    } else {
      localStorage.removeItem('remember_me');
      localStorage.removeItem('remembered_email');
    }
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans">
      {/* Left Column: Brand Story & Social Proof (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Subtle geometric background overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <Logo className="w-9 h-9" />
          <BrandText className="text-xl" darkMode={true} />
        </div>

        {/* Hero Narrative */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Plataforma Oficial de Empleo Profesional</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Impulsa tu carrera hacia el siguiente nivel.
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            Accede a oportunidades verificadas en el sector privado, convocatorias de empleo público del BOE y cursos de especialización acreditados.
          </p>

          {/* Social Proof / Metrics Cards */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div>
              <div className="text-2xl font-black text-white">+14.200</div>
              <div className="text-xs text-slate-400">Ofertas activas verificadas</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">98.4%</div>
              <div className="text-xs text-slate-400">Tasa de respuesta de reclutadores</div>
            </div>
          </div>
        </div>

        {/* Testimonial Quote */}
        <div className="relative z-10 p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 backdrop-blur-sm">
          <p className="text-sm text-slate-200 italic mb-3">
            "GrowUpJob es la primera plataforma que une empleo tecnológico con empleo público con un nivel de rigor y claridad excepcional."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              MC
            </div>
            <div>
              <div className="text-xs font-bold text-white">Marcos Calvo</div>
              <div className="text-[11px] text-slate-400">Tech Lead & Opositor A1 TIC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Clean Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 sm:p-10"
        >
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <Logo className="w-8 h-8" />
            <BrandText className="text-lg" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Iniciar sesión</h2>
            <p className="text-sm text-slate-500 mt-1">
              Ingresa tus credenciales para acceder a tu panel.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={() => googleLogin()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl py-3 px-4 transition-all font-semibold text-sm cursor-pointer shadow-xs disabled:opacity-50"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            <span>Continuar con Google</span>
          </button>

          <div className="relative flex items-center my-6">
            <div className="grow border-t border-slate-200" />
            <span className="shrink-0 mx-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              o con email
            </span>
            <div className="grow border-t border-slate-200" />
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Contraseña
                </label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tu contraseña"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span className="text-xs font-medium">Recordar mis datos</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 mt-6 shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <span>Acceder al portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              ¿Aún no tienes cuenta?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Crear cuenta gratuita
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

