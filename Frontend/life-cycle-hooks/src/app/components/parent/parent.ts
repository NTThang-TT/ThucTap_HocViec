import { Component, ContentChild, ElementRef, OnInit, ViewChild } from '@angular/core';
// Import ChildComponent vào
import { Child } from '../child/child'; // Điều chỉnh đường dẫn cho đúng với project của bạn

@Component({
  selector: 'app-parent',
  // Thêm Child vào mảng imports
  imports: [Child],
  templateUrl: './parent.html',
  styleUrl: './parent.css'
})
export class Parent implements OnInit {
  isChildDestroyed = false;

 
  userName = 'Maria';

  updateUser() {
    this.userName = 'Chris';
  }
  ngOnInit(): void {
    console.log('ngOnInit from the parent componet');
  }
   destroy(){
    this.isChildDestroyed = true;
  }
}
