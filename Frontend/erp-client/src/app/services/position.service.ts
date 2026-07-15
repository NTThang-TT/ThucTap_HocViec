import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../models/employee-dto.model';

@Injectable({ providedIn: 'root' })
export class PositionService {
  private apiUrl = 'http://localhost:5000/api/position';
  private http = inject(HttpClient);

  getAll(): Observable<Position[]> {
    return this.http.get<Position[]>(this.apiUrl);
  }
}
