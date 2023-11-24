import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../services/feedback/feedback.service';
import { RatingService } from '../services/rating/rating.service';

@Component({
  selector: 'app-my-review',
  templateUrl: './my-review.component.html',
  styleUrls: ['./my-review.component.css'],
})
export class MyReviewComponent implements OnInit {
  feedbacks: any[] = [];
  ratings: any[]=[];
  id: any = 1;

  constructor(private feedbackService: FeedbackService,private ratingService: RatingService) {}
  ngOnInit(): void {
    this.feedbackService.getAllByCustomerId(this.id).subscribe((data) => {
      this.feedbacks = data;
    });
    this.ratingService.getAllByCustomerId(this.id).subscribe((data) => {
      this.ratings = data;
    });
  }
}
