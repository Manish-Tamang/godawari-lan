'use client';

import Link from 'next/link';
import { DraggableCharacter } from '@/components/draggable-character';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Navbar } from '@/components/navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Main Content */}
      <div className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative py-12 flex flex-col items-center justify-center overflow-hidden min-h-[450px]">
          {/* Draggable Characters */}
          <DraggableCharacter
            id="char-kelly"
            src="/mini-kelly.png"
            alt="Character 1"
            initialX={206}
            initialY={134}
            className="absolute z-20"
            mobileX={26}
            mobileY={186}
            debug={false}
          />
          <DraggableCharacter
            id="char-angelic"
            src="/mini-angelic.png"
            alt="Character 2"
            initialX={557}
            initialY={57}
            mobileX={310}
            mobileY={33}
            className="absolute z-20"
            debug={false}
          />

          {/* Central Content */}
          <div className="relative z-10 text-center px-6 w-full max-w-xs mx-auto">
            <p className="text-[10px] sm:text-xs font-bold text-primary mb-2 tracking-[0.3em] uppercase opacity-80">
              Sushma Godawari College <span className="text-foreground">Presents</span>
            </p>

            <div className="relative w-full aspect-[2/1] mb-6">
              <Image
                src="/hero.png"
                alt="Free Fire Tournament"
                priority
                fill
                draggable={false}
                className="object-contain user-select-none drop-shadow-2xl animate-pulse-slow"
              />
            </div>

            <p className="text-sm font-medium text-muted-foreground mb-10 tracking-widest uppercase">
              Godawari Lan 2026
            </p>

            <div className="flex gap-2 justify-center items-center mb-10">
              <div className="text-center px-3 border-r border-border">
                <div className="text-xl font-bold text-secondary">NPR 250</div>
                <div className="text-[10px] uppercase tracking-tighter text-muted-foreground">Entry Fee</div>
              </div>
              <div className="text-center px-3 border-r border-border">
                <div className="text-xl font-bold text-secondary">4v4</div>
                <div className="text-[10px] uppercase tracking-tighter text-muted-foreground">Squad</div>
              </div>
              <div className="text-center px-3">
                <div className="text-xl font-bold text-secondary">Prizes</div>
                <div className="text-[10px] uppercase tracking-tighter text-muted-foreground">Waiting</div>
              </div>
            </div>

            <Link href="/register">
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold h-14 transition-transform active:scale-95"
                variant="gamers"
              >
                Join Tournament Now
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 bg-muted/20 px-6">
          <h2 className="text-xl font-bold mb-6">Tournament Highlights</h2>
          <div className="grid grid-cols-1 gap-3">
            {[
              { title: 'Quick Registration', desc: 'Secure your spot in minutes' },
              { title: 'Secure Payments', desc: 'Verified screenshot uploads' },
              { title: 'Fair play', desc: 'Real-time status tracking' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-border flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-10 px-6">
          <h2 className="text-xl font-bold mb-6">Requirements</h2>
          <div className="space-y-6">
            {[
              { id: '01', title: 'Team Name', desc: 'A unique name for your squad' },
              { id: '02', title: 'Members', desc: 'IGL name, phone, and UIDs' },
              { id: '03', title: 'Payment', desc: 'Screenshot of NPR 250 payment' },
            ].map((req) => (
              <div key={req.id} className="flex gap-4 items-start">
                <div className="text-xl font-black text-primary opacity-20 leading-none">{req.id}</div>
                <div>
                  <h3 className="font-bold text-sm mb-1">{req.title}</h3>
                  <p className="text-xs text-muted-foreground">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-10 px-6 mb-12">
          <h2 className="text-xl font-bold mb-6">Contact & Support</h2>
          <div className="bg-primary/[0.03] border border-primary/10 rounded-2xl p-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium mb-1">Razz Karki</p>
              <p className="text-xs text-muted-foreground">Event Coordinator</p>
            </div>
            <a
              href="tel:9708714590"
              className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2.5 rounded-lg active:scale-95 transition-transform"
            >
              Contact Now
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
