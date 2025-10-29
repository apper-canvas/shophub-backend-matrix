import reviewsData from "@/services/mockData/reviews.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ReviewService {
  constructor() {
    this.reviews = [...reviewsData];
    this.nextId = Math.max(...this.reviews.map(r => r.Id), 0) + 1;
  }

  async getAll() {
    await delay(200);
    return this.reviews.map(r => ({ ...r }));
  }

  async getById(id) {
    await delay(200);
    const review = this.reviews.find(r => r.Id === parseInt(id));
    if (!review) {
      throw new Error(`Review with ID ${id} not found`);
    }
    return { ...review };
  }

  async getByProductId(productId) {
    await delay(200);
    return this.reviews
      .filter(r => r.productId === parseInt(productId))
      .map(r => ({ ...r }));
  }

  async create(reviewData) {
    await delay(300);
    
    const newReview = {
      Id: this.nextId++,
      productId: reviewData.productId,
      reviewerName: reviewData.reviewerName || "Anonymous Customer",
      rating: reviewData.rating,
      title: reviewData.title,
      text: reviewData.text,
      date: new Date().toISOString(),
      verifiedPurchase: reviewData.verifiedPurchase || true,
      helpful: 0,
      photos: reviewData.photos || []
    };

    this.reviews.push(newReview);
    return { ...newReview };
  }

  async update(id, reviewData) {
    await delay(300);
    
    const index = this.reviews.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Review with ID ${id} not found`);
    }

    this.reviews[index] = { 
      ...this.reviews[index], 
      ...reviewData,
      Id: this.reviews[index].Id,
      date: this.reviews[index].date
    };
    
    return { ...this.reviews[index] };
  }

  async delete(id) {
    await delay(300);
    
    const index = this.reviews.findIndex(r => r.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Review with ID ${id} not found`);
    }

    this.reviews.splice(index, 1);
    return true;
  }

  async addHelpful(id) {
    await delay(200);
    
    const review = this.reviews.find(r => r.Id === parseInt(id));
    if (!review) {
      throw new Error(`Review with ID ${id} not found`);
    }

    review.helpful += 1;
    return { ...review };
  }

  async calculateAverageRating(productId) {
    await delay(100);
    
    const productReviews = this.reviews.filter(r => r.productId === parseInt(productId));
    
    if (productReviews.length === 0) {
      return 0;
    }

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / productReviews.length;
  }

  async getReviewStats(productId) {
    await delay(100);
    
    const productReviews = this.reviews.filter(r => r.productId === parseInt(productId));
    
    const stats = {
      totalReviews: productReviews.length,
      averageRating: 0,
      ratingDistribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
      }
    };

    if (productReviews.length === 0) {
      return stats;
    }

    const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
    stats.averageRating = sum / productReviews.length;

    productReviews.forEach(review => {
      const starRating = Math.floor(review.rating);
      stats.ratingDistribution[starRating] = (stats.ratingDistribution[starRating] || 0) + 1;
    });

    return stats;
  }
}

export const reviewService = new ReviewService();