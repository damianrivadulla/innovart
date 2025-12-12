import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
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
    NgClass,
    NgForOf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  menu: any = null
  menuActive = false;
  classCss: string;
  classMenu: string;

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

  openMenu() {
    if(this.menuActive){
      this.menuActive = false;
      this.classCss = "";
    } else{
      this.menuActive = true;
      this.classCss = "active";
    }
  }
}
