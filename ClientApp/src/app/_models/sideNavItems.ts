export interface SideNavItems {   
    isIcon?: boolean;
    isChild?: boolean;
    isNestedChild?: boolean
    ChiledMenu?:SideNavItems[];
    route?: string;
    image_name?:string;
    module_name?:string;
  }
  

export interface MData{
  
    select:string,
    value:string,
    effectiveDate:string,
    ExpiryDate:string,

}