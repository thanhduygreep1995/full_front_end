import { Component, Input, OnInit } from '@angular/core';
import { FeedbackService } from '../services/feedback/feedback.service';
import { RatingService } from '../services/rating/rating.service';
import { TokenService } from '../services/token.service';
import { DatePipe } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.css'],
})
export class MyReviewComponent implements OnInit {
  feedbacks: any[] = [];
  ratings: any[] = [];
  id: any = this.tokenService.getCustomerId();

  constructor(
    private feedbackService: FeedbackService,
    private ratingService: RatingService,
    private tokenService: TokenService,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.feedbackService.getAllByCustomerId(this.id).subscribe((data) => {
      this.feedbacks = data;
      data.sort((a:any, b:any) => {
        // Assuming your products have a 'createDate' field to sort by
        const dateA = new Date(a['createDate']).getTime();
        const dateB = new Date(b['createDate']).getTime();
        return dateB - dateA; // Sort in descending order (latest first)
      });
      // this.feedbacks = data;
      console.log(data)
      const ratingObservables: Observable<number>[] = this.feedbacks.map((feedback) =>
      this.getRating(feedback.productId)
    );
    forkJoin(ratingObservables).subscribe((ratings: number[]) => {
      ratings.forEach((rating, index) => {
        this.feedbacks[index].ratings = rating 
      });
    });
      for (let feedback of this.feedbacks) {
        const dateArray = feedback.createDate;
        const dateObject = new Date(
          dateArray[0],
          dateArray[1] - 1,
          dateArray[2],
          dateArray[3],
          dateArray[4]
        );
        feedback.createDate = this.datePipe.transform(dateObject, 'dd/MM/yyyy');
        console.log(feedback.createDate);
      }
    });
  }
  getRating(productId: any): Observable<number> {
    return this.ratingService.getMyRating(productId, this.id);
  }
}
