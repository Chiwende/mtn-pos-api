import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
    constructor (
        private readonly httpService: HttpService
    ) {}

    async makePaymentrequest(payload: any){  
        console.log(payload)
        const string = Date.now()
        const prefix = "MPOS-"
        const request_id = prefix+string
        const request_payload = {
            "msisdn": payload.msisdn,
            "amount": payload.amount,
            "firstName": "Chiwende",
            "lastName": "Sakala",
            "email": "chiwendesakala@gmail.com",
            "requestId": request_id,
            "reference": "Test Payment"
        }
        console.log(request_payload)
        const url = "https://lipila.hobbiton.tech/merchant/mobile/payments"
        return await this.httpService.post(url,request_payload, {headers: {
            'Content-Type': 'application/json',
            'ApiKey':'c38b58b1-affa-4aad-aec3-2c24e1132f05'
        }}).toPromise().then((response) => {
            console.log(response)
            return response.data
        }).catch((error) => {
            console.log("<==================>")
            console.log(error)
        })
    }
}
