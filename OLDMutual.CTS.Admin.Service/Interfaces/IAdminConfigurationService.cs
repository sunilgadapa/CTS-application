using OLDMutual.CTS.Admin.Domain.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace OLDMutual.CTS.Admin.Service.Interfaces
{
    public interface IAdminConfigurationService
    {
        Task<IEnumerable<LookupData>> GetLookUpdata(string lookup_type, int? lookup_value_id, int? page_no);
        Task<int> AddEditLookUpdata(LookupData lookup);
        Task<int> SaveLookup(SaveLookup ids);
        Task<IEnumerable<LookupMiscDropDownData>> GetMiscDropDownpdata(string lookup_type, string type);
        Task<IEnumerable<LookupMiscDropDownData>> GetMiscDDLDataByTaxModuleId(string lookup_type, int lookup_value_id);
        Task<IEnumerable<LookupMiscData>> GetMiscData(LookupMiscData misc);
        Task<int> AddEditMisc(List<LookupMiscData> misc);
        Task<IEnumerable<CommunicationDropDownData>> GetCommunicationdata(string type, int? province_id, int? country_id, int? city_id);
        Task<IEnumerable<AddressData>> GetAddressData(int contact_id);
        Task<int> AddEditAddressData(AddressData address);
        Task<IEnumerable<EmailData>> GetEmailData(EmailData misc);
        Task<int> AddEditEmail(List<EmailData> email);
        Task<IEnumerable<ContactData>> GetContactData(ContactData misc);
        Task<int> AddEditCotact(List<ContactData> contact);
        Task<string> TaxModuleName(int tax_module_id);
        Task<IEnumerable<TaxPeriodDto>> GetTaxPeriodData(int PageNumber, int Size);
        Task<int> AddEditTaxPeriodData(TaxPeriodDto taxPeriodDto);
        Task<int> SaveTaxPeriodData(TaxPeriodDto taxPeriodDto);
    }
}
