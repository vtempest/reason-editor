'use client'

import { TooltipProvider } from "@/src/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import Index from "@/src/routes/Index"
import ShareView from "@/src/routes/ShareView"
import ICPExplorerPage from "@/src/routes/ICPExplorerPage"
import PagesDemo from "@/src/routes/PagesDemo"
import NotFound from "@/src/routes/NotFound"
import { useState, useEffect } from "react"

// Disable static optimization for this page
export const dynamic = 'force-dynamic'

export default function Page() {
  const [queryClient] = useState(() => new QueryClient())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/icp-explorer" element={<ICPExplorerPage />} />
              <Route path="/pages-demo" element={<PagesDemo />} />
              <Route path="/share/:shareId" element={<ShareView />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
