"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"

export default function TelaBiblioteca() {
  return (
    <div className="space-y-6 py-4">
      <h2 className="text-2xl font-bold text-[#1f1c45]">Biblioteca de PDFs</h2>
      <p className="text-gray-500">Baixe provas e materiais de estudo</p>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Provas Anteriores</CardTitle>
            <CardDescription>Provas oficiais de anos anteriores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="text-[#1f1c45]" />
                <div>
                  <p className="font-medium">Matemática Final 2023</p>
                  <p className="text-sm text-gray-500">PDF • 2.4 MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-[#1f1c45]">
                <Download size={16} className="mr-2" />
                Baixar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="text-[#1f1c45]" />
                <div>
                  <p className="font-medium">Física Final 2023</p>
                  <p className="text-sm text-gray-500">PDF • 3.1 MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-[#1f1c45]">
                <Download size={16} className="mr-2" />
                Baixar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="text-[#1f1c45]" />
                <div>
                  <p className="font-medium">Química Final 2023</p>
                  <p className="text-sm text-gray-500">PDF • 2.8 MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-[#1f1c45]">
                <Download size={16} className="mr-2" />
                Baixar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Materiais de Estudo</CardTitle>
            <CardDescription>Anotações de aula e guias de estudo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="text-[#1f1c45]" />
                <div>
                  <p className="font-medium">Guia de Estudo de Cálculo</p>
                  <p className="text-sm text-gray-500">PDF • 5.2 MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-[#1f1c45]">
                <Download size={16} className="mr-2" />
                Baixar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="text-[#1f1c45]" />
                <div>
                  <p className="font-medium">Anotações de Termodinâmica</p>
                  <p className="text-sm text-gray-500">PDF • 4.7 MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-[#1f1c45]">
                <Download size={16} className="mr-2" />
                Baixar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="text-[#1f1c45]" />
                <div>
                  <p className="font-medium">Guia de Química Orgânica</p>
                  <p className="text-sm text-gray-500">PDF • 6.1 MB</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-[#1f1c45]">
                <Download size={16} className="mr-2" />
                Baixar
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seus Downloads</CardTitle>
            <CardDescription>Materiais baixados recentemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="text-gray-400" size={16} />
                  <p className="text-sm">Física Final 2022</p>
                </div>
                <p className="text-xs text-gray-500">Baixado há 2 dias</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="text-gray-400" size={16} />
                  <p className="text-sm">Guia de Estudo de Cálculo</p>
                </div>
                <p className="text-xs text-gray-500">Baixado há 5 dias</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="text-gray-400" size={16} />
                  <p className="text-sm">Química Final 2022</p>
                </div>
                <p className="text-xs text-gray-500">Baixado há 1 semana</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
