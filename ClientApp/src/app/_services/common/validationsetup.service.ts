import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationsetupService {

  validationsArray = {
    taxPeriod: {
      addTaxPeriod: {
        taxYear: {
          minLength: 4,
          maxLength: 4,
          pattern: '^[0-9]+$',
          patternMsg:"Tax year may contain the numeric characters.",
          maxLengthMsg:"Tax module maximum length must be 4.",
          minLengthMsg:"Tax module minimum length must be 4."
        },
        description: {
          minLength: 2,
          maxLength: 100,
          pattern: '^[A-Za-z0-9 ]+$',
          patternMsg:"Module name may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Tax module name maximum length must be 100. ",
          minLengthMsg:"Tax module name minimum length must be 2 "
        }
      }
    },
    taxModule: {
      addTaxModule: {
        taxModuleName: {
          minLength: 3,
          maxLength: 5,
          pattern: '^[A-Z0-9]+$',
          patternMsg:"Tax module may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Tax module maximum length must be 5.",
          minLengthMsg:"Tax module minimum length must be 3."
        },
        moduleName: {
          minLength: 2,
          maxLength: 100,
          pattern: '^[A-Z0-9]+$',
          patternMsg:"Module name may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Tax module name maximum length must be 100. ",
          minLengthMsg:"Tax module name minimum length must be 2 "
        }
      }
    },
    sourceSystem: {
      addSourceSystem: {
        sourceSystemName: {
          minLength: 2,
          maxLength: 20,
          pattern: '^[A-Z0-9]+$',
          patternMsg:"Source system name may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Source system name maximum length must be 20. ",
          minLengthMsg:"Source system name minimum length must be 2."
        },
        sourceSystemDescription: {
          minLength: 2,
          maxLength: 100,
          pattern: '[a-zA-Z0-9_ ]+',
          patternMsg:"Description may contain only alphanumeric.",
          maxLengthMsg:"Description maximum length must be 100.",
          minLengthMsg:"Description minimum length must be 2. "
        }
      }
    },
    productCode: {
      addProductCode: {
        productCodeName: {
          minLength: 2,
          maxLength: 20,
          pattern: '^[A-Z0-9]+$',
          patternMsg:"Product code name may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Product code system name maximum length must be 20. ",
          minLengthMsg:"Product code system name minimum length must be 2."
        },
        productCodeDescription: {
          minLength: 2,
          maxLength: 100,
          pattern: '[a-zA-Z0-9_ ]+',
          patternMsg:"Description may contain only alphanumeric.",
          maxLengthMsg:"Description maximum length must be 100.",
          minLengthMsg:"Description minimum length must be 2. "
        }
      }
    },
    taxSourceCode: {
      addTaxSourceCode: {
        taxSourceCodeName: {
          minLength: 3,
          maxLength: 20,
          pattern: '^[a-z _.A-Z0-9]+$',
          patternMsg:"Tax module may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Tax module maximum length must be 20.",
          minLengthMsg:"Tax module minimum length must be 3."
        },
        Description: {
          minLength: 2,
          maxLength: 100,
          pattern: '[a-zA-Z0-9_. ]+$',
          patternMsg:"Description may contain the alphanumeric characters.",
          maxLengthMsg:"Description maximum length must be 100. ",
          minLengthMsg:"Description name minimum length must be 2 "
        }
      }
    },
    messagingEvent: {
      addMessagingEvent: {
        messagingEventName: {
          minLength: 2,
          maxLength: 50,
          pattern: '[A-Z0-9_]+',
          patternMsg:"Messaging event may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Messaging event name maximum length must be 50.",
          minLengthMsg:"Messaging event name minimum length must be 2."
        },
        messagingEventType: {
          minLength: 2,
          maxLength: 50,
          pattern: '[A-Z0-9_ ]+',
          patternMsg:"Messaging event type may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Messaging event type name maximum length must be 50.",
          minLengthMsg:"Messaging event type name minimum length must be 2."
        },
        messagingEventDescription: {
          minLength: 2,
          maxLength: 100,
          pattern: '[a-zA-Z0-9_ ]+',
          patternMsg:"Description may contain only alphanumeric.",
          maxLengthMsg:"Description maximum length must be 100.",
          minLengthMsg:"Description minimum length must be 2."
        }
      }
    },

    fundEntity: {
      addFundEntity: {
        fundEntityName: {
          minLength: 2,
          maxLength: 50,
          pattern: '^[A-Z0-9 ]+$',
          patternMsg:"Fund entity may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Fund entity name maximum length must be 50.",
          minLengthMsg:"Fund entity name minimum length must be 2."
        },
        fundEntityDescription: {
          minLength: 2,
          maxLength: 100,
          pattern: '[a-zA-Z0-9_. ]+',
          patternMsg:"Description may contain only alphanumeric.",
          maxLengthMsg:"Description maximum length must be 100.",
          minLengthMsg:"Description minimum length must be 2."
        }
      }
    },

    submittingEntity: {
      addSubmittingEntity: {
        submittingEntityName: {
          minLength: 2,
          maxLength: 50,
          pattern: '^[A-Z0-9]+$',
          patternMsg:"Submitting entity may contain the alphanumeric and uppercase characters.",
          maxLengthMsg:"Submitting entity name maximum length must be 50.",
          minLengthMsg:"Submitting entity name minimum length must be 2."
        },
        submittingEntityDescription: {
          minLength: 2,
          maxLength: 100,
          pattern: '[a-zA-Z0-9_. ]+',
          patternMsg:"Description may contain only alphanumeric.",
          maxLengthMsg:"Description maximum length must be 100.",
          minLengthMsg:"Description minimum length must be 2."
        }
      }
    },
    domainAndReference: {
      addDomain: {
        domainName: {
          minLength: 2,
          maxLength: 50,
          pattern: '[a-zA-Z0-9_. ]+',
          patternMsg:"Domain name may contain only alphanumeric.",
          maxLengthMsg:"Domain name maximum length must be 50.",
          minLengthMsg:"Domain name minimum length must be 2."
        },
       domainAlias: {
          minLength: 2,
          maxLength: 50,
          pattern: '[a-zA-Z0-9_. ]+',
          patternMsg:"Domain alias may contain only alphanumeric.",
          maxLengthMsg:"Domain alias maximum length must be 50.",
          minLengthMsg:"Domain alias minimum length must be 2."
        },
        domainDescription: {
          minLength: 2,
          maxLength: 100,
          pattern: '[a-zA-Z0-9_. ]+',
          patternMsg:"Description may contain only alphanumeric.",
          maxLengthMsg:"Description maximum length must be 100.",
          minLengthMsg:"Description minimum length must be 2."
        }
      },
      addDomainValue:{
        reference_Code: {
          minLength: 2,
          maxLength: 50,
          pattern: '[a-zA-Z0-9_. ]+',
          patternMsg:"may contain only alphanumeric.",
          maxLengthMsg:"maximum length must be 50.",
          minLengthMsg:"minimum length must be 2."
        },
        domainValueName: {
          minLength: 2,
          maxLength: 50,
          pattern: '[a-zA-Z0-9_. ]+',
          patternMsg:"Domain value Name may contain only alphanumeric.",
          maxLengthMsg:"Domain value Name maximum length must be 50.",
          minLengthMsg:"Domain value Name minimum length must be 2."
        },
        domainValueDiscription: {
          minLength: 2,
          maxLength: 100,
          pattern: '[a-zA-Z0-9_. ]+',
          patternMsg:"Description may contain only alphanumeric.",
          maxLengthMsg:"Description maximum length must be 100.",
          minLengthMsg:"Description minimum length must be 2."
        },
        SARS_Mapping: {
          minLength: 2,
          maxLength: 50,
          pattern: '[a-zA-Z0-9_. ]+',
          patternMsg:"SARS mapping may contain only alphanumeric.",
          maxLengthMsg:"SARS mapping maximum length must be 50.",
          minLengthMsg:"SARS mapping minimum length must be 2."
        },
     
      },
      addValidation:{
        maxLength: {
          minLength: 1,
          maxLength: 50,
          pattern: '[0-9]*',
          patternMsg:"Max length contain only numbers.",
          maxLengthMsg:"Max length maximum length must be 50.",
          minLengthMsg:"Max length minimum length must be 1."
        },
        minLength: {
          minLength: 1,
          maxLength: 50,
          pattern: '[0-9]*',
          patternMsg:"Min length contain only numbers.",
          maxLengthMsg:"Min length maximum length must be 50.",
          minLengthMsg:"Min length minimum length must be 1."
        },
      
      },
      
    },
fundANdSubAddress:{
unitNumber:{
          minLength: 1,
          maxLength: 50,
          pattern: '^[ A-Za-z0-9_@./#&+-]*$',
          patternMsg:"Unit Name contain only numbers.",
          maxLengthMsg:"Unit Name maximum length must be 50.",
          minLengthMsg:"Unit Name minimum length must be 1."
},
complexName:{
  minLength: 1,
  maxLength: 100,
  pattern: '^[ A-Za-z0-9_@./#&+-]*$',
  patternMsg:"Complex Name may contain only alphanumeric.",
  maxLengthMsg:"Complex Name maximum length must be 100.",
  minLengthMsg:"Complex Name minimum length must be 1."
},
streetName:{
  minLength: 1,
  maxLength: 100,
  pattern: '^[ A-Za-z0-9_@./#&+-]*$',
  patternMsg:"Street Name may contain only alphanumeric.",
  maxLengthMsg:"Street Name maximum length must be 100.",
  minLengthMsg:"Street Name minimum length must be 1."
},
postalCode:{
  minLength: 1,
  maxLength: 20,
  pattern: '^[0-9 ]+$',
  patternMsg:"Postal code may contain only number.",
  maxLengthMsg:"Postal code maximum length must be 20.",
  minLengthMsg:"Postal code minimum length must be 1."
}

},
dateMetaData : {
  datePlaceholder: 'CCYY/MM/DD'
  
}

  }
 
}
