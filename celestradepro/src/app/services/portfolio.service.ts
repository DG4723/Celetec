import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private baseUrl = 'http://localhost:3000/api/portfolio';

  constructor(private http: HttpClient) { }

  getAllPortfolio() {
    return this.http.get(`${this.baseUrl}`);
  }
}
