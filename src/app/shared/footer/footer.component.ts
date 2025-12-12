import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LineRevealComponent } from '../line-reveal/line-reveal.component';
import { ParagraphRevealComponent } from '../paragraph-reveal/paragraph-reveal.component';
import { NgForOf } from '@angular/common';
import ScrollReveal from 'scrollreveal';
import { gql } from '@apollo/client/core';
import { QUERY_HEADER } from '../../queries/header';
import { Apollo } from 'apollo-angular';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    LineRevealComponent,
    ParagraphRevealComponent
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})

export class FooterComponent implements OnInit, AfterViewInit {
  footerInfo: any = null;
  menuA: any = null
  menuB: any = null
  
  constructor(private readonly apollo: Apollo) {
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`${QUERY_HEADER}`
    }).valueChanges.subscribe((result: any) => {
      this.footerInfo = result.data.globalContent.globalFields;
      const mainMenuA = result.data.menus.nodes.find((item: any) => item.name === "Footer Menu 1");
      this.menuA = mainMenuA.menuItems.nodes;
      const mainMenuB = result.data.menus.nodes.find((item: any) => item.name === "Footer Menu 2");
      this.menuB = mainMenuB.menuItems.nodes;
    });
  }

  ngAfterViewInit(): void {
    ScrollReveal().reveal('footer', {
      interval: 200,
      duration: 3000,
      viewFactor: .1,
    });
  }
}
