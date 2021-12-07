export interface AddNewDomain{
    lookup_type_id: number
    lookup_type: string;
    lookup_name: string;
    lookup_value_alias: string;
    lookup_type_description: string
    submission_domain_flag: boolean
    Page: number
    Size : number
    SearchText : string
    validation_flag:boolean

}

export interface AddDomainValu{
    lookup_type_id: number
    lookup_value_name: string;
    lookup_value_id: number;
    lookup_type_description: string
    lookup_value_description: string
    lookup_value_alias:string
    tax_module_id: any
    SARS_mapping_code: any
    Gotlookup_type_id: number
    Gotlookup_value_id: number
    Page: number
    Size : number
    SearchText : string

}