import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
    constructor (
        private readonly paymentService: PaymentService
    ) {}

    @Post()
    async makePaymentPlan(@Body() payload:any){
        return await this.paymentService.makePaymentrequest(payload)
    }
}
