import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [
    HttpModule.register({
      timeout: 10000
    })
  ]
})
export class PaymentModule {}
