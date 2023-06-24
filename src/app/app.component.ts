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

            // Removes object reference
            const tempExpenses = this.expenses.map(item => new Expense(item.name, item.price));
            const payouts = response.payouts;
            for (let i = 0; i < payouts.length; i++) {
                const payout = payouts[i];
                
                const index1 = tempExpenses.findIndex(item => item.name === payout.owes);
                tempExpenses[index1].price += payout.amount;

                const index2 = tempExpenses.findIndex(item => item.name === payout.owed);
                tempExpenses[index2].price -= payout.amount;
            }

            if (payouts.some(item => item.amount < 0)) {
                console.error('Incorrect response: one of the payouts is negative', response);
            } else if (tempExpenses.map(item => item.price).reduce((a, b) => a + b) !== response.total) {
                console.error('tempExpenses doesnt equal total from respons', tempExpenses, response);
            } else {
                console.log('success');
            }
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