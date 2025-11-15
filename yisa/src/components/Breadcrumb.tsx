import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HomeIcon } from '@heroicons/react/24/outline'
import { useAccessibility } from '../hooks/useAccessibility'

interface BreadcrumbItem {
  name: string
  href: string
  current?: boolean
}

const Breadcrumb: React.FC = () => {
  const location = useLocation()
  const { announce } = useAccessibility()

  // Generate breadcrumb items based on current route
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x)

    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Início', href: '/', current: pathnames.length === 0 }
    ]

    if (pathnames.length === 0) return breadcrumbs

    // Build breadcrumb paths
    let currentPath = ''
    const routeMap: Record<string, string> = {
      'emitir': 'Emitir Documento',
      'verificar': 'Verificar Documento',
      'carteira': 'Minha Carteira',
      'partilhar': 'Partilhar',
      'historico': 'Histórico',
      'definicoes': 'Definições',
      'sobre': 'Sobre YISA'
    }

    pathnames.forEach((path, index) => {
      currentPath += `/${path}`
      const isLast = index === pathnames.length - 1

      // Handle special case for share page
      if (path === 'partilhar' && pathnames[index + 1]) {
        breadcrumbs.push({
          name: 'Partilhar Documento',
          href: currentPath,
          current: false
        })
        // Skip the document ID
        currentPath += `/${pathnames[index + 1]}`
        return
      }

      const displayName = routeMap[path] || path.charAt(0).toUpperCase() + path.slice(1)

      breadcrumbs.push({
        name: displayName,
        href: currentPath,
        current: isLast
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  // Don't show breadcrumb on home page
  if (breadcrumbs.length <= 1) return null

  const handleBreadcrumbClick = (name: string) => {
    announce(`Navegando para ${name}`, 'polite')
  }

  return (
    <nav
      className="hidden md:flex mb-6"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <svg
                className="flex-shrink-0 h-4 w-4 mx-2 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {index === 0 && (
              <HomeIcon className="flex-shrink-0 h-4 w-4 mr-1 text-gray-400" aria-hidden="true" />
            )}

            {item.current ? (
              <span className="font-medium text-gray-900" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                to={item.href}
                className="hover:text-gray-700 transition-colors"
                onClick={() => handleBreadcrumbClick(item.name)}
                aria-label={`${item.name} - ${index === 0 ? 'Página inicial' : 'Navegar para'}`}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumb