using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Data.Interfaces
{
    public interface IAdminModuleConfiguration:IDisposable
    {
        Task<Tuple<IEnumerable<LookupData>, int,int>> GetLookUpdata(string lookup_type, int? page_no);
        Task<int> AddEditLookUpdata(LookupData lookup, string username);
        Task<int> SaveLookup(DataTable dt,SaveLookup ids, string username);
        Task<IEnumerable<LookupMiscDropDownData>> GetMiscDropDownpdata(string lookup_type, string type);
        Task<IEnumerable<LookupMiscDropDownData>> GetMiscDDLDataByTaxModuleId(string lookup_type, int lookup_value_id);
        Task<Tuple<IEnumerable<LookupMiscData>, int>> GetMiscData(LookupMiscData misc);
        Task<int> AddEditMisc(DataTable dtmiscellenousdata, int lookup_value_id);
        Task<IEnumerable<CommunicationDropDownData>> GetCommunicationdata(string type, int? province_id, int? country_id, int? city_id);
        Task<IEnumerable<AddressData>> GetAddressData(int contact_type_id);
        Task<int> AddEditAddressData(AddressData address, string username);
        Task<IEnumerable<EmailData>> GetEmailData(EmailData misc);
        Task<int> AddEditEmail(DataTable dtEmail, int lookup_value_id);
        Task<IEnumerable<ContactData>> GetContactData(ContactData misc);
        Task<int> AddEditCotact(DataTable dtContact, int lookup_value_id);
        Task<IEnumerable<TaxPeriodDto>> GetTaxPeriodData(int PageNumber, int Size);
        Task<int> AddEditTaxPeriodData(TaxPeriodDto taxPeriodDto, string UserName);
        Task<int> SaveTaxPeriodData(TaxPeriodDto taxPeriodDto,DataTable dtTaxPeriodIds, string UserName);
    }
}
