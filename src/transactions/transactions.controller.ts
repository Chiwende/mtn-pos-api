import { Controller, Get, Param } from '@nestjs/common';

@Controller('transactions')
export class TransactionsController {
    constructor () {}

    @Get()
    fetchAllTransactions(){
        return "All transactions"
    }

    @Get('/:merchant_number')
    fetchTransactionsByMerchantNumber(){
        return "Transactions by merchant"
    }

    @Get("/:transaction_id")
    fetchTransactionByID(@Param('transaction_id') transaction_id){
        return "transaction_by_id"
    }
}
