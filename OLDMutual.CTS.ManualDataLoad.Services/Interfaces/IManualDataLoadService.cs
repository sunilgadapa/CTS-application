using Amazon.S3.Model;
using OLDMutual.CTS.ManualDataLoad.Domain.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace OLDMutual.CTS.ManualDataLoad.Service.Interfaces
{
    public interface IManualDataLoadService
    {
        Task<IEnumerable<DataLoadDropdown>> GETDropDownData(string type);
        Task<IEnumerable<DataLoad>> GETDataLoad(DataLoad data);
        Task<int> DeleteFile(List<FileModel> lookupdata);
        Task<int> DeleteErrorRecord(FileErrorModel lookupdata);
        Task<IEnumerable<DataLoad>> GETDataLoadByid(int file_id);
        Task<string> GetFileType(int document_id, int file_id);
        Task<int> SignOffFile(SignOffDto lookupdata);
        Task<IEnumerable<object>> GETDataLoadErrorBy(int file_id, int document_type_id, int page_no, int size);
        Task<ValidationErrorDto> GETDataLoadHeadderErrorBy(int file_id, int document_type_id, int page_no, int size);
        Task<int> AddPreferedNewDataError(List<StgItcPreferredCorrespondence> Pdata);
        Task<int> AddSampleCertificateError(List<StgItcSampleCertificates> Pdata);
        Task<int> AddAdvisorDataError(List<StgItcIntermediaryData> Pdata);
        Task<IEnumerable<DataLoad>> GetPasDataLoad(DataLoad data);
        Task<int> AddClientThiredpartyDataError(List<StgItcClientDetailData> Pdata);
        Task<int> AddGCSDataError(List<StgClientGcsResponse> Pdata);
        Task<Tuple<GetObjectRequest, bool>> DownloadFile(int file_id, string file_name, string archivedfoldername, string pickupfoldername, string manualpickupfoldername, string errorsfoldername);
        Task<Tuple<string, bool>> CheckIfFilExistsInFolder(FileModel lookupdata, string archivedfoldername, string pickupfoldername, string manualpickupfoldername, string errorsfoldername);
        Task<IEnumerable<DataLoad>> GetPasFileDataById(int file_id);
        Task<int> UpdateMemberFileErrorData(List<StgItcMembershipDetails> Pdata);
        Task<int> UpdateAdvisorFileErrorData(List<StgItcAdvisorDetails> Pdata);
        Task<int> UpdateFinanceFileErrorData(List<StgItcFinanceDetails> Pdata);
        Task<IEnumerable<object>> GetPasDataLoadError(int file_id, int document_type_id, int page_no, int size);
        Task<ValidationErrorDto> GetPasDataLoadErrorHeader(int file_id, int document_type_id, int page_no, int size);
        Task<int> CheckIfFileHasMissingInformation(int document_type_id, int file_id);
        Task<IEnumerable<MissingInformationDto>> GetMissingInformationByFileId(int document_type_id, int file_id);
        Task<int> AddPasMissingInformation(string LookupValueName, string LookupValueDescription, string LookupTypeName, int FileId, string misc_value);
        Task<int> CheckIfLookupExists(string LookupValueName, string LookupTypeName, int FileId);
        Task<int> AddMissingTaxPeriodData(TaxPeriodDto taxPeriodDto);
        Task<int> ReprocessFile(int DocumentTypeId, int FileId);
    }
}
