import React, { useState } from 'react';
import { X, LogIn, Lock, Mail, ShieldAlert } from 'lucide-react';
import { RonimotorsLogo } from '../common/RonimotorsLogo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mockNotice, setMockNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMockNotice(true);
    setTimeout(() => {
      setMockNotice(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <RonimotorsLogo size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Acesso ao Portal</h3>
            <p className="text-xs text-slate-500 mt-1">
              Área restrita para clientes e consultores Ronimotors
            </p>
          </div>

          {mockNotice ? (
            <div className="p-4 bg-violet-50 text-violet-900 border border-violet-200 rounded-xl text-xs space-y-1">
              <p className="font-bold">Demonstração de Front-End</p>
              <p className="text-slate-600">
                A autenticação será integrada diretamente ao sistema administrativo na próxima fase.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-hidden focus:border-violet-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input type="checkbox" className="rounded text-violet-600 accent-[#5B21B6]" />
                  <span>Lembrar de mim</span>
                </label>
                <a href="#recuperar" className="text-violet-700 hover:underline">
                  Esqueceu a senha?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#5B21B6] hover:bg-[#4C1D95] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar no Sistema</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
