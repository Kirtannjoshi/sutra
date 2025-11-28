import type { Metadata } from "next";
import {
  inter,
  creepster,
  orbitron,
  playfair,
  bangers,
  cinzel,
  anton,
  monoton,
  spaceMono,
  rubikGlitch,
  nosifer,
  butcherman,
  audiowide,
  rajdhani,
  pressStart,
  righteous,
  cormorant,
  blackOps,
  permanentMarker,
  rockSalt,
  shadows,
  libre,
  merriweather,
  specialElite,
  syncopate,
  unifraktur,
  rye,
  amatic,
  abril,
  alfa,
  medieval
} from "@/lib/fonts";
import "./globals.css";
import { ToastProvider } from "@/components/ui/ToastProvider";

export const metadata: Metadata = {
  title: "Sutra | Discover Cinema",
  description: "A minimalist media discovery platform",
};

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariables = [
    inter.variable,
    creepster.variable,
    orbitron.variable,
    playfair.variable,
    bangers.variable,
    cinzel.variable,
    anton.variable,
    monoton.variable,
    spaceMono.variable,
    rubikGlitch.variable,
    nosifer.variable,
    butcherman.variable,
    audiowide.variable,
    rajdhani.variable,
    pressStart.variable,
    righteous.variable,
    cormorant.variable,
    blackOps.variable,
    permanentMarker.variable,
    rockSalt.variable,
    shadows.variable,
    libre.variable,
    merriweather.variable,
    specialElite.variable,
    syncopate.variable,
    unifraktur.variable,
    rye.variable,
    amatic.variable,
    abril.variable,
    alfa.variable
  ].join(' ');

  return (
    <html lang="en">
      <body className={`${fontVariables} antialiased`}>
        <ToastProvider>
          <Header />
          <Sidebar />
          <div className="pt-20 md:pl-20 min-h-screen">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
