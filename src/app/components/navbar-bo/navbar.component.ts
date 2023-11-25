import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { Itypeprd } from '../interfaces/itypeprd';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private d:DataService) { }
  listTypePro:Itypeprd[] = [];
  ngOnInit(): void {
    this.d.getTypeProduct().subscribe( d => this.listTypePro = d);
  }
}
