import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {

    transaction_status: any
    transction_result: any

    constructor (
        private readonly httpService: HttpService
    ) {}

    async generateToken(payload: any){
        console.log("authentication payload recieved ====> ", payload)
        const encoded_creds = Buffer.from("ecc72926-db3e-488a-9c16-52eff1628e20" + ":" + "3fb07dfcbf1045c5b1d68d579d278d4b").toString('base64');
        // console.log("encoded headers",encoded_creds)
        const config = {
            method: 'post',
            url: 'https://proxy.momoapi.mtn.com/collection/token/',
            headers: {
              'Ocp-Apim-Subscription-Key': "77207f3fc7644fbc8613516194d2119b",
              'Authorization': 'Basic '+ encoded_creds
            }
          };
        //   console.log("Headers been sent", config.headers)
          const url = "https://proxy.momoapi.mtn.com/collection/token/"
          const data = ""

        const access = await this.httpService.post(url, data, { headers: config.headers})
            .toPromise()
            .then(res => {
                // console.log(res.headers.)
                const response = res.data
                const access_token = response.access_token
                // console.log("returning this token", access_token)
                return access_token
            })
        return access
    }

    async transctionEnquiry(x_ref: string, access_token: string){
        console.log("transaction status")
        const config = {
          method: 'get',
          url: 'https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay/'+x_ref,
          headers: {
            'Ocp-Apim-Subscription-Key': "77207f3fc7644fbc8613516194d2119b",
            'Authorization': 'Bearer '+ access_token,
            'Content-Type': 'application/json',
            'X-Target-Environment': "mtnzambia",
          }
      };
  
        const status = await this.httpService.get(config.url, { headers: config.headers})
        .toPromise()
        .then(res => {
            
            // console.log(res.headers)
            console.log(" trasaction enquiry response status ==> ",res.data)
            console.log(" trasaction enquiry response status ==> ",res.data.status)
            const response = res.data
            return response
        })
        return status
      }  

    
    async makePaymentrequest(payload: any){
        const access_token = await this.generateToken(payload)
        console.log("*access token", access_token)
        const x_ref = uuidv4();

        const momoPayload = {
            "amount": payload.amount,
            "currency": payload.currency,
            "externalId": "12345678",
            "payer": {
              "partyIdType": "MSISDN",
              "partyId": payload.partyId
            },
            "payerMessage": "test request",
            "payeeNote": "test request"
        }

        const config = {
            method: 'post',
            url: 'https://proxy.momoapi.mtn.com/collection/v1_0/requesttopay',
            headers: {
              'Ocp-Apim-Subscription-Key': payload.ocp_apim_subscription_key,
              'Authorization': 'Bearer '+ access_token,
              'Content-Type': 'application/json',
              'X-Target-Environment': "mtnzambia",
              'X-Reference-Id': x_ref,
            }
        };

        console.log("request headrers",config.headers)
        console.log(momoPayload)

        await this.httpService.post(config.url, momoPayload, { headers: config.headers})
        .toPromise()
        .then(res => {
            // console.log(res.headers)
            console.log("response status ==> ",res.status)
            const response = res.data
            return res.status
        })

        this.transaction_status = await this.transctionEnquiry(x_ref, access_token);
        while(this.transaction_status.status == "PENDING"){
          console.log('TRANSACTION STATUS ===> ', this.transaction_status.status)
          this.transaction_status = await this.transctionEnquiry(x_ref, access_token);
        }

        const response = {
            responseDescription: this.transaction_status.status
        }
        return response
    }

    async makePaymentrequestt(payload: any){  
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

