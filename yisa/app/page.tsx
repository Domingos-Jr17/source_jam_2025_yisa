"use client"

import { useState, useEffect } from "react"
import { Home, FileText, CheckCircle, Wallet, User, Settings, LogIn } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { verificarAutenticacao, logout } from "@/lib/autenticacao"

// Import das telas
import TelaInicial from "@/components/telas/tela-inicial"
import TelaEmitir from "@/components/telas/tela-emitir"
import TelaVerificar from "@/components/telas/tela-verificar"
import TelaCarteira from "@/components/telas/tela-carteira"
import TelaPerfil from "@/components/telas/tela-perfil"
import TelaConfiguracoes from "@/components/telas/tela-configuracoes"
import TelaSolicitacoes from "@/components/telas/tela-solicitacoes"
import TelaPedidos from "@/components/telas/tela-pedidos"

export default function AppDocEscola() {
  const [abaAtiva, setAbaAtiva] = useState("inicio")
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const usuario = verificarAutenticacao()
    if(!usuario) {
      router.push("/home")
    }
    setUsuarioLogado(usuario)
  }, [])

  const handleLogout = () => {
    logout()
    setUsuarioLogado(null)
    router.push("/login")
  }

  const irParaPerfil = () => {
    if (usuarioLogado) {
      setAbaAtiva("perfil")
    } else {
      router.push("/login")
    }
  }

  const irParaConfiguracoes = () => {
    if (usuarioLogado) {
      setAbaAtiva("configuracoes")
    } else {
      router.push("/login")
    }
  }

  const handleNavigateToTab = (tab: string) => {
    setAbaAtiva(tab)
  }

  const getRoloBadge = () => {
    if (!usuarioLogado) return null
    switch (usuarioLogado.papel) {
      case "diretor":
        return "DIR"
      case "aluno":
        return "ALU"
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#fff] via-[#fff] to-[#004b87] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logos.png" alt="YISA Logo" className="h-8 w-auto" />
          </div>
          <div className="flex space-x-2 items-center">
            {usuarioLogado && (
              <>
                <span className="text-xs bg-white/20 px-2 py-1 rounded font-semibold">{getRoloBadge()}</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded hidden sm:block">
                  {usuarioLogado.nome.split(" ")[0]}
                </span>
              </>
            )}
            <button
              onClick={irParaPerfil}
              className={`text-white bg-transparent hover:bg-white/10 rounded-full p-2 flex items-center transition-colors ${
                abaAtiva === "perfil" ? "bg-white/20" : ""
              }`}
              title={usuarioLogado ? "Perfil" : "Login"}
            >
              {usuarioLogado ? (
                <User size={20} />
              ) : (
                <>
                  <LogIn size={20} />
                </>
              )}
            </button>
            {usuarioLogado && (
              <>
               
                <button
                  onClick={handleLogout}
                  className="text-white bg-transparent hover:bg-white/10 rounded-full p-2 transition-colors"
                  title="Logout"
                >
                  <LogIn size={20} className="rotate-180" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 container mx-auto p-4 pb-20">
        <Tabs
          defaultValue="inicio"
          value={abaAtiva}
          onValueChange={setAbaAtiva}
          className="w-full flex flex-col min-h-[calc(100vh-8rem)]"
        >
          <TabsContent value="inicio" className="mt-0 flex-1">
            <TelaInicial onNavigateTo={handleNavigateToTab} />
          </TabsContent>

          {usuarioLogado?.papel === "diretor" && (
            <>
              <TabsContent value="emitir" className="mt-0 flex-1">
                <TelaEmitir />
              </TabsContent>
              <TabsContent value="verificar" className="mt-0 flex-1">
                <TelaVerificar />
              </TabsContent>
              <TabsContent value="solicitacoes" className="mt-0 flex-1">
                <TelaSolicitacoes />
              </TabsContent>
            </>
          )}

          {usuarioLogado?.papel === "aluno" && (
            <>
              <TabsContent value="pedidos" className="mt-0 flex-1">
                <TelaPedidos onNavigateTo={handleNavigateToTab} />
              </TabsContent>
              <TabsContent value="carteira" className="mt-0 flex-1">
                <TelaCarteira />
              </TabsContent>
              <TabsContent value="solicitar" className="mt-0 flex-1">
                <TelaSolicitacoes />
              </TabsContent>
            </>
          )}

          <TabsContent value="perfil" className="mt-0 flex-1">
            <TelaPerfil />
          </TabsContent>

          <TabsContent value="configuracoes" className="mt-0 flex-1">
            <TelaConfiguracoes />
          </TabsContent>

          <TabsList
            className="grid w-full bg-white border-t border-gray-200 p-2 pb-18 fixed bottom-0 left-0 right-0 z-10 gap-0"
            style={{ gridTemplateColumns: usuarioLogado?.papel === "diretor" ? "repeat(3, 1fr)" : "repeat(3, 1fr)" }}
          >
           

            {usuarioLogado?.papel === "diretor" && (
              <>
               <TabsTrigger
              value="inicio"
              className={`flex flex-col items-center py-2 rounded-none ${
                abaAtiva === "inicio" ? "text-[#db341e] border-t-2 border-[#db341e]" : "text-gray-600"
              }`}
            >
              <Home size={20} />
              <span className="text-xs mt-1">Início</span>
            </TabsTrigger>
                <TabsTrigger
                  value="emitir"
                  className={`flex flex-col items-center py-2 rounded-none ${
                    abaAtiva === "emitir" ? "text-[#db341e] border-t-2 border-[#db341e]" : "text-gray-600"
                  }`}
                >
                  <FileText size={20} />
                  <span className="text-xs mt-1">Emitir</span>
                </TabsTrigger>
                <TabsTrigger
                  value="verificar"
                  className={`flex flex-col items-center py-2 rounded-none ${
                    abaAtiva === "verificar" ? "text-[#db341e] border-t-2 border-[#db341e]" : "text-gray-600"
                  }`}
                >
                  <CheckCircle size={20} />
                  <span className="text-xs mt-1">Verificar</span>
                </TabsTrigger>
              </>
            )}

            {usuarioLogado?.papel === "aluno" && (
              <>
               <TabsTrigger
              value="inicio"
              className={`flex flex-col items-center py-2 rounded-none ${
                abaAtiva === "inicio" ? "text-[#db341e] border-t-2 border-[#db341e]" : "text-gray-600"
              }`}
            >
              <Home size={20} />
              <span className="text-xs mt-1">Início</span>
            </TabsTrigger>
                <TabsTrigger
                  value="pedidos"
                  className={`flex flex-col items-center py-2 rounded-none ${
                    abaAtiva === "pedidos" ? "text-[#db341e] border-t-2 border-[#db341e]" : "text-gray-600"
                  }`}
                >
                  <FileText size={20} />
                  <span className="text-xs mt-1">Pedidos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="carteira"
                  className={`flex flex-col items-center py-2 rounded-none ${
                    abaAtiva === "carteira" ? "text-[#db341e] border-t-2 border-[#db341e]" : "text-gray-600"
                  }`}
                >
                  <Wallet size={20} />
                  <span className="text-xs mt-1">Carteira</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>
        </Tabs>
      </main>
    </div>
  )
}
