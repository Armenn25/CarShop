// src/app/modules/public/public-layout/public-layout.component.ts
import {
  Component,
  HostListener,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { CurrentUserService } from '../../../core/services/auth/current-user.service';

@Component({
  selector: 'app-public-layout',
  standalone: false,
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss',
})
export class PublicLayoutComponent implements AfterViewInit, OnDestroy {
  currentYear: string = '2025';
  navHidden = false;

  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  // HOW IT WORKS
  @ViewChild('howWorksSection') howWorksSection!: ElementRef<HTMLElement>;
  howWorksVisible = false;

  // PREMIUM EXPERIENCE
  @ViewChild('premiumSection') premiumSection!: ElementRef<HTMLElement>;
  premiumVisible = false;

  @ViewChild('visitSection') visitSection!: ElementRef<HTMLElement>;
  visitVisible = false;

  @ViewChild('sellSection') sellSection!: ElementRef<HTMLElement>;
  sellVisible = false;

  private sellObserver?: IntersectionObserver;
  private howObserver?: IntersectionObserver;
  private premiumObserver?: IntersectionObserver;
  private visitObserver?: IntersectionObserver;

  private lastY = 0;
  private readonly delta = 10; // koliko px treba da “pomjeri” da reaguje
  private readonly revealTop = 72; // na vrhu uvijek prikazi

  // LOGIN POPUP
  isLoginOpen = false;
  isLoginClosing = false;

  // REGISTER POPUP
  isRegisterOpen = false;
  isRegisterClosing = false;


  // LOGOUT POPUP
  isLogoutOpen = false;
  isLogoutClosing = false;

  constructor( private currentUser: CurrentUserService) {}

  // helper za template – da li user ima admin rolu
  get isAdmin(): boolean {
    return this.currentUser.isAdmin();
  }

  // helper za template – da li je user logovan
  get isAuthenticated(): boolean {
    return this.currentUser.isAuthenticated();
  }

  // ===== DATA: Collections =====
  collectionCards = [
    {
      count: '120+ vehicles',
      title: 'Luxury Sedans',
      desc: 'Premium comfort meets performance',
      image: 'assets/luxury.jpg',
      link: '/inventory?category=sedan',
    },
    {
      count: '85+ vehicles',
      title: 'Sports Cars',
      desc: 'Adrenaline-pumping performance',
      image: 'assets/sports.jpg',
      link: '/inventory?category=sports',
    },
    {
      count: '60+ vehicles',
      title: 'Electric Vehicles',
      desc: 'Sustainable luxury driving',
      image: 'assets/ev.jpg',
      link: '/inventory?category=ev',
    },
    {
      count: '95+ vehicles',
      title: 'SUV & Trucks',
      desc: 'Power and versatility combined',
      image: 'assets/suv.jpg',
      link: '/inventory?category=suv',
    },
  ];

  // ===== DATA: How It Works steps =====
  howSteps = [
    {
      no: '01',
      icon: 'search',
      title: 'Browse Collection',
      desc: 'Explore our premium inventory online or visit our showroom',
    },
    {
      no: '02',
      icon: 'calendar_month',
      title: 'Schedule Test Drive',
      desc: 'Book your test drive and experience the vehicle firsthand',
    },
    {
      no: '03',
      icon: 'task_alt',
      title: 'Get Financing',
      desc: 'Work with our team to secure the best financing options',
    },
    {
      no: '04',
      icon: 'directions_car',
      title: 'Drive Home',
      desc: 'Complete paperwork and drive away in your dream car',
    },
  ];

  // ===== DATA: Premium Experience cards =====
  premiumFeatures = [
    {
      icon: 'verified_user',
      title: 'Certified Quality',
      desc: 'Every vehicle undergoes rigorous 200-point inspection',
      iconBg: 'linear-gradient(135deg, #00b4dd 0%, #0052af 100%)',
      iconGlow: 'rgba(0, 160, 255, 0.22)',
    },
    {
      icon: 'workspace_premium',
      title: 'Best Prices',
      desc: 'Competitive pricing with transparent financing options',
      iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #ff4fd8 100%)',
      iconGlow: 'rgba(255, 79, 216, 0.18)',
    },
    {
      icon: 'bolt',
      title: 'Fast Delivery',
      desc: 'Quick processing and home delivery within 48 hours',
      iconBg: 'linear-gradient(135deg, #ff7a00 0%, #ff2d00 100%)',
      iconGlow: 'rgba(255, 122, 0, 0.18)',
    },
    {
      icon: 'support_agent',
      title: 'Expert Support',
      desc: '24/7 dedicated team ready to assist you anytime',
      iconBg: 'linear-gradient(135deg, #00c853 0%, #00bfa5 100%)',
      iconGlow: 'rgba(0, 200, 120, 0.18)',
    },
  ];

  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (!el) return;

    // pošto ti je navbar fixed, kompenzuj visinu
    const headerOffset = 88; // prilagodi ako ti je navbar 76px npr
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  ngAfterViewInit(): void {
    // =========================
    // VIDEO HARD MUTE + AUTOPLAY KICK
    // =========================
    const v = this.heroVideo?.nativeElement;
    if (v) {
      v.muted = true;
      v.defaultMuted = true;
      v.volume = 0;
      v.play().catch(() => {});
    }

    // =========================
    // OBSERVERS (one-time reveal)
    // =========================
    this.initSectionObservers();
  }

  private initSectionObservers(): void {
    setTimeout(() => {
      const inView = (el: HTMLElement): boolean => {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight * 0.85 && r.bottom > 0;
      };

      const observeOnce = (
        el: HTMLElement | undefined,
        onVisible: () => void
      ): IntersectionObserver | undefined => {
        if (!el) return;

        // 1) ako je već u view-u -> odmah pokaži
        if (inView(el)) {
          onVisible();
          return;
        }

        // 2) fallback ako browser nema IntersectionObserver
        if (!('IntersectionObserver' in window)) {
          onVisible();
          return;
        }

        const obs = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (entry?.isIntersecting) {
              onVisible();
              obs.disconnect();
            }
          },
          {
            threshold: 0.12,
            rootMargin: '0px 0px -120px 0px', // stabilnije nego % vrijednosti
          }
        );

        obs.observe(el);

        // SELL YOUR VEHICLE
        const sellEl = this.sellSection?.nativeElement;
        if (sellEl) {
          this.sellObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry?.isIntersecting) {
                this.sellVisible = true;
                this.sellObserver?.disconnect();
              }
            },
            { threshold: 0.18, rootMargin: '0px 0px -12% 0px' }
          );
          this.sellObserver.observe(sellEl);
        }

        // VISIT / SHOWROOM
        const visitEl = this.visitSection?.nativeElement;
        if (visitEl) {
          this.visitObserver = new IntersectionObserver(
            ([entry]) => {
              if (entry?.isIntersecting) {
                this.visitVisible = true;
                this.visitObserver?.disconnect();
              }
            },
            { threshold: 0.18, rootMargin: '0px 0px -12% 0px' }
          );
          this.visitObserver.observe(visitEl);
        }

        // 3) safety fallback (ako iz nekog razloga ne okine)
        setTimeout(() => {
          if (inView(el)) {
            onVisible();
            obs.disconnect();
          }
        }, 900);

        return obs;
      };

      // HOW IT WORKS
      this.howObserver = observeOnce(this.howWorksSection?.nativeElement, () => {
        this.howWorksVisible = true;
      });

      // PREMIUM EXPERIENCE
      this.premiumObserver = observeOnce(this.premiumSection?.nativeElement, () => {
        this.premiumVisible = true;
      });
    }, 0);
  }

  ngOnDestroy(): void {
    this.howObserver?.disconnect();
    this.premiumObserver?.disconnect();
    this.visitObserver?.disconnect();
    this.sellObserver?.disconnect();
  }

  // =========================
  // LOGIN MODAL
  // =========================
  openLoginModal(): void {
    this.isLoginClosing = false;
    this.isLoginOpen = true;
  }

  closeLoginModal(): void {
    if (this.isLoginClosing) return;
    this.isLoginClosing = true;

    setTimeout(() => {
      this.isLoginOpen = false;
      this.isLoginClosing = false;
    }, 220);
  }

  // =========================
  // REGISTER MODAL
  // =========================
  openRegisterModal(): void {
    this.isRegisterClosing = false;
    this.isRegisterOpen = true;
  }

  closeRegisterModal(): void {
    if (this.isRegisterClosing) return;
    this.isRegisterClosing = true;

    setTimeout(() => {
      this.isRegisterOpen = false;
      this.isRegisterClosing = false;
    }, 220);
  }

  handleCreateAccountFromLogin(): void {
    this.isLoginOpen = false;
    this.isLoginClosing = false;
    this.openRegisterModal();
  }

  handleSignInFromRegister(): void {
    this.isRegisterOpen = false;
    this.isRegisterClosing = false;
    this.openLoginModal();
  }

  // =========================
  // LOGOUT
  // =========================
 openLogoutModal(): void {
    this.isLogoutClosing = false;
    this.isLogoutOpen = true;
  }

  closeLogoutModal(): void {
    if (this.isLogoutClosing) return;
    this.isLogoutClosing = true;

    setTimeout(() => {
      this.isLogoutOpen = false;
      this.isLogoutClosing = false;
    }, 220);
  }

  handleLogoutCompleted(): void {
    this.closeLogoutModal();
  }
  logout(): void {
    // postojeći LogoutComponent na /auth/logout ruti
    this.openLogoutModal();
  }
  // =========================
  // NAVBAR HIDING ON SCROLL
  // =========================
  @HostListener('window:scroll', [])
  onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;

    if (y <= this.revealTop) {
      this.navHidden = false;
      this.lastY = y;
      return;
    }

    if (Math.abs(y - this.lastY) < this.delta) return;

    this.navHidden = y > this.lastY; // down -> hide, up -> show
    this.lastY = y;
  }
}
