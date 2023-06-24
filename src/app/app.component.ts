import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PayoutService } from 'src/services/payout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    expenses = [
        new Expense('Billy', 20),
        new Expense('Will', 10),
        new Expense('Jess', 5),
        new Expense('tim', 20)
    ];
    expenseForm: FormGroup;
    nodeResponse: NodeResponse;

    constructor(
        private formBuilder: FormBuilder,
        private payoutService: PayoutService
    ) {
        this.initExpenseForm();
    }

    get isValid(): boolean {
        return this.expenseForm.valid && this.expenseForm.dirty;
    }

    initExpenseForm(): void {
        this.expenseForm = this.formBuilder.group({
            name: [null, [Validators.required, Validators.maxLength(100)]],
            price: [null, [Validators.required, Validators.min(0), Validators.max(10000)]],
        });
    }

    addExpense(): void {
        this.nodeResponse = null as any;

        const name = this.expenseForm.get('name')?.value;
        const price = this.expenseForm.get('price')?.value;

        this.expenses.push(
            new Expense(name, price)
        );

        this.expenseForm.reset();
        this.payoutService.post(this.expenses);
    }

    settleUp(): void {
        // Get payouts from node server
        this.payoutService.post(this.expenses).subscribe((response: NodeResponse) => {
            console.log(response);
            this.nodeResponse = response;
        });
    }
}

class Expense {
    name: string;
    price: number;

    constructor(name: string, price: number) {
        this.name = name;
        this.price = price;
    }
}

class NodeResponse {
    total: number;
    equalShare: number;
    payouts: Payout[];
}

class Payout {
    owes: string;
    owed: string;
    amount: number

    constructor(owes: string, owed: string, amount: number) {
        this.owes = owes;
        this.owed = owed;
        this.amount = amount;
    }
}