import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PayoutService } from './payout.service';

describe('PayoutService', () => {
    let service: PayoutService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });

        httpTestingController = TestBed.inject(HttpTestingController);

        service = TestBed.inject(PayoutService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('Should return correct response', (done) => {
        const exampleData = [
            {
                name: 'Billy',
                price: 20
            },
            {
                name: 'Will',
                price: 20
            },
            {
                name: 'Jess',
                price: 20
            },
            {
                name: 'Tim',
                price: 20
            }
        ];


        const expectedResult = {
            total: 55,
            equalShare: 13.75,
            payouts: [
                {
                    owes: "Jess",
                    owed: "tim",
                    amount: 6.25
                },
                {
                    owes: "Jess",
                    owed: "Billy",
                    amount: 2.5
                },
                {
                    owes: "Will",
                    owed: "Billy",
                    amount: 3.75
                }
            ]
        };

        service.post(exampleData).subscribe(data => {
            expect(data).toEqual(expectedResult);
            done();
        });

        const testRequest = httpTestingController.expectOne('http://localhost:8000/api/payout');

        testRequest.flush(expectedResult);
    });
});
