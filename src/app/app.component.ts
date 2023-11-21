import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Web_Going';
  switchUICondtion = true;
  ngOnInit(): void {
    initFlowbite();
    setInterval(()=>{
      this.switchUICondtion = !this.switchUICondtion
    },5000)
  }
  
}
