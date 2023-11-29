import { Component, Input, OnInit } from '@angular/core';
import { FeedbackService } from '../services/feedback/feedback.service';
import { RatingService } from '../services/rating/rating.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.css'],
})
export class MyReviewComponent implements OnInit {
  feedbacks: any[] = [];
  ratings: any[]=[];
  // id: any = this.tokenService.getCustomerId();

  // constructor(private feedbackService: FeedbackService,
  //   private ratingService: RatingService,
  //   private tokenService: TokenService) {}
  id: any = 1;
  starsInfo: { filled: boolean, half: boolean , noFill: boolean}[] = [];
  rating: any = 0;
  @Input() averageNumber: any;
  getRateElement: number[] = [];
  totalRate: any[] = [];
  count: number = 0;

  constructor(
    private feedbackService: FeedbackService, 
    private ratingService: RatingService
  ) {}
  ngOnInit(): void {
    this.feedbackService.getAllByCustomerId(this.id).subscribe((data) => {
      this.feedbacks = data;
    });
    // this.ratingService.getAllByCustomerId(this.id).subscribe((data) => {
    //   this.ratings = data;
    // });
    this.getRatingListByCustomer(this.id);
  }

  getRatingListByCustomer(id: number) {
    this.count = 0;
    this.ratingService.getAllByCustomerId(id).subscribe(rating => {
      this.totalRate = rating;
      console.log('User rated:', this.totalRate);
      console.log('Product Id rated:', id);
      for (let i of this.totalRate){
        this.getRateElement.push(i.rating);
        console.log('rating: ', i.rating);  
        this.starsInfo = this.calculateStars(i.rating);
        console.log('Star: ',this.starsInfo); 
        this.count++;
      }
      // this.averageNumber = this.customRound(this.calculateAverage());
      // this.starsInfo = this.calculateStars(this.averageNumber);
      
      console.log( "Average: " + this.averageNumber); 
      console.log('getRateElement: ', this.getRateElement);
      console.log("Test " + this.count);
      
    });
  }

  // calculateAverage(): number{
  //   if (this.getRateElement.length === 0) {
  //     return 0; // Tránh chia cho 0
  //   }
  
  //   let sum = 0;

  //   for (const rating of this.getRateElement) {
  //     if (typeof rating === 'number') {
  //       sum += rating;
  //     }
  //   }
  //   console.log("Sum Type:", typeof sum);
  //   return sum / this.getRateElement.length;
  // }

  // customRound(value: number): number {
  //   const floorValue = Math.floor(value);
  //   const decimalPart = value - floorValue;

  //   if (decimalPart < 0.5) {
  //       return floorValue;
  //   } else {
  //       return floorValue + 0.5;
  //   }
  // }
  calculateStars(average: number): { filled: boolean, half: boolean, noFill: boolean }[] {
    const stars = [];
  
    for (let i = 1; i <= 5; i++) {
      const filled = i <= Math.floor(average);
      const half = !filled && i === Math.ceil(average);
      const noFill = !filled && !half;
      // const no = !filled && !half &&  i ===
      stars.push({ filled, half, noFill });
    }
  
    return stars;
  }
}
