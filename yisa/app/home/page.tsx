"use client"

import { useEffect } from "react"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Send, GraduationCap, Shield } from 'lucide-react';
import { useRouter } from "next/navigation"
import { verificarAutenticacao } from "@/lib/autenticacao"

export default function DocEscolaCard() {
   const router = useRouter()

   useEffect(() => {
    const usuario = verificarAutenticacao()
    
    // Se o usuário já estiver autenticado, redireciona para o dashboard
    if (usuario) {
      router.push("/")
    }
  }, [router])

  const onLogin = () => {
      router.push("/login")
  }

  return (
     <Card className="max-w-2xl mx-auto overflow-hidden">
      <div className="relative h-48 bg-gradient-to-br from-[#004b87] via-[#1b8856] to-[#1b8856] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex items-center gap-4">
          <GraduationCap size={64} className="text-white opacity-90" strokeWidth={1.5} />
          <div className="h-16 w-px bg-white/30"></div>
          <Shield size={56} className="text-white opacity-90" strokeWidth={1.5} />
        </div>
      </div>
      
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Bem-vindo ao DocEscola
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Sistema de Gestão e Transferência de Documentos Escolares de Moçambique
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 px-6 pb-6">
        <div className="text-center">
          <p className="text-gray-700 leading-relaxed">
            Aceda ao sistema com as suas credenciais para utilizar os serviços de emissão, 
            verificação e consulta de documentos académicos.
          </p>
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-semibold text-gray-900 mb-5 text-center">
            Selecione o Seu Perfil de Acesso
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="group relative overflow-hidden p-6 rounded-xl border-2 border-blue-200 bg-[#1b8856] hover:from-blue-100 hover:to-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                onClick={onLogin}
             >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield size={32} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-gray-200">Direção Escolar</p>
                  <p className="text-xs text-gray-100 mt-1">
                    Emissão e verificação de documentos
                  </p>
                </div>
              </div>
            </button>
            
            <button className="group relative overflow-hidden p-6 rounded-xl border-2 border-purple-200 bg-[#004b87] hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                 onClick={onLogin}
              >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap size={32} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg text-gray-300">Estudante</p>
                  <p className="text-xs text-gray-100 mt-1">
                    Submissão e consulta de documentos
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Sistema seguro e certificado para gestão académica
          </p>
        </div>
      </CardContent>
    </Card>
  );
}