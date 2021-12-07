using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.Admin.Data.Interfaces;
using OLDMutual.CTS.Admin.Domain.Models;
using OLDMutual.CTS.Admin.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Service.Services
{

    public class AdminConfigurationService : IAdminConfigurationService
    {
        private readonly IAdminModuleConfiguration _adminModuleConfiguration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public AdminConfigurationService(IAdminModuleConfiguration adminModuleConfiguration, IHttpContextAccessor httpContextAccessor)
        {
            _adminModuleConfiguration = adminModuleConfiguration;
            _httpContextAccessor = httpContextAccessor;
        }
        /*  
       .......................................................................................................
       * This is the AddEditAddressData service mathod
       * @param address is used to get address data in JSON format as a method param     
       * AddEditAddressData() is used to add or edit the address data on the entity popup
       .......................................................................................................
       */
        public async Task<int> AddEditAddressData(AddressData address)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _adminModuleConfiguration.AddEditAddressData(address, userName);
        }
        /*  
        .......................................................................................................
        * This is the AddEditCotact service method
        * @param lookup is used to get the contact data in JSON format as a request body      
        * AddEditCotact() is used to add or edit the contact data on the entity popup
        .......................................................................................................
        */
        public async Task<int> AddEditCotact(List<ContactData> contact)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int lookup_value_id = 0;
            DataTable dtUser = new DataTable();
            dtUser.Columns.Add("phone_id", typeof(int));
            dtUser.Columns.Add("phone_number", typeof(string));
            dtUser.Columns.Add("area_code", typeof(string));
            dtUser.Columns.Add("phone_type_id", typeof(int));
            dtUser.Columns.Add("contact_id", typeof(int));
            dtUser.Columns.Add("effective_date", typeof(DateTime));
            dtUser.Columns.Add("expiry_date", typeof(DateTime));
            dtUser.Columns.Add("status_flag", typeof(bool));
            dtUser.Columns.Add("created_by", typeof(string));
            dtUser.Columns.Add("created_date", typeof(DateTime));
            DataRow row;
            if (contact.Any())
            {
                foreach (var miscdata in contact)
                {
                    row = dtUser.NewRow();
                    row["phone_id"] = miscdata.phone_id;
                    row["phone_number"] = miscdata.value;
                    row["area_code"] = miscdata.country_code;
                    row["phone_type_id"] = miscdata.phone_type_id;
                    row["contact_id"] = miscdata.contact_id;
                    row["status_flag"] = true;
                    row["effective_date"] = DateTime.ParseExact(miscdata.effective_date, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US"));
                    row["expiry_date"] = miscdata.expiry_date == "null" ? DBNull.Value : DateTime.ParseExact(miscdata.expiry_date, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US"));
                    row["created_by"] = userName;
                    row["created_date"] = DateTime.Now;
                    lookup_value_id = miscdata.contact_id;
                    dtUser.Rows.Add(row);
                }
            }
            return await _adminModuleConfiguration.AddEditCotact(dtUser, lookup_value_id);
        }
        /*  
        .......................................................................................................
        * This is the AddEditEmailData service method
        * @param email is used to get the email data in JSON format as a method param
        * AddEditEmailDataAsync() is used to add or edit the email data on the entity popup
        .......................................................................................................
        */
        public async Task<int> AddEditEmail(List<EmailData> email)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int lookup_value_id = 0;
            DataTable dtUser = new DataTable();
            dtUser.Columns.Add("email_id", typeof(int));
            dtUser.Columns.Add("email_address", typeof(string));
            dtUser.Columns.Add("email_type_id", typeof(int));
            dtUser.Columns.Add("contact_id", typeof(int));
            dtUser.Columns.Add("effective_date", typeof(DateTime));
            dtUser.Columns.Add("expiry_date", typeof(DateTime));
            dtUser.Columns.Add("status_flag", typeof(bool));
            dtUser.Columns.Add("created_by", typeof(string));
            dtUser.Columns.Add("created_date", typeof(DateTime));

            DataRow row;
            if (email.Any())
            {
                foreach (var miscdata in email)
                {
                    row = dtUser.NewRow();
                    row["email_id"] = miscdata.email_id;
                    row["email_address"] = miscdata.value;
                    row["email_type_id"] = miscdata.email_type_id;
                    row["contact_id"] = miscdata.contact_id;
                    row["status_flag"] = true;
                    row["effective_date"] = DateTime.ParseExact(miscdata.effective_date, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US"));
                    row["expiry_date"] = miscdata.expiry_date == "null" ? DBNull.Value : DateTime.ParseExact(miscdata.expiry_date, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US"));
                    row["created_by"] = userName;
                    row["created_date"] = DateTime.Now;
                    lookup_value_id = miscdata.contact_id;
                    dtUser.Rows.Add(row);
                }
            }
            return await _adminModuleConfiguration.AddEditEmail(dtUser, lookup_value_id);
        }
        /*  
       .......................................................................................................
       * This is the AddEditLookUpdata service method
       * @param lookup is used to data to be inserted in JSON format       
       * AddEditLookUpdata() is used to add or edit the lookup values
       .......................................................................................................
       */
        public async Task<int> AddEditLookUpdata(LookupData lookup)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _adminModuleConfiguration.AddEditLookUpdata(lookup, userName);
        }
        /*  
        .......................................................................................................
        * This is the AddEditMisc service method
        * @param misc is used to get JSON object as a method body to store the miscellaneous data       
        * AddEditMisc() is used to store the miscellaneous data on the entity popup
        .......................................................................................................
        */
        public async Task<int> AddEditMisc(List<LookupMiscData> misc)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            int lookup_value_id = 0;
            DataTable dtUser = new DataTable();
            dtUser.Columns.Add("other_misc_info_id", typeof(int));
            dtUser.Columns.Add("other_misc_info_value", typeof(string));
            dtUser.Columns.Add("other_misc_info_type_id", typeof(int));
            dtUser.Columns.Add("contact_id", typeof(int));
            dtUser.Columns.Add("effective_date", typeof(DateTime));
            dtUser.Columns.Add("expiry_date", typeof(DateTime));
            dtUser.Columns.Add("status_flag", typeof(bool));
            dtUser.Columns.Add("created_by", typeof(string));
            dtUser.Columns.Add("created_date", typeof(DateTime));
            dtUser.Columns.Add("contact_type_code", typeof(string));
            DataRow row;
            if (misc.Any())
            {
                foreach (var miscdata in misc)
                {
                    row = dtUser.NewRow();
                    row["other_misc_info_id"] = miscdata.other_misc_info_id;
                    row["other_misc_info_value"] = miscdata.value;
                    row["other_misc_info_type_id"] = miscdata.lookup_value_id;
                    row["contact_id"] = miscdata.contact_id;
                    row["status_flag"] = true;
                    row["effective_date"] = DateTime.ParseExact(miscdata.effective_date, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US"));
                    row["expiry_date"] = miscdata.expiry_date == "null" ? DBNull.Value : DateTime.ParseExact(miscdata.expiry_date, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US"));
                    row["created_by"] = userName;
                    row["created_date"] = DateTime.Now;
                    row["contact_type_code"] = miscdata.contact_type;
                    lookup_value_id = miscdata.contact_id;
                    dtUser.Rows.Add(row);
                }
            }
            return await _adminModuleConfiguration.AddEditMisc(dtUser, lookup_value_id);
        }

        /*  
        .......................................................................................................
        * This is the AddEditTaxPeriodData service method
        * @param taxPeriodDto is used to get JSON data as a method param      
        * AddEditTaxPeriodData() is used to get the address data on the entity popup
        .......................................................................................................
        */
        public async Task<int> AddEditTaxPeriodData(TaxPeriodDto taxPeriodDto)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _adminModuleConfiguration.AddEditTaxPeriodData(taxPeriodDto, userName);
        }
        /*  
        .......................................................................................................
        * This is the AddEditTaxPeriodData service method
        * @param taxPeriodDto is used to get JSON data as a method param
        * @param PageNumber is used to get the page number as a method param
        * @param Size is used to get the page size as a method param
        * AddEditTaxPeriodData() is used to get the address data on the entity popup
        .......................................................................................................
        */
        public async Task<int> SaveTaxPeriodData(TaxPeriodDto taxPeriodDto)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < taxPeriodDto.TaxPeriodIds.Length; i++)
            {
                row = dt.NewRow();
                row["ID"] = taxPeriodDto.TaxPeriodIds[i];
                dt.Rows.Add(row);
            }
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _adminModuleConfiguration.SaveTaxPeriodData(taxPeriodDto, dt, userName);
        }

        /*  
        .......................................................................................................
        * This is the GetAddressData service method
        * @param contact_id is used to get lookup value id as a method param
        * GetAddressData() is used to get the address data on the entity popup
        .......................................................................................................
        */
        public async Task<IEnumerable<AddressData>> GetAddressData(int contact_id)
        {
            return await _adminModuleConfiguration.GetAddressData(contact_id);
        }
        /*  
        .......................................................................................................
        * This is the GetCommunicationdata service method
        * @param type is used to get the type as a request header   
        * @param province_id is used to get the province id as a request header 
        * @param country_id is used to get the country id as a request header 
        * @param city_id is used to get the city id as a request header 
        * GetCommunicationdata() is used to get the drop down list values of address section on the entity popup
        .......................................................................................................
        */
        public async Task<IEnumerable<CommunicationDropDownData>> GetCommunicationdata(string type, int? province_id, int? country_id, int? city_id)
        {
            return await _adminModuleConfiguration.GetCommunicationdata(type, province_id, country_id, city_id);
        }
        /*  
       .......................................................................................................
       * This is the GetContactData service method
       * @param misc is used to get the contact data in JSON format as a method param   
       * GetContactData() is used to retrieve the contact data on the entity popup
       .......................................................................................................
       */
        public async Task<IEnumerable<ContactData>> GetContactData(ContactData misc)
        {
            return await _adminModuleConfiguration.GetContactData(misc);
        }
        /*  
       .......................................................................................................
       * This is the GetEmailData service method
       * @param misc is used to retrieve the email data in JSON format as a method param   
       * GetEmailData() is used to retrieve the email data on the entity popup
       .......................................................................................................
       */
        public async Task<IEnumerable<EmailData>> GetEmailData(EmailData misc)
        {
            return await _adminModuleConfiguration.GetEmailData(misc);
        }
        /*  
       .......................................................................................................
       * This is the GetLookUpdata service method
       * @param lookup_type_name is used to get the lookup type name
       * @param lookup_value_id is used to get the lookup value id
       * @param page_no is used to get the page number
       * GetLookUpdata() is used to retrive lookup values for given lookup type
       .......................................................................................................
       */
        public async Task<IEnumerable<LookupData>> GetLookUpdata(string lookup_type, int? lookup_value_id, int? page_no)
        {
            var result = await _adminModuleConfiguration.GetLookUpdata(lookup_type, page_no);
            foreach (LookupData item in result.Item1)
            {
                item.totalrows = result.Item2;
                item.totalselectedrows = result.Item3;
            }
            var result2 = (lookup_value_id != null) ? result.Item1.Where(x => x.lookup_value_id == lookup_value_id).ToList() : result.Item1.ToList();
            return result2;
        }

        /*  
       .......................................................................................................
       * This is the GetMiscData service method
       * @param misc is used to get JSON data as a method parameter to retrive the miscellaneous data       
       * GetMiscData() is used to retrieve the miscellaneous data on the entity popup
       .......................................................................................................
       */
        public async Task<IEnumerable<LookupMiscData>> GetMiscData(LookupMiscData misc)
        {
            var result = await _adminModuleConfiguration.GetMiscData(misc);
            foreach (LookupMiscData item in result.Item1)
            {
                item.totalrows = result.Item2;
            }
            return result.Item1;
        }
        /*  
       .......................................................................................................
       * This is the GetMiscDDLDataByTaxModuleId service method
       * @param lookup_type_name is used to get the lookup type name
       * @param lookup_value_id is used to get the lookup value id
       * GetMiscDDLDataByTaxModuleId() is used to retrieve the lookup values specific to the tax type
       .......................................................................................................
       */
        public async Task<IEnumerable<LookupMiscDropDownData>> GetMiscDDLDataByTaxModuleId(string lookup_type, int lookup_value_id)
        {
            return await _adminModuleConfiguration.GetMiscDDLDataByTaxModuleId(lookup_type, lookup_value_id);
        }
        /*  
      .......................................................................................................
      * This is the GetMiscDropDownpdata service method
      * @param lookup_type_name is used to get the lookup type name
      * @param type is used to get the type of lookup type name like legal,miscellaneous etc.
      * GetMiscDropDownpdata() is used to bind the drop down values on the entity popup
      .......................................................................................................
      */
        public async Task<IEnumerable<LookupMiscDropDownData>> GetMiscDropDownpdata(string lookup_type, string type)
        {
            return await _adminModuleConfiguration.GetMiscDropDownpdata(lookup_type, type);
        }

        public async Task<IEnumerable<TaxPeriodDto>> GetTaxPeriodData(int PageNumber, int Size)
        {
            return await _adminModuleConfiguration.GetTaxPeriodData(PageNumber, Size);
        }

        /*  
        .......................................................................................................
        * This is the SaveLookup service method
        * @param ids is used to get the ids to  in JSON format       
        * SaveLookup() is used to active/inactive selected lookup values
        .......................................................................................................
        */
        public async Task<int> SaveLookup(SaveLookup ids)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < ids.Ids.Length; i++)
            {
                row = dt.NewRow();
                row["ID"] = ids.Ids[i];
                dt.Rows.Add(row);
            }
            return await _adminModuleConfiguration.SaveLookup(dt, ids, userName);
        }

        public async Task<string> TaxModuleName(int tax_module_id)
        {
            var result = await _adminModuleConfiguration.GetLookUpdata("Tax Module", 0);
            IEnumerable<LookupData> data = result.Item1;
            string name = "";
            if (tax_module_id != 0)
            {
                name = data.Where(x => x.lookup_value_id == tax_module_id).Select(x => x.lookup_value_name).FirstOrDefault().ToString();
            }
            return name;
        }
    }
}
