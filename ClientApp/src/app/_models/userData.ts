export interface UserData {
  Statuscode: number
    Message: string
    Data: any
  }

  export interface AddressData {
    lookup_value_id:number
    address_id:number
    unit_number: number
    street_number: number
    complex_name: string
    city : string
    suburb: string
    province: string
    country: string
    postal_code: any
    address_type_id : number
     effective_date?: string
    expiry_date?: string
    contact_type_id: any
    address_type: string
    address_type_alias:string
    address_line1:string
    address_line2:string
    address_line3:string
    }

    