import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-[#F3F3F3]">
      {/* Mini Navbar */}
      <header className="w-full border-b border-[#2E2E2E] bg-[#121212]/90 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <Image
              src="/logo.png"
              alt="Clover Wallet Logo"
              width={36}
              height={36}
              className="rounded-full ring-2 ring-[#10B981]/30"
            />
            <span className="text-lg font-bold tracking-tight text-white">
              Clover<span className="text-[#10B981]">Wallet</span>
            </span>
          </Link>

          <nav className="flex items-center gap-6 text-xs sm:text-sm font-medium text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-white">
              Inicio
            </Link>
            <Link href="/login" className="transition-colors hover:text-white">
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </header>

      {/* Main 404 Section */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16 text-center lg:text-left">
            {/* 404 Mascot Illustration */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 shrink-0">
              <Image
                src="/images/404.png"
                alt="404 Asta Perdido - Clover Wallet"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>

            {/* 404 Text & Action */}
            <div className="max-w-md">
              <div className="inline-block rounded-full border border-[#2E2E2E] bg-[#1E1E1E] px-3.5 py-1 text-xs font-semibold text-[#10B981] mb-4">
                Error 404
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl uppercase">
                404 - Página no encontrada
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                Asta dice que no encuentra el camino... <br className="hidden sm:inline" />
                ¡parece que se ha perdido!
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/">
                  <Button
                    size="lg"
                    className="h-12 px-8 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#10B981]/20 cursor-pointer uppercase"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Inicio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mini Footer */}
      <footer className="border-t border-[#2E2E2E] py-6 text-center text-xs text-muted-foreground">
        <div className="container mx-auto max-w-7xl px-4">
          <span>© {new Date().getFullYear()} Clover Wallet. Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  );
}
