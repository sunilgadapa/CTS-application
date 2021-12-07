using OLDMutual.CTS.ManualDataLoad.Domain.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Data.Interfaces
{
    public interface IManualDataLoad : IDisposable
    {
        Task<IEnumerable<DataLoadDropdown>> GETDropDownData(string type);
        Task<string> GetFileType(int document_id, int file_id);
        Task<IEnumerable<DataLoad>> GETDataLoad(DataLoad data, DataTable dtfiletype, DataTable dtstatus, DataTable dtperiod, DataTable dtloadtype);
        Task<int> DeleteFile(DataTable dt);
        Task<int> DeleteErrorRecord(FileErrorModel lookupdata);
        Task<IEnumerable<DataLoad>> GETDataLoadByid(int file_id);
        Task<int> SignOffFile(SignOffDto lookupdata);
        Task<IEnumerable<DataLoadErrorCol>> GETDataLoadHeadderErrorBy(int file_id, int document_type_id, int page_no, int size);
        Task<IEnumerable<object>> GETDataLoadErrorBy(int file_id, int document_type_id, int page_no, int size);
        Task<int> AddPreferedNewDataError(DataTable dtPerferd);
        Task<int> AddSampleCertificateError(DataTable dtPerferd);
        Task<int> AddAdvisorDataError(DataTable dtPerferd);
        Task<int> AddClientThiredpartyDataError(DataTable dtPerferd);
        Task<int> AddGCSDataError(DataTable dtPerferd);
        Task<IEnumerable<DataLoad>> GetPasDataLoad(DataLoad data, DataTable dtSrcSym, DataTable dtStatus, DataTable dtFileType, DataTable dtTaxPeriodType);
        Task<IEnumerable<DataLoadErrorCol>> GetErrorDescription(int file_id, int document_type_id, DataTable dt);
        Task<IEnumerable<DataLoad>> GetPasFileDataById(int file_id);
        Task<int> UpdateMemberFileErrorData(DataTable dtPerferd);
        Task<int> UpdateAdvisorFileErrorData(DataTable dtPerferd);
        Task<int> UpdateFinanceFileErrorData(DataTable dtPerferd);
        Task<IEnumerable<object>> GetPasDataLoadError(int file_id, int document_type_id, int page_no, int size);
        Task<IEnumerable<DataLoadErrorCol>> GetPasDataLoadErrorHeader(int file_id, int document_type_id, DataTable dtRows);
        Task<int> CheckIfFileHasMissingInformation(int document_type_id, int file_id);
        Task<IEnumerable<MissingInformationDto>> GetMissingInformationByFileId(int document_type_id, int file_id);
        Task<int> AddPasMissingInformation(string UserName, string LookupValueName, string LookupValueDescription, string LookupTypeName, int FileId, string misc_value);
        Task<int> CheckIfLookupExists(string LookupValueName, string LookupTypeName, int FileId, string UserName);
        Task<int> AddMissingTaxPeriodData(TaxPeriodDto taxPeriodDto, string UserName);
        Task<int> ReprocessFile(int DocumentTypeId, int FileId, string UserName);
    }
}