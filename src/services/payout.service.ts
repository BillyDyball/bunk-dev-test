import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PayoutService {

    readonly payoutEndpoint = 'http://localhost:8000/api/payout';

    constructor(
        private http: HttpClient
    ) { }

    post(expenses: any[]): Observable<any> {
        return this.http.post(
            this.payoutEndpoint,
            JSON.stringify(expenses),
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

}