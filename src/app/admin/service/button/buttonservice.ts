import { Injectable } from '@angular/core';

@Injectable()
export class ButtonService {
  private showButton2: boolean = false;
  private showButton3: boolean = false;
  private showButton4: boolean = false;
  private showButton5: boolean = false;
  private showButton6: boolean = false;
  
  getShowButton2() {
    return this.showButton2;
  };

  setShowButton2(value: boolean) {
    this.showButton2 = value;
  };

  getShowButton3() {
    return this.showButton3;
  };

  setShowButton3(value: boolean) {
    this.showButton3 = value;
  };
  
  getShowButton4() {
    return this.showButton4;
  };
  setShowButton4(value: boolean) {
    this.showButton4 = value;
  };

  getShowButton5() {
    return this.showButton5;
  };
  setShowButton5(value: boolean) {
    this.showButton5 = value;
  };

  getShowButton6() {
    return this.showButton6;
  };

  setShowButton6(value: boolean) {
    this.showButton6 = value;
  };

}