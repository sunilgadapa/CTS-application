export interface LookupData { 
    lookup_value_id?:number;
    lookup_type_id?:number;
    lookup_value_name:string;
    lookup_value_description:string;
    lookup_type_name:any;
    status_flag:boolean;
    lookup_type: string;
    Page: number;
    Size :number;
    SearchText : string;
    contact_id : string;
    ids:any;
    tax_module_id: number
    StatusFlag: number
    totalrows: number
    totalselectedrows: number
    misc_value: string
}

export interface MisclookupData { 
    lookup_value_id?:number;
    lookup_type_id?:number;
    lookup_value_name:string;
    lookup_value_description:string;
    lookup_type_name:any;
    status_flag:boolean;
    lookup_type: string;
    Page: number;
    Size :number;
    SearchText : string;
    contact_id : string;
    ids:any;
    tax_module_id: number
    StatusFlag: number
    totalrows: number
    totalselectedrows: number

}

export interface MessageData{
    messaging_event:string,
    message_event_type:string,
    messaging_event_description:string,
    messaging_event_id:number,
    tax_module_id: number
}

export interface GetMisslinousData{
    contact_id:number,
    Page:number,
    Size:number,
    SearchText?:string,
}

export interface GetMessageSave{
    ids:any;
    tax_module_id: number
}