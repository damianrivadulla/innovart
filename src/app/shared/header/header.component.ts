import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { NgForOf, NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { QUERY_HEADER } from '../../queries/header';
import ScrollReveal from 'scrollreveal';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgClass,
    NgForOf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  menu: any = null
  menuActive = false;
  classCss: string;
  classMenu: string;
  headerVisible = true;
  private lastScrollTop = 0;
  private scrollThreshold = 10;
  private lockedScrollY = 0;
  private scrollLocked = false;

  constructor(private readonly apollo: Apollo,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`${QUERY_HEADER}`
    }).valueChanges.subscribe((result: any) => {
      const mainMenu = result.data.menus.nodes.find((item: any) => item.name === "Main Menu");
      this.menu = mainMenu.menuItems.nodes;
      this.classMenu = "show";
      //this.showMenu();
    });
  }

  ngAfterViewInit(): void {
    this.lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.menuActive) {
      this.headerVisible = true;
      return;
    }

    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Solo procesar si el scroll es mayor al umbral
    if (Math.abs(currentScrollTop - this.lastScrollTop) < this.scrollThreshold) {
      return;
    }

    if (currentScrollTop > this.lastScrollTop && currentScrollTop > 100) {
      // Scroll hacia abajo - ocultar header
      this.headerVisible = false;
    } else if (currentScrollTop < this.lastScrollTop) {
      // Scroll hacia arriba - mostrar header
      this.headerVisible = true;
    }

    // Si estamos en el top de la página, siempre mostrar el header
    if (currentScrollTop <= 0) {
      this.headerVisible = true;
    }

    this.lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
  }  

  showMenu() {
    this.classMenu = "show";

    /*setTimeout(() => { 
      ScrollReveal().reveal('.menu-item', {
        interval: 200,
        duration: 1000,
        viewFactor: .1,
      });
    }, 1);*/
  }

  ngOnDestroy(): void {
    this.unlockScroll();
  }

  openMenu() {
    if(this.menuActive){
      this.menuActive = false;
      this.classCss = "";
      this.unlockScroll();
    } else{
      this.headerVisible = true;
      this.menuActive = true;
      this.classCss = "active";
      this.lockScroll();
    }
  }

  private lockScroll(): void {
    this.lockedScrollY = window.scrollY;
    this.scrollLocked = true;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    if (!this.scrollLocked) {
      return;
    }
    const scrollY = this.lockedScrollY;
    this.scrollLocked = false;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    this.lastScrollTop = scrollY;
    window.scrollTo(0, scrollY);
  }
}
