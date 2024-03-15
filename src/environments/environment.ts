import { FirebaseOptions } from '@firebase/app-types';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apis: {
    apiUrl: 'http://ec2-52-87-171-214.compute-1.amazonaws.com/',
    accountService: 'http://accountserviceapi-902719179.us-east-1.elb.amazonaws.com/api/v1',
    systemConfigurationService: 'http://systemconfigurationservicesapi-976242165.us-east-1.elb.amazonaws.com/api/v1',
    inventoryService: 'http://inventoryserviceapi-1517761922.us-east-1.elb.amazonaws.com/api/v1',
    walletService: 'http://localhost:5235/api/v1',
    coinPayment: 'https://www.coinpayments.net/index.php'
  },
  openAI: {
    apiKey: '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'
  },
  tokens: {
    coinPayment: 'bfd40db8f711397a6c5b7653175afc38',
    accountService: 'WCHAqlP0D61f=3EZZE!Hm2P=0Y0lJ3MMH!g-lA6!1t=ssBXndUsO7vi/N3ScwV-h',
    systemConfigurationService: 'WCHS-ZKmsuqhtdJfVz1ri4hGy7T4v?aLeTAZhA6UpD!t!efsvKt?9aVT1i7!7sNH',
    inventoryService: 'WCHICt9S4war/L1J7OAIFwW1=XMN2pCXJeOdiE?n-YMyalBMAb1/6KtW3?Qd3lb/',
    walletService: 'WCHWvDtdJEV1xr6h0uWjYG=U7WdCja/P04cX4x7FVXHWdbzLzpHL2qPzCFZOeCDA',
  },
  coinPaymentConfiguration: {
    publicApiKey: '2a4ae9a2a58b59f4cf3cecf76e89f04155ccdcca4dc0c76b8665cf852cc127c2',
    privateApiKey: '36b880a10b1c6e87443132B57eE715e8511730D6aCbc47188d0dcff521D3eEc9',
    currency: 'USDC.TRC20',
    reset: '1',
    cmd: '_pay_simple',
    success_url: 'http://ec2-52-87-171-214.compute-1.amazonaws.com/#/conpayment-confirmation',
    format: 'json'
  },
};

export const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyBVM9OkEJa_rdAID5ydC8gGKjNaU6fFzQI",
  authDomain: "ecosystem-6b056.firebaseapp.com",
  projectId: "ecosystem-6b056",
  storageBucket: "ecosystem-6b056.appspot.com",
  messagingSenderId: "1077107109427",
  appId: "1:1077107109427:web:bbe6268a7b4f1831717d46",
  measurementId: "G-64EF1WMHB8"
};




/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */

