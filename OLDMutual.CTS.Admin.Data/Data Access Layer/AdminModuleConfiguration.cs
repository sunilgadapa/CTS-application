using Dapper;
using OLDMutual.CTS.Admin.Data.Dapper_ORM.Dapper;
using OLDMutual.CTS.Admin.Data.Interfaces;
using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Data.Data_Access_Layer
{
    public class AdminModuleConfiguration : IAdminModuleConfiguration
    {
        private readonly IDapper _dapper;

        public AdminModuleConfiguration(IDapper dapper)
        {
            _dapper = dapper;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            // Cleanup
        }
        /*  
       .......................................................................................................
       * This is the AddEditAddressData DAO mathod
       * @param address is used to get address data in JSON format as a method param 
       * @param username is to get the user name for the current operation
       * AddEditAddressData() is used to add or edit the address data on the entity popup
       .......................................................................................................
       */
        public async Task<int> AddEditAddressData(AddressData address, string username)
        {
            int result;
            string sp = "SP_Communicationdata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@address_id", address.address_id);
            param.Add("@address_type_alias", address.address_type_alias);
            param.Add("@address_line1", address.address_line1);
            param.Add("@address_line2", address.address_line2);
            param.Add("@address_line3", address.address_line3);
            param.Add("@unit_number", address.unit_number);
            param.Add("@postal_code", address.postal_code);
            param.Add("@contact_type_id", address.contact_type_id);
            param.Add("@city", address.city);
            param.Add("@country", address.country);
            param.Add("@street_number", address.street_number);
            param.Add("@suburb", address.suburb);
            param.Add("@province", address.province);
            param.Add("@effective_date", DateTime.ParseExact(address.effective_date, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@expiry_date", address.expiry_date == null ? null : DateTime.ParseExact(address.expiry_date, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@username", username);
            param.Add("@ACTION", "I");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
        .......................................................................................................
        * This is the AddEditCotact DAO method
        * @param dtContact is used to get the data table as a method param
        * @param lookup_value_id is used to get the lookup value id as a method param     
        * AddEditCotact() is used to add or edit the contact data on the entity popup
        .......................................................................................................
        */
        public async Task<int> AddEditCotact(DataTable dtContact, int lookup_value_id)
        {
            int result;
            string sp = "SP_Contactdata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@ACTION", "I");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            if (dtContact.Rows.Count > 0)
            {
                param.Add("@dtContact", dtContact.AsTableValuedParameter());
            }
            param.Add("@lookup_value_id", lookup_value_id);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;


        }
        /*  
        .......................................................................................................
        * This is the AddEditEmail DAO method
        * @param dtEmail is used to get the data table as a method param
        * @param lookup_value_id is used to get the lookup value id as a method param
        * AddEditEmail() is used to add or edit the email data on the entity popup
        .......................................................................................................
        */
        public async Task<int> AddEditEmail(DataTable dtEmail, int lookup_value_id)
        {
            int result;
            string sp = "SP_Emaildata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@ACTION", "I");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            if (dtEmail.Rows.Count > 0)
            {
                param.Add("@dtEmail", dtEmail.AsTableValuedParameter());
            }
            param.Add("@lookup_value_id", lookup_value_id);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
       .......................................................................................................
       * This is the AddEditLookUpdata DAO method
       * @param lookup is used to get data to be inserted in JSON format    
       * @param username is used to get the user name for the current operation
       * AddEditLookUpdata() is used to add or edit the lookup values
       .......................................................................................................
       */
        public async Task<int> AddEditLookUpdata(LookupData lookup, string username)
        {
            int result;
            string sp = "SP_AdminAlldata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_type", lookup.lookup_type_name.Trim());
            param.Add("@lookup_value", lookup.lookup_value_name.Trim());
            param.Add("@lookup_desc", lookup.lookup_value_description.Trim());
            param.Add("@lookup_value_id", lookup.lookup_value_id);
            param.Add("@misc_value", lookup.misc_value);
            param.Add("@username", username);
            if (lookup.lookup_value_id == 0)
            {                
                param.Add("@ACTION", "I");
            }
            else if (lookup.lookup_value_id == null)
            {
                param.Add("@ACTION", "I");
            }
            else
            {
                param.Add("@ACTION", "U");
            }

            param.Add("@RowsChanged", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsChanged", param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
        .......................................................................................................
        * This is the AddEditMisc DAO method
        * @param dtmiscellenousdata is used to get the data table as a method param to store the miscellaneous data 
        * @param lookup_value_id is used to get the lookup value id
        * AddEditMisc() is used to store the miscellaneous data on the entity popup
        .......................................................................................................
        */
        public async Task<int> AddEditMisc(DataTable dtmiscellenousdata, int lookup_value_id)
        {
            int result;
            string sp = "SP_AdminAllMiscdata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@ACTION", "I");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            if (dtmiscellenousdata.Rows.Count > 0)
            {
                param.Add("@dtMiscellaneous", dtmiscellenousdata.AsTableValuedParameter());
            }
            param.Add("@lookup_value_id", lookup_value_id);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;


        }
        /*  
       .......................................................................................................
       * This is the GetAddressData DAO method
       * @param contact_type_id is used to get lookup value id as a method param
       * GetAddressData() is used to get the address data on the entity popup
       .......................................................................................................
       */
        public async Task<IEnumerable<AddressData>> GetAddressData(int contact_type_id)
        {
            string sp = "SP_Communicationdata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@contact_type_id", contact_type_id);
            param.Add("@ACTION", "G");
            var result = await Task.FromResult(_dapper.GetAll<AddressData>(sp, param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
        .......................................................................................................
        * This is the GetCommunicationdata DAO method
        * @param type is used to get the type as a request header   
        * @param province_id is used to get the province id as a request header 
        * @param country_id is used to get the country id as a request header 
        * @param city_id is used to get the city id as a request header 
        * GetCommunicationdata() is used to get the drop down list values of address section on the entity popup
        .......................................................................................................
        */
        public async Task<IEnumerable<CommunicationDropDownData>> GetCommunicationdata(string type, int? province_id, int? country_id, int? city_id)
        {
            string sp = "SP_CommunicationDropdownData";
            DynamicParameters param = new DynamicParameters();
            param.Add("@type", type);
            param.Add("@province_id", province_id);
            param.Add("@country_id", country_id);
            param.Add("@city_id", city_id);
            var result = await Task.FromResult(_dapper.GetAll<CommunicationDropDownData>(sp, param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
       .......................................................................................................
       * This is the GetContactData DAO method
       * @param misc is used to get the contact data in JSON format as a method param   
       * GetContactData() is used to retrieve the contact data on the entity popup
       .......................................................................................................
       */
        public async Task<IEnumerable<ContactData>> GetContactData(ContactData misc)
        {
            string sp = "SP_Contactdata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_value_id", misc.contact_id);
            param.Add("@Page", misc.Page);
            param.Add("@Size", misc.Size);
            param.Add("@search", misc.SearchText);
            param.Add("@ACTION", "G");
            var result = await Task.FromResult(_dapper.GetAll<ContactData>(sp, param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
       .......................................................................................................
       * This is the GetEmailData DAO method
       * @param misc is used to retrieve the email data in JSON format as a method param   
       * GetEmailData() is used to retrieve the email data on the entity popup
       .......................................................................................................
       */
        public async Task<IEnumerable<EmailData>> GetEmailData(EmailData misc)
        {
            string sp = "SP_Emaildata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_value_id", misc.contact_id);
            param.Add("@Page", misc.Page);
            param.Add("@Size", misc.Size);
            param.Add("@search", misc.SearchText);
            param.Add("@ACTION", "G");
            var result = await Task.FromResult(_dapper.GetAll<EmailData>(sp, param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
       .......................................................................................................
       * This is the GetLookUpdata DAO method
       * @param lookup_type_name is used to get the lookup type name       
       * @param page_no is used to get the page number
       * GetLookUpdata() is used to retrive lookup values for given lookup type
       .......................................................................................................
       */
        public async Task<Tuple<IEnumerable<LookupData>, int, int>> GetLookUpdata(string lookup_type, int? page_no)
        {
            string sp = "SP_AdminAlldata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_type", lookup_type);
            param.Add("@ACTION", "G");
            param.Add("@page", (page_no == null) ? 0 : page_no);
            param.Add("@RowsChanged", DbType.Int32, direction: ParameterDirection.Output);
            param.Add("@RowSelectedCount", DbType.Int32, direction: ParameterDirection.Output);
            var result = await Task.FromResult(_dapper.GetAll<LookupData>(sp, param, commandType: CommandType.StoredProcedure));
            return Tuple.Create(result, param.Get<int>("@RowsChanged"), param.Get<int>("@RowSelectedCount"));

        }
        /*  
       .......................................................................................................
       * This is the GetMiscData service method
       * @param misc is used to get JSON data as a method parameter to retrive the miscellaneous data       
       * GetMiscData() is used to retrieve the miscellaneous data on the entity popup
       .......................................................................................................
       */
        public async Task<Tuple<IEnumerable<LookupMiscData>, int>> GetMiscData(LookupMiscData misc)
        {
            string sp = "SP_AdminAllMiscdata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_value_id", misc.contact_id);
            param.Add("@contact_type", misc.contact_type);
            param.Add("@Page", misc.Page);
            param.Add("@Size", misc.Size);
            param.Add("@search", misc.SearchText);
            param.Add("@ACTION", "G");
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            var result = await Task.FromResult(_dapper.GetAll<LookupMiscData>(sp, param, commandType: CommandType.StoredProcedure));
            return Tuple.Create(result, param.Get<int>("@RowsAffected"));

        }
        /*  
       .......................................................................................................
       * This is the GetMiscDDLDataByTaxModuleId DAO method
       * @param lookup_type_name is used to get the lookup type name
       * @param lookup_value_id is used to get the lookup value id
       * GetMiscDDLDataByTaxModuleId() is used to retrieve the lookup values specific to the tax type
       .......................................................................................................
       */
        public async Task<IEnumerable<LookupMiscDropDownData>> GetMiscDDLDataByTaxModuleId(string lookup_type, int lookup_value_id)
        {
            string sp = "SP_GetMiscellaneousDDLByTaxModuleId";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_type", lookup_type);
            param.Add("@lookup_value_id", lookup_value_id);
            var result = await Task.FromResult(_dapper.GetAll<LookupMiscDropDownData>(sp, param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
     .......................................................................................................
     * This is the GetMiscDropDownpdata DAO method
     * @param lookup_type_name is used to get the lookup type name
     * @param type is used to get the type of lookup type name like legal,miscellaneous etc.
     * GetMiscDropDownpdata() is used to bind the drop down values on the entity popup
     .......................................................................................................
     */
        public async Task<IEnumerable<LookupMiscDropDownData>> GetMiscDropDownpdata(string lookup_type, string type)
        {
            string sp = "SP_Miscellenusdropdown";
            DynamicParameters param = new DynamicParameters();
            param.Add("@lookup_type", lookup_type);
            param.Add("@type", type);
            var result = await Task.FromResult(_dapper.GetAll<LookupMiscDropDownData>(sp, param, commandType: CommandType.StoredProcedure));
            return result;

        }
        /*  
     .......................................................................................................
     * This is the SaveLookup DAO method
     * @param ids is used to get the ids to  in JSON format    
     * @param username is used to get the user name for the current operation   
     * SaveLookup() is used to active/inactive selected lookup values
     .......................................................................................................
     */
        public async Task<int> SaveLookup(DataTable dt, SaveLookup ids, string username)
        {
            int result;
            string sp = "SP_AdminAlldata";
            DynamicParameters param = new DynamicParameters();
            param.Add("@dtlookupTosave", dt.AsTableValuedParameter());
            param.Add("@ACTION", "S");
            param.Add("@lookup_type", ids.lookup_type_name);
            param.Add("@Page", ids.page);
            param.Add("@Size", ids.size);
            param.Add("@username", username);
            param.Add("@RowsChanged", DbType.Int32, direction: ParameterDirection.Output);
            result = await Task.FromResult(_dapper.Execute(sp, "@RowsChanged", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<IEnumerable<TaxPeriodDto>> GetTaxPeriodData(int PageNumber, int Size)
        {
            string sp = "SP_GetTaxPeriodData";
            DynamicParameters param = new DynamicParameters();
            param.Add("@Page", PageNumber);
            param.Add("@Size", Size);
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            var result = await Task.FromResult(_dapper.GetAll<TaxPeriodDto>(sp, param, commandType: CommandType.StoredProcedure));

            int val = param.Get<int>("@RowsAffected");
            result.ToList().ForEach(x => x.TotalRows = val);
            return result;
        }

        public async Task<int> AddEditTaxPeriodData(TaxPeriodDto taxPeriodDto, string UserName)
        {
            string sp = "SP_AddEditSaveTaxPeriodData";
            DynamicParameters param = new DynamicParameters();
            param.Add("@TaxPeriodId", taxPeriodDto.TaxPeriodId);
            param.Add("@TaxTypeId", taxPeriodDto.TaxTypeId);
            param.Add("@TaxYear", taxPeriodDto.TaxYear);
            param.Add("@TaxPeriodTypeId", taxPeriodDto.TaxPeriodTypeId);
            param.Add("@TaxPeriodDescription", taxPeriodDto.TaxPeriodDescription);
            param.Add("@SubmissionPeriodStart", DateTime.ParseExact(taxPeriodDto.SubmissionStartDate, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@SubmissionPeriodEnd", DateTime.ParseExact(taxPeriodDto.SubmissionEndDate, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@LandingPeriodStart", DateTime.ParseExact(taxPeriodDto.LandingStartDate, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@LandingPeriodEnd", DateTime.ParseExact(taxPeriodDto.LandingEndDate, "dd/MM/yyyy", new System.Globalization.CultureInfo("en-US")));
            param.Add("@UserName", UserName);
            param.Add("@Action", taxPeriodDto.TaxPeriodId > 0 ? 'U' : 'I');
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            int result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }

        public async Task<int> SaveTaxPeriodData(TaxPeriodDto taxPeriodDto,DataTable dtTaxPeriodIds, string UserName)
        {
            string sp = "SP_AddEditSaveTaxPeriodData";
            DynamicParameters param = new DynamicParameters();
            param.Add("@DtTaxPeriodIds", dtTaxPeriodIds.AsTableValuedParameter());
            param.Add("@Page", taxPeriodDto.PageNumber);
            param.Add("@Size", taxPeriodDto.Size);
            param.Add("@UserName", UserName);
            param.Add("@Action", 'S');
            param.Add("@RowsAffected", DbType.Int32, direction: ParameterDirection.Output);
            int result = await Task.FromResult(_dapper.Execute(sp, "@RowsAffected", param, commandType: CommandType.StoredProcedure));
            return result;
        }
    }
}
