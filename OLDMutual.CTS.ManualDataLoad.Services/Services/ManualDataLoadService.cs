using Amazon.S3.Model;
using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.ManualDataLoad.Data.Interfaces;
using OLDMutual.CTS.ManualDataLoad.Domain.Models;
using OLDMutual.CTS.ManualDataLoad.Service.Interfaces;
using OLDMutual.CTS.ManualDataLoad.Shared.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Service.Services
{

    public class ManualDataLoadService : IManualDataLoadService
    {
        private readonly IManualDataLoad _manualDataLoad;
        private readonly IAwsS3BucketHelperService _buckethelper;
        private readonly IConfigurationSettings _configurationSettings;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ManualDataLoadService(IManualDataLoad manualDataLoad, IAwsS3BucketHelperService buckethelper, IConfigurationSettings configurationSettings, IHttpContextAccessor httpContextAccessor)
        {
            _manualDataLoad = manualDataLoad;
            _buckethelper = buckethelper;
            _configurationSettings = configurationSettings;
            _httpContextAccessor = httpContextAccessor;
        }

        /*  
       .......................................................................................................
       * This is the GetDropdowndata service method
       * @param type is used to specify the name of the drop down list
       * GetDropdowndata() is used to get drop down data on manual data load page
       .......................................................................................................
       */
        public async Task<IEnumerable<DataLoadDropdown>> GETDropDownData(string type)
        {
            var result = await _manualDataLoad.GETDropDownData(type);
            return result;
        }

        public async Task<string> GetFileType(int document_id, int file_id)
        {
            var result = await _manualDataLoad.GetFileType(document_id, file_id);
            return result;
        }
        /*  
       .......................................................................................................
       * This is the GetDataLoad service method 
       * @param data is used to specify the name filter data in a JSON format as a method param
       * GetDataLoad() is used to get files data on the manual data load page by selected filters
       .......................................................................................................
       */
        public async Task<IEnumerable<DataLoad>> GETDataLoad(DataLoad data)
        {
            DataTable dtfiletype = new DataTable();
            dtfiletype.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < data.file_type.Length; i++)
            {
                row = dtfiletype.NewRow();
                row["ID"] = data.file_type[i];
                dtfiletype.Rows.Add(row);
            }

            DataTable dtstatus = new DataTable();
            dtstatus.Columns.Add("ID", typeof(int));
            for (int i = 0; i < data.status_type.Length; i++)
            {
                row = dtstatus.NewRow();
                row["ID"] = data.status_type[i];
                dtstatus.Rows.Add(row);
            }

            DataTable dtperiod = new DataTable();
            dtperiod.Columns.Add("ID", typeof(int));
            for (int i = 0; i < data.period_val.Length; i++)
            {
                if (data.period_val[i] != 0)
                {
                    row = dtperiod.NewRow();
                    row["ID"] = data.period_val[i];
                    dtperiod.Rows.Add(row);
                }
            }

            DataTable dtloadtype = new DataTable();
            dtloadtype.Columns.Add("ID", typeof(int));
            for (int i = 0; i < data.Load_Type_val.Length; i++)
            {
                row = dtloadtype.NewRow();
                row["ID"] = data.Load_Type_val[i];
                dtloadtype.Rows.Add(row);
            }
            var result = await _manualDataLoad.GETDataLoad(data, dtfiletype, dtstatus, dtperiod, dtloadtype);

            foreach (DataLoad item in result)
            {
                if (!string.IsNullOrEmpty(item.TaxYears) && item.TaxYears.Contains(","))
                    item.strTaxYears = item.TaxYears.Split(',');
            }
            return result;

        }

        /*  
        .......................................................................................................
        * This is the DeleteFile service method
        * @param lookupdata is used to get the data in JSON format as method param    
        * DeleteFile() is used to delte the file from a S3 bucket
        .......................................................................................................
        */
        public async Task<int> DeleteFile(List<FileModel> lookupdata)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < lookupdata.Count; i++)
            {
                row = dt.NewRow();
                row["ID"] = lookupdata[i].Ids;
                dt.Rows.Add(row);
            }
            int result = await _manualDataLoad.DeleteFile(dt);
            return result;
        }

        public async Task<int> DeleteErrorRecord(FileErrorModel lookupdata)
        {
            int result = await _manualDataLoad.DeleteErrorRecord(lookupdata);
            return result;
        }
        /*  
       .......................................................................................................
       * This is the GetFileDataById service method
       * @param file_id is used to get the file id as a method param
       * GetFileDataById() is used to get the file details by id
       .......................................................................................................
       */
        public async Task<IEnumerable<DataLoad>> GETDataLoadByid(int file_id)
        {
            var result = await _manualDataLoad.GETDataLoadByid(file_id);
            foreach (DataLoad item in result)
            {
                if (!string.IsNullOrEmpty(item.TaxYears) && item.TaxYears.Contains(","))
                    item.strTaxYears = item.TaxYears.Split(',');
            }
            return result;
        }

        public async Task<int> SignOffFile(SignOffDto lookupdata)
        {
            int result = await _manualDataLoad.SignOffFile(lookupdata);
            return result;
        }
        /*  
      .......................................................................................................
      * This is the GETDataLoadHeadderErrorBy service method
      * @param file_id is used to get the file id as a method param
      * @param documment_type_id is used to get the file type id as a method param
      * @param page_no is used to get the page number as a method param
      * @param size is used to get the page size as a method param
      * GETDataLoadHeadderErrorBy() is used to get the data load error headers
      .......................................................................................................
      */
        public async Task<ValidationErrorDto> GETDataLoadHeadderErrorBy(int file_id, int document_type_id, int page_no, int size)
        {
            var result = await _manualDataLoad.GETDataLoadHeadderErrorBy(file_id, document_type_id, page_no, size);
            ValidationErrorDto objalidationErrorDto = new ValidationErrorDto();
            objalidationErrorDto.lstDataLoadErrorHeader = result.ToList();
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < objalidationErrorDto.lstDataLoadErrorHeader.Count; i++)
            {
                row = dt.NewRow();
                row["ID"] = objalidationErrorDto.lstDataLoadErrorHeader[i].row_id;
                dt.Rows.Add(row);
            }
            var result2 = await _manualDataLoad.GetErrorDescription(file_id, document_type_id, dt);
            objalidationErrorDto.lstDataLoadErrorDecription = result2.ToList();
            return objalidationErrorDto;
        }

        /*  
       .......................................................................................................
       * This is the GetDataLoadError service method
       * @param file_id is used to get the file id as a method paramr
       * @param documment_type_id is used to get the file type id as a method paramr
       * @param page_no is used to get the page number as a method paramr
       * @param size is used to get the page size as a method paramr
       * GetDataLoadError() is used to the data load errors
       .......................................................................................................
       */
        public async Task<IEnumerable<object>> GETDataLoadErrorBy(int file_id, int document_type_id, int page_no, int size)
        {
            var result = await _manualDataLoad.GETDataLoadErrorBy(file_id, document_type_id, page_no, size);
            return result;
        }
        /*  
    .......................................................................................................
    * This is the AddPreferedNewDataError service method  
    * @param ErrorData is used to get the data in a JSON format as a method param         
    * AddPreferedNewDataError() is used to update the preffered correspondence error data
    .......................................................................................................
    */
        public async Task<int> AddPreferedNewDataError(List<StgItcPreferredCorrespondence> Pdata)
        {
            DataRow row;

            DataTable dtPerferd = new DataTable();

            dtPerferd.Columns.Add("row_id", typeof(int));
            dtPerferd.Columns.Add("TaxYear", typeof(string));
            dtPerferd.Columns.Add("SourceSystemID", typeof(string));
            dtPerferd.Columns.Add("ClientID", typeof(string));
            dtPerferd.Columns.Add("Title", typeof(string));
            dtPerferd.Columns.Add("FirstName", typeof(string));
            dtPerferd.Columns.Add("Surname", typeof(string));
            dtPerferd.Columns.Add("EmailAddress", typeof(string));
            dtPerferd.Columns.Add("MobileNumber", typeof(string));
            dtPerferd.Columns.Add("file_id", typeof(int));
            dtPerferd.Columns.Add("status_code", typeof(int));
            dtPerferd.Columns.Add("batch_id", typeof(int));
            dtPerferd.Columns.Add("job_id", typeof(int));
            dtPerferd.Columns.Add("status_flag", typeof(bool));
            dtPerferd.Columns.Add("created_date", typeof(DateTime));
            dtPerferd.Columns.Add("last_updated_date", typeof(DateTime));

            if (Pdata.Count > 0)
            {
                foreach (var ptypedata in Pdata)
                {
                    row = dtPerferd.NewRow();
                    row["row_id"] = ptypedata.row_id;
                    row["TaxYear"] = ptypedata.TaxYear == "null" ? "" : ptypedata.TaxYear;
                    row["SourceSystemID"] = ptypedata.SourceSystemID == "null" ? "" : ptypedata.SourceSystemID;
                    row["ClientID"] = ptypedata.ClientID == "null" ? "" : ptypedata.ClientID;
                    row["Title"] = ptypedata.Title == "null" ? "" : ptypedata.Title;
                    row["FirstName"] = ptypedata.FirstName == "null" ? "" : ptypedata.FirstName;
                    row["Surname"] = ptypedata.Surname == "null" ? "" : ptypedata.Surname;
                    row["EmailAddress"] = ptypedata.EmailAddress == "null" ? "" : ptypedata.EmailAddress;
                    row["MobileNumber"] = ptypedata.MobileNumber == "null" ? "" : ptypedata.MobileNumber;
                    row["file_id"] = ptypedata.file_id;
                    row["status_code"] = 1108;
                    row["batch_id"] = ptypedata.batch_id;
                    row["job_id"] = ptypedata.job_id;
                    row["status_flag"] = true;
                    row["created_date"] = DateTime.Now;
                    row["last_updated_date"] = DateTime.Now;
                    dtPerferd.Rows.Add(row);
                }
            }
            return await _manualDataLoad.AddPreferedNewDataError(dtPerferd);
        }
        /*  
    .......................................................................................................
    * This is the AddSampleCertificateError service method  
    * @param ErrorData is used to get the data in a JSON format as a method param         
    * AddSampleCertificateError() is used to update thesample certificate file error data
    .......................................................................................................
    */
        public async Task<int> AddSampleCertificateError(List<StgItcSampleCertificates> Pdata)
        {
            DataRow row;

            DataTable dtPerferd = new DataTable();

            dtPerferd.Columns.Add("row_id", typeof(int));
            dtPerferd.Columns.Add("TaxYear", typeof(string));
            dtPerferd.Columns.Add("SourceSystemID", typeof(string));
            dtPerferd.Columns.Add("Brand", typeof(string));
            dtPerferd.Columns.Add("ClientID", typeof(string));
            dtPerferd.Columns.Add("file_id", typeof(int));
            dtPerferd.Columns.Add("status_code", typeof(int));
            dtPerferd.Columns.Add("batch_id", typeof(int));
            dtPerferd.Columns.Add("job_id", typeof(int));
            dtPerferd.Columns.Add("status_flag", typeof(int));
            dtPerferd.Columns.Add("created_by", typeof(string));
            dtPerferd.Columns.Add("last_updated_by", typeof(string));
            dtPerferd.Columns.Add("created_date", typeof(DateTime));
            dtPerferd.Columns.Add("last_updated_date", typeof(DateTime));

            if (Pdata.Count > 0)
            {
                foreach (var ptypedata in Pdata)
                {
                    row = dtPerferd.NewRow();
                    row["row_id"] = ptypedata.row_id;
                    row["TaxYear"] = ptypedata.TaxYear == "null" ? "" : ptypedata.TaxYear;
                    row["SourceSystemID"] = ptypedata.SourceSystemID == "null" ? "" : ptypedata.SourceSystemID;
                    row["Brand"] = ptypedata.Brand == "null" ? "" : ptypedata.Brand;
                    row["ClientID"] = ptypedata.ClientID == "null" ? "" : ptypedata.ClientID;
                    row["file_id"] = ptypedata.file_id;
                    row["status_code"] = 1108;
                    row["batch_id"] = ptypedata.batch_id;
                    row["job_id"] = ptypedata.job_id;
                    row["status_flag"] = true;
                    row["created_by"] = string.Empty;
                    row["last_updated_by"] = string.Empty;
                    row["created_date"] = DateTime.Now;
                    row["last_updated_date"] = DateTime.Now;
                    dtPerferd.Rows.Add(row);
                }
            }

            return await _manualDataLoad.AddSampleCertificateError(dtPerferd);
        }
        /*  
    .......................................................................................................
    * This is the AddAdvisorDataError service method  
    * @param ErrorData is used to get the data in a JSON format as a method param         
    * AddAdvisorDataError() is used to update the advisor file error data
    .......................................................................................................
    */
        public async Task<int> AddAdvisorDataError(List<StgItcIntermediaryData> Pdata)
        {
            DataRow row;
            DataTable dtPerferd = new DataTable();

            dtPerferd.Columns.Add("row_id", typeof(int));
            dtPerferd.Columns.Add("MDMID", typeof(string));
            dtPerferd.Columns.Add("AdvisorID", typeof(string));
            dtPerferd.Columns.Add("AdvisorIDEffectiveDate", typeof(string));
            dtPerferd.Columns.Add("AdvisorIDExpiryDate", typeof(string));
            dtPerferd.Columns.Add("AdvisorIDStatus", typeof(string));
            dtPerferd.Columns.Add("ChannelNo", typeof(string));
            dtPerferd.Columns.Add("ChannelDescr", typeof(string));
            dtPerferd.Columns.Add("NatureOfPerson", typeof(string));
            dtPerferd.Columns.Add("Surname", typeof(string));
            dtPerferd.Columns.Add("Initials", typeof(string));
            dtPerferd.Columns.Add("FirstNames", typeof(string));
            dtPerferd.Columns.Add("IDNumber", typeof(string));
            dtPerferd.Columns.Add("IDCountryOfIssue", typeof(string));
            dtPerferd.Columns.Add("PassportNumber", typeof(string));
            dtPerferd.Columns.Add("PassportCountryOfIssue", typeof(string));
            dtPerferd.Columns.Add("TaxNumber", typeof(string));
            dtPerferd.Columns.Add("TaxNumberCountryOfIssue", typeof(string));
            dtPerferd.Columns.Add("CompanyNumber", typeof(string));
            dtPerferd.Columns.Add("CompanyNumberIssueCountry", typeof(string));
            dtPerferd.Columns.Add("Birthdate", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressLine1", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressLine2", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressLine3", typeof(string));
            dtPerferd.Columns.Add("PhysicalCity", typeof(string));
            dtPerferd.Columns.Add("PhysicalPostCode", typeof(string));
            dtPerferd.Columns.Add("PhysicalCountry", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine1", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine2", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine3", typeof(string));
            dtPerferd.Columns.Add("PostalCity", typeof(string));
            dtPerferd.Columns.Add("PostalPostCode", typeof(string));
            dtPerferd.Columns.Add("PostalCountry", typeof(string));
            dtPerferd.Columns.Add("LicenceNumber", typeof(string));
            dtPerferd.Columns.Add("file_id", typeof(int));
            dtPerferd.Columns.Add("status_code", typeof(int));
            dtPerferd.Columns.Add("batch_id", typeof(int));
            dtPerferd.Columns.Add("job_id", typeof(int));
            dtPerferd.Columns.Add("status_flag", typeof(int));
            dtPerferd.Columns.Add("created_by", typeof(string));
            dtPerferd.Columns.Add("last_updated_by", typeof(string));
            dtPerferd.Columns.Add("created_date", typeof(DateTime));
            dtPerferd.Columns.Add("last_updated_date", typeof(DateTime));


            if (Pdata.Count > 0)
            {

                foreach (var ptypedata in Pdata)
                {
                    row = dtPerferd.NewRow();
                    row["row_id"] = ptypedata.row_id;
                    row["MDMID"] = ptypedata.MDMID == "null" ? "" : ptypedata.MDMID;
                    row["AdvisorID"] = ptypedata.AdvisorID == "null" ? "" : ptypedata.AdvisorID;
                    row["AdvisorIDEffectiveDate"] = ptypedata.AdvisorIDEffectiveDate == "null" ? "" : ptypedata.AdvisorIDEffectiveDate;
                    row["AdvisorIDExpiryDate"] = ptypedata.AdvisorIDExpiryDate == "null" ? "" : ptypedata.AdvisorIDExpiryDate;
                    row["AdvisorIDStatus"] = ptypedata.AdvisorIDStatus == "null" ? "" : ptypedata.AdvisorIDStatus;
                    row["ChannelNo"] = ptypedata.ChannelNo == "null" ? "" : ptypedata.ChannelNo;
                    row["ChannelDescr"] = ptypedata.ChannelDescr == "null" ? "" : ptypedata.ChannelDescr;
                    row["NatureOfPerson"] = ptypedata.NatureOfPerson == "null" ? "" : ptypedata.NatureOfPerson;
                    row["Surname"] = ptypedata.Surname == "null" ? "" : ptypedata.Surname;
                    row["Initials"] = ptypedata.Initials == "null" ? "" : ptypedata.Initials;
                    row["FirstNames"] = ptypedata.FirstNames == "null" ? "" : ptypedata.FirstNames;
                    row["IDNumber"] = ptypedata.IDNumber == "null" ? "" : ptypedata.IDNumber;
                    row["IDCountryOfIssue"] = ptypedata.IDCountryOfIssue == "null" ? "" : ptypedata.IDCountryOfIssue;
                    row["PassportNumber"] = ptypedata.PassportNumber == "null" ? "" : ptypedata.PassportNumber;
                    row["PassportCountryOfIssue"] = ptypedata.PassportCountryOfIssue == "null" ? "" : ptypedata.PassportCountryOfIssue;
                    row["TaxNumber"] = ptypedata.TaxNumber == "null" ? "" : ptypedata.TaxNumber;
                    row["TaxNumberCountryOfIssue"] = ptypedata.TaxNumberCountryOfIssue == "null" ? "" : ptypedata.TaxNumberCountryOfIssue;
                    row["CompanyNumber"] = ptypedata.CompanyNumber == "null" ? "" : ptypedata.CompanyNumber;
                    row["CompanyNumberIssueCountry"] = ptypedata.CompanyNumberIssueCountry == "null" ? "" : ptypedata.CompanyNumberIssueCountry;
                    row["Birthdate"] = ptypedata.Birthdate == "null" ? "" : ptypedata.Birthdate;
                    row["PhysicalAddressLine1"] = ptypedata.PhysicalAddressLine1 == "null" ? "" : ptypedata.PhysicalAddressLine1;
                    row["PhysicalAddressLine2"] = ptypedata.PhysicalAddressLine2 == "null" ? "" : ptypedata.PhysicalAddressLine2;
                    row["PhysicalAddressLine3"] = ptypedata.PhysicalAddressLine3 == "null" ? "" : ptypedata.PhysicalAddressLine3;
                    row["PhysicalCity"] = ptypedata.PhysicalCity == "null" ? "" : ptypedata.PhysicalCity;
                    row["PhysicalPostCode"] = ptypedata.PhysicalPostCode == "null" ? "" : ptypedata.PhysicalPostCode;
                    row["PhysicalCountry"] = ptypedata.PhysicalCountry == "null" ? "" : ptypedata.PhysicalCountry;
                    row["PostalAddressLine1"] = ptypedata.PostalAddressLine1 == "null" ? "" : ptypedata.PostalAddressLine1;
                    row["PostalAddressLine2"] = ptypedata.PostalAddressLine2 == "null" ? "" : ptypedata.PostalAddressLine2;
                    row["PostalAddressLine3"] = ptypedata.PostalAddressLine3 == "null" ? "" : ptypedata.PostalAddressLine3;
                    row["PostalCity"] = ptypedata.PostalCity == "null" ? "" : ptypedata.PostalCity;
                    row["PostalPostCode"] = ptypedata.PostalPostCode == "null" ? "" : ptypedata.PostalPostCode;
                    row["PostalCountry"] = ptypedata.PostalCountry == "null" ? "" : ptypedata.PostalCountry;
                    row["LicenceNumber"] = ptypedata.LicenceNumber == "null" ? "" : ptypedata.LicenceNumber;
                    row["file_id"] = ptypedata.file_id;
                    row["status_code"] = 1108;
                    row["batch_id"] = ptypedata.batch_id;
                    row["job_id"] = ptypedata.job_id;
                    row["status_flag"] = true;
                    row["created_by"] = string.Empty;
                    row["last_updated_by"] = string.Empty;
                    row["created_date"] = DateTime.Now;
                    row["last_updated_date"] = DateTime.Now;
                    dtPerferd.Rows.Add(row);

                }
            }

            return await _manualDataLoad.AddAdvisorDataError(dtPerferd);
        }

        /*  
    .......................................................................................................
    * This is the AddClientThiredpartyDataError service method  
    * @param ErrorData is used to get the data in a JSON format as a method param         
    * AddClientThiredpartyDataError() is used to update the client third party file error data
    .......................................................................................................
    */
        public async Task<int> AddClientThiredpartyDataError(List<StgItcClientDetailData> Pdata)
        {
            DataRow row;
            DataTable dtPerferd = new DataTable();

            dtPerferd.Columns.Add("row_id", typeof(int));
            dtPerferd.Columns.Add("TaxType", typeof(string));
            dtPerferd.Columns.Add("RecordSubmissionType", typeof(string));
            dtPerferd.Columns.Add("TaxYear", typeof(int));
            dtPerferd.Columns.Add("SourceSystemID", typeof(string));
            dtPerferd.Columns.Add("FundEntityCode", typeof(string));
            dtPerferd.Columns.Add("ClientID", typeof(string));
            dtPerferd.Columns.Add("NatureOfPerson", typeof(string));
            dtPerferd.Columns.Add("Name", typeof(string));
            dtPerferd.Columns.Add("Initials", typeof(string));
            dtPerferd.Columns.Add("Forenames", typeof(string));
            dtPerferd.Columns.Add("IDNumber", typeof(string));
            dtPerferd.Columns.Add("PassportNumber", typeof(string));
            dtPerferd.Columns.Add("PassportCountryOfIssue", typeof(string));
            dtPerferd.Columns.Add("TaxNumber", typeof(string));
            dtPerferd.Columns.Add("RegistrationNumber", typeof(string));
            dtPerferd.Columns.Add("DateOfBirth", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressUnitNumber", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressComplex", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressStreetNumber", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressStreetName", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressSuburb", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressCity", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressPostCode", typeof(string));
            dtPerferd.Columns.Add("PostalSameAsResidential", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine1", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine2", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine3", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine4", typeof(string));
            dtPerferd.Columns.Add("PostalAddressPostCode", typeof(string));
            dtPerferd.Columns.Add("FICAStatus", typeof(string));
            dtPerferd.Columns.Add("SAResidenceInd", typeof(string));
            dtPerferd.Columns.Add("TradingName", typeof(string));
            dtPerferd.Columns.Add("DateOfDeath", typeof(string));
            dtPerferd.Columns.Add("Language", typeof(string));
            dtPerferd.Columns.Add("CertificateMailingPreference", typeof(string));
            dtPerferd.Columns.Add("Email_address", typeof(string));
            dtPerferd.Columns.Add("Title", typeof(string));
            dtPerferd.Columns.Add("CellphoneNumber", typeof(string));
            dtPerferd.Columns.Add("DateLastUpdated", typeof(string));
            dtPerferd.Columns.Add("file_id", typeof(int));
            dtPerferd.Columns.Add("status_code", typeof(int));
            dtPerferd.Columns.Add("batch_id", typeof(int));
            dtPerferd.Columns.Add("job_id", typeof(int));
            dtPerferd.Columns.Add("status_flag", typeof(int));
            dtPerferd.Columns.Add("created_by", typeof(string));
            dtPerferd.Columns.Add("last_updated_by", typeof(string));
            dtPerferd.Columns.Add("created_date", typeof(DateTime));
            dtPerferd.Columns.Add("last_updated_date", typeof(DateTime));

            if (Pdata.Count > 0)
            {
                foreach (var ptypedata in Pdata)
                {
                    row = dtPerferd.NewRow();
                    row["row_id"] = ptypedata.row_id;
                    row["TaxType"] = ptypedata.TaxType == "null" ? "" : ptypedata.TaxType;
                    row["RecordSubmissionType"] = ptypedata.RecordSubmissionType == "null" ? "" : ptypedata.RecordSubmissionType;
                    row["TaxYear"] = ptypedata.TaxYear;
                    row["SourceSystemID"] = ptypedata.SourceSystemID == "null" ? "" : ptypedata.SourceSystemID;
                    row["FundEntityCode"] = ptypedata.FundEntityCode == "null" ? "" : ptypedata.FundEntityCode;
                    row["ClientID"] = ptypedata.ClientID == "null" ? "" : ptypedata.ClientID;
                    row["NatureOfPerson"] = ptypedata.NatureOfPerson == "null" ? "" : ptypedata.NatureOfPerson;
                    row["Name"] = ptypedata.Name == "null" ? "" : ptypedata.Name;
                    row["Initials"] = ptypedata.Initials == "null" ? "" : ptypedata.Initials;
                    row["Forenames"] = ptypedata.Forenames == "null" ? "" : ptypedata.Forenames;
                    row["IDNumber"] = ptypedata.IDNumber == "null" ? "" : ptypedata.IDNumber;
                    row["PassportNumber"] = ptypedata.PassportNumber == "null" ? "" : ptypedata.PassportNumber;
                    row["PassportCountryOfIssue"] = ptypedata.PassportCountryOfIssue == "null" ? "" : ptypedata.PassportCountryOfIssue;
                    row["TaxNumber"] = ptypedata.TaxNumber == "null" ? "" : ptypedata.TaxNumber;
                    row["RegistrationNumber"] = ptypedata.RegistrationNumber == "null" ? "" : ptypedata.RegistrationNumber;
                    row["DateOfBirth"] = ptypedata.DateOfBirth == "null" ? "" : ptypedata.DateOfBirth;
                    row["PhysicalAddressUnitNumber"] = ptypedata.PhysicalAddressUnitNumber == "null" ? "" : ptypedata.PhysicalAddressUnitNumber;
                    row["PhysicalAddressComplex"] = ptypedata.PhysicalAddressComplex == "null" ? "" : ptypedata.PhysicalAddressComplex;
                    row["PhysicalAddressStreetNumber"] = ptypedata.PhysicalAddressStreetNumber == "null" ? "" : ptypedata.PhysicalAddressStreetNumber;
                    row["PhysicalAddressStreetName"] = ptypedata.PhysicalAddressStreetName == "null" ? "" : ptypedata.PhysicalAddressStreetName;
                    row["PhysicalAddressSuburb"] = ptypedata.PhysicalAddressSuburb == "null" ? "" : ptypedata.PhysicalAddressSuburb;
                    row["PhysicalAddressCity"] = ptypedata.PhysicalAddressCity == "null" ? "" : ptypedata.PhysicalAddressCity;
                    row["PhysicalAddressPostCode"] = ptypedata.PhysicalAddressPostCode == "null" ? "" : ptypedata.PhysicalAddressPostCode;
                    row["PostalsameasResidential"] = ptypedata.PostalsameasResidential == "null" ? "" : ptypedata.PostalsameasResidential;
                    row["PostalAddressLine1"] = ptypedata.PostalAddressLine1 == "null" ? "" : ptypedata.PostalAddressLine1;
                    row["PostalAddressLine2"] = ptypedata.PostalAddressLine2 == "null" ? "" : ptypedata.PostalAddressLine2;
                    row["PostalAddressLine3"] = ptypedata.PostalAddressLine3 == "null" ? "" : ptypedata.PostalAddressLine3;
                    row["PostalAddressLine4"] = ptypedata.PostalAddressLine4 == "null" ? "" : ptypedata.PostalAddressLine4;
                    row["PostalAddressPostCode"] = ptypedata.PostalAddressPostCode == "null" ? "" : ptypedata.PostalAddressPostCode;
                    row["FICAStatus"] = ptypedata.FICAStatus == "null" ? "" : ptypedata.FICAStatus;
                    row["SAResidenceInd"] = ptypedata.SAResidenceInd == "null" ? "" : ptypedata.SAResidenceInd;
                    row["TradingName"] = ptypedata.TradingName == "null" ? "" : ptypedata.TradingName;
                    row["DateOfDeath"] = ptypedata.DateOfDeath == "null" ? "" : ptypedata.DateOfDeath;
                    row["Language"] = ptypedata.Language == "null" ? "" : ptypedata.Language;
                    row["CertificateMailingPreference"] = ptypedata.CertificateMailingPreference == "null" ? "" : ptypedata.CertificateMailingPreference;
                    row["Email_Address"] = ptypedata.Email_Address == "null" ? "" : ptypedata.Email_Address;
                    row["Title"] = ptypedata.Title == "null" ? "" : ptypedata.Title;
                    row["CellphoneNumber"] = ptypedata.CellphoneNumber == "null" ? "" : ptypedata.CellphoneNumber;
                    row["DateLastUpdated"] = ptypedata.DateLastUpdated == "null" ? "" : ptypedata.DateLastUpdated;
                    row["file_id"] = ptypedata.file_id;
                    row["status_code"] = 1108;
                    row["batch_id"] = ptypedata.batch_id;
                    row["job_id"] = ptypedata.job_id;
                    row["status_flag"] = true;
                    row["created_by"] = string.Empty;
                    row["last_updated_by"] = string.Empty;
                    row["created_date"] = DateTime.Now;
                    row["last_updated_date"] = DateTime.Now;
                    dtPerferd.Rows.Add(row);

                }
            }

            return await _manualDataLoad.AddClientThiredpartyDataError(dtPerferd);

        }

        /*  
   .......................................................................................................
   * This is the AddGCSDataError service method  
   * @param Pdata is used to get the data in a JSON format as a method param         
   * AddGCSDataError() is used to update the GCS file error data
   .......................................................................................................
   */
        public async Task<int> AddGCSDataError(List<StgClientGcsResponse> Pdata)
        {

            DataRow row;

            DataTable dtPerferd = new DataTable();

            dtPerferd.Columns.Add("row_id", typeof(int));
            dtPerferd.Columns.Add("ERRMSG", typeof(string));
            dtPerferd.Columns.Add("ERRFIELD", typeof(string));
            dtPerferd.Columns.Add("RETURN_CODE", typeof(string));
            dtPerferd.Columns.Add("IN_PARTY_REF", typeof(string));
            dtPerferd.Columns.Add("IN_SYSTEM_ID", typeof(string));
            dtPerferd.Columns.Add("CP_RELATIONSHIP", typeof(string));
            dtPerferd.Columns.Add("CP_PERCENTAGE", typeof(string));
            dtPerferd.Columns.Add("PARENT_PARTY_REF", typeof(string));
            dtPerferd.Columns.Add("PARENT_SYSTEM_ID", typeof(string));
            dtPerferd.Columns.Add("EXT_PARTY_REF", typeof(string));
            dtPerferd.Columns.Add("EXT_SYSTEM_ID", typeof(string));
            dtPerferd.Columns.Add("GCS_PARTY_REF", typeof(string));
            dtPerferd.Columns.Add("GCS_SYSTEM_ID", typeof(string));
            dtPerferd.Columns.Add("TITLE", typeof(string));
            dtPerferd.Columns.Add("FNAME", typeof(string));
            dtPerferd.Columns.Add("NAME", typeof(string));
            dtPerferd.Columns.Add("INITIALS", typeof(string));
            dtPerferd.Columns.Add("PARTY_TYPE", typeof(string));
            dtPerferd.Columns.Add("TYPE_OF_ORG", typeof(string));
            dtPerferd.Columns.Add("ORG_TYPE_CODE", typeof(string));
            dtPerferd.Columns.Add("GIIN_NO", typeof(string));
            dtPerferd.Columns.Add("FATCA_REPORTING_CODE", typeof(string));
            dtPerferd.Columns.Add("ROLE", typeof(string));
            dtPerferd.Columns.Add("BIRTH_DATE", typeof(string));
            dtPerferd.Columns.Add("DEATH_DATE", typeof(string));
            dtPerferd.Columns.Add("NAT_ID_NO_1", typeof(string));
            dtPerferd.Columns.Add("ID_NO_TYPE_1", typeof(string));
            dtPerferd.Columns.Add("ID_COUNTRY_1", typeof(string));
            dtPerferd.Columns.Add("NAT_ID_NO_2", typeof(string));
            dtPerferd.Columns.Add("ID_NO_TYPE_2", typeof(string));
            dtPerferd.Columns.Add("ID_COUNTRY_2", typeof(string));
            dtPerferd.Columns.Add("NAT_ID_NO_3", typeof(string));
            dtPerferd.Columns.Add("ID_NO_TYPE_3", typeof(string));
            dtPerferd.Columns.Add("ID_COUNTRY_3", typeof(string));
            dtPerferd.Columns.Add("NAT_ID_NO_4", typeof(string));
            dtPerferd.Columns.Add("ID_NO_TYPE_4", typeof(string));
            dtPerferd.Columns.Add("ID_COUNTRY_4", typeof(string));
            dtPerferd.Columns.Add("NAT_ID_NO_5", typeof(string));
            dtPerferd.Columns.Add("ID_NO_TYPE_5", typeof(string));
            dtPerferd.Columns.Add("ID_COUNTRY_5", typeof(string));
            dtPerferd.Columns.Add("SEX", typeof(string));
            dtPerferd.Columns.Add("CO_NO", typeof(string));
            dtPerferd.Columns.Add("PREF_LANG", typeof(string));
            dtPerferd.Columns.Add("MARITAL_STAT", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_1", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_COUNTRY_1", typeof(string));
            dtPerferd.Columns.Add("RESIDENT_MKR_1", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_2", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_COUNTRY_2", typeof(string));
            dtPerferd.Columns.Add("RESIDENT_MKR_2", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_3", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_COUNTRY_3", typeof(string));
            dtPerferd.Columns.Add("RESIDENT_MKR_3", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_4", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_COUNTRY_4", typeof(string));
            dtPerferd.Columns.Add("RESIDENT_MKR_4", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_5", typeof(string));
            dtPerferd.Columns.Add("TAX_REG_NO_COUNTRY_5", typeof(string));
            dtPerferd.Columns.Add("RESIDENT_MKR_5", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_OF_NATIONALITY", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_USAGE_1", typeof(string));
            dtPerferd.Columns.Add("START_DATE_1", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE1_1", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE2_1", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE3_1", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE4_1", typeof(string));
            dtPerferd.Columns.Add("POST_CDE_1", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_CODE_1", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS_1", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE_1", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_USAGE_2", typeof(string));
            dtPerferd.Columns.Add("START_DATE_2", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE1_2", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE2_2", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE3_2", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE4_2", typeof(string));
            dtPerferd.Columns.Add("POST_CDE_2", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_CODE_2", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS_2", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE_2", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_USAGE_3", typeof(string));
            dtPerferd.Columns.Add("START_DATE_3", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE1_3", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE2_3", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE3_3", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE4_3", typeof(string));
            dtPerferd.Columns.Add("POST_CDE_3", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_CODE_3", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS_3", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE_3", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_USAGE_4", typeof(string));
            dtPerferd.Columns.Add("START_DATE_4", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE1_4", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE2_4", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE3_4", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE4_4", typeof(string));
            dtPerferd.Columns.Add("POST_CDE_4", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_CODE_4", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS_4", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE_4", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_USAGE_5", typeof(string));
            dtPerferd.Columns.Add("START_DATE_5", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE1_5", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE2_5", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE3_5", typeof(string));
            dtPerferd.Columns.Add("ADDRESS_LINE4_5", typeof(string));
            dtPerferd.Columns.Add("POST_CDE_5", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_CODE_5", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS_5", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE_5", typeof(string));
            dtPerferd.Columns.Add("CP_USAGE_1", typeof(string));
            dtPerferd.Columns.Add("CP_DETAIL_1", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_DIALING_CODE_1", typeof(string));
            dtPerferd.Columns.Add("CNTRY_CODE_1", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS2_1", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE2_1", typeof(string));
            dtPerferd.Columns.Add("CP_USAGE_2", typeof(string));
            dtPerferd.Columns.Add("CP_DETAIL_2", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_DIALING_CODE_2", typeof(string));
            dtPerferd.Columns.Add("CNTRY_CODE_2", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS2_2", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE2_2", typeof(string));
            dtPerferd.Columns.Add("CP_USAGE_3", typeof(string));
            dtPerferd.Columns.Add("CP_DETAIL_3", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_DIALING_CODE_3", typeof(string));
            dtPerferd.Columns.Add("CNTRY_CODE_3", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS2_3", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE2_3", typeof(string));
            dtPerferd.Columns.Add("CP_USAGE_4", typeof(string));
            dtPerferd.Columns.Add("CP_DETAIL_4", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_DIALING_CODE_4", typeof(string));
            dtPerferd.Columns.Add("CNTRY_CODE_4", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS2_4", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE2_4", typeof(string));
            dtPerferd.Columns.Add("CP_USAGE_5", typeof(string));
            dtPerferd.Columns.Add("CP_DETAIL_5", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_DIALING_CODE_5", typeof(string));
            dtPerferd.Columns.Add("CNTRY_CODE_5", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS2_5", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE2_5", typeof(string));
            dtPerferd.Columns.Add("CP_USAGE_6", typeof(string));
            dtPerferd.Columns.Add("CP_DETAIL_6", typeof(string));
            dtPerferd.Columns.Add("COUNTRY_DIALING_CODE_6", typeof(string));
            dtPerferd.Columns.Add("CNTRY_CODE_6", typeof(string));
            dtPerferd.Columns.Add("CP_STATUS2_6", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE2_6", typeof(string));
            dtPerferd.Columns.Add("EM_USAGE_1", typeof(string));
            dtPerferd.Columns.Add("EM_DETAIL_1", typeof(string));
            dtPerferd.Columns.Add("EM_STATUS_1", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE3_1", typeof(string));
            dtPerferd.Columns.Add("EM_USAGE_2", typeof(string));
            dtPerferd.Columns.Add("EM_DETAIL_2", typeof(string));
            dtPerferd.Columns.Add("EM_STATUS_2", typeof(string));
            dtPerferd.Columns.Add("UPDATED_DATE3_2", typeof(string));
            dtPerferd.Columns.Add("PARTY_TYPE_SYS", typeof(string));
            dtPerferd.Columns.Add("TYPE_OF_ORG_SYS", typeof(string));
            dtPerferd.Columns.Add("EXT_SYSTEM_ID_SYS", typeof(string));
            dtPerferd.Columns.Add("ORG_INCEPTION_DATE", typeof(string));
            dtPerferd.Columns.Add("TRADING_NAME", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_RESID_1", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_START_DATE_1", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_END_DATE_1", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_RESID_2", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_START_DATE_2", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_END_DATE_2", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_RESID_3", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_START_DATE_3", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_END_DATE_3", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_RESID_4", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_START_DATE_4", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_END_DATE_4", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_RESID_5", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_START_DATE_5", typeof(string));
            dtPerferd.Columns.Add("CNTRY_TAX_END_DATE_5", typeof(string));
            dtPerferd.Columns.Add("DWT_COUNTRY", typeof(string));
            dtPerferd.Columns.Add("DWT_DTA_RATE", typeof(string));
            dtPerferd.Columns.Add("DWT_START_DATE", typeof(string));
            dtPerferd.Columns.Add("DWT_END_DATE", typeof(string));
            dtPerferd.Columns.Add("IWT_COUNTRY", typeof(string));
            dtPerferd.Columns.Add("IWT_DTA_RATE", typeof(string));
            dtPerferd.Columns.Add("IWT_START_DATE", typeof(string));
            dtPerferd.Columns.Add("IWT_END_DATE", typeof(string));
            dtPerferd.Columns.Add("LDT_EXEMPT_MKR", typeof(string));
            dtPerferd.Columns.Add("LDT_EXEMPT_CODE", typeof(string));
            dtPerferd.Columns.Add("LDT_EXEMPT_DATE", typeof(string));
            dtPerferd.Columns.Add("IWT_EXEMPT_MKR", typeof(string));
            dtPerferd.Columns.Add("IWT_EXEMPT_CODE", typeof(string));
            dtPerferd.Columns.Add("IWT_EXEMPT_DATE", typeof(string));
            dtPerferd.Columns.Add("MONEY_LAUND_RISK", typeof(string));
            dtPerferd.Columns.Add("CORRESPOND_PREF", typeof(string));
            dtPerferd.Columns.Add("NICKNAME", typeof(string));
            dtPerferd.Columns.Add("RACE", typeof(string));
            dtPerferd.Columns.Add("import_status", typeof(int));
            dtPerferd.Columns.Add("import_error", typeof(string));
            dtPerferd.Columns.Add("file_id", typeof(int));
            dtPerferd.Columns.Add("status_code", typeof(int));
            dtPerferd.Columns.Add("batch_id", typeof(int));
            dtPerferd.Columns.Add("job_id", typeof(int));
            dtPerferd.Columns.Add("status_flag", typeof(int));
            dtPerferd.Columns.Add("created_by", typeof(string));
            dtPerferd.Columns.Add("last_updated_by", typeof(string));
            dtPerferd.Columns.Add("created_date", typeof(DateTime));
            dtPerferd.Columns.Add("last_updated_date", typeof(DateTime));


            if (Pdata.Count > 0)
            {


                foreach (var ptypedata in Pdata)
                {
                    row = dtPerferd.NewRow();
                    row["row_id"] = ptypedata.row_id;
                    row["ERRMSG"] = ptypedata.ERRMSG == "null" ? "" : ptypedata.ERRMSG;
                    row["ERRFIELD"] = ptypedata.ERRFIELD == "null" ? "" : ptypedata.ERRFIELD;
                    row["RETURN_CODE"] = ptypedata.RETURN_CODE == "null" ? "" : ptypedata.RETURN_CODE;
                    row["IN_PARTY_REF"] = ptypedata.IN_PARTY_REF == "null" ? "" : ptypedata.IN_PARTY_REF;
                    row["IN_SYSTEM_ID"] = ptypedata.IN_SYSTEM_ID == "null" ? "" : ptypedata.IN_SYSTEM_ID;
                    row["CP_RELATIONSHIP"] = ptypedata.CP_RELATIONSHIP == "null" ? "" : ptypedata.CP_RELATIONSHIP;
                    row["CP_PERCENTAGE"] = ptypedata.CP_PERCENTAGE == "null" ? "" : ptypedata.CP_PERCENTAGE;
                    row["PARENT_PARTY_REF"] = ptypedata.PARENT_PARTY_REF == "null" ? "" : ptypedata.PARENT_PARTY_REF;
                    row["PARENT_SYSTEM_ID"] = ptypedata.PARENT_SYSTEM_ID == "null" ? "" : ptypedata.PARENT_SYSTEM_ID;
                    row["EXT_PARTY_REF"] = ptypedata.EXT_PARTY_REF == "null" ? "" : ptypedata.EXT_PARTY_REF;
                    row["EXT_SYSTEM_ID"] = ptypedata.EXT_SYSTEM_ID == "null" ? "" : ptypedata.EXT_SYSTEM_ID;
                    row["GCS_PARTY_REF"] = ptypedata.GCS_PARTY_REF == "null" ? "" : ptypedata.GCS_PARTY_REF;
                    row["GCS_SYSTEM_ID"] = ptypedata.GCS_SYSTEM_ID == "null" ? "" : ptypedata.GCS_SYSTEM_ID;
                    row["TITLE"] = ptypedata.TITLE == "null" ? "" : ptypedata.TITLE;
                    row["FNAME"] = ptypedata.FNAME == "null" ? "" : ptypedata.FNAME;
                    row["NAME"] = ptypedata.NAME == "null" ? "" : ptypedata.NAME;
                    row["INITIALS"] = ptypedata.INITIALS == "null" ? "" : ptypedata.INITIALS;
                    row["PARTY_TYPE"] = ptypedata.PARTY_TYPE == "null" ? "" : ptypedata.PARTY_TYPE;
                    row["TYPE_OF_ORG"] = ptypedata.TYPE_OF_ORG == "null" ? "" : ptypedata.TYPE_OF_ORG;
                    row["ORG_TYPE_CODE"] = ptypedata.ORG_TYPE_CODE == "null" ? "" : ptypedata.ORG_TYPE_CODE;
                    row["GIIN_NO"] = ptypedata.GIIN_NO == "null" ? "" : ptypedata.GIIN_NO;
                    row["FATCA_REPORTING_CODE"] = ptypedata.FATCA_REPORTING_CODE == "nulll" ? "" : ptypedata.FATCA_REPORTING_CODE;
                    row["ROLE"] = ptypedata.ROLE == "null" ? "" : ptypedata.ROLE;
                    row["BIRTH_DATE"] = ptypedata.BIRTH_DATE == "null" ? "" : ptypedata.BIRTH_DATE;
                    row["DEATH_DATE"] = ptypedata.DEATH_DATE == "null" ? "" : ptypedata.DEATH_DATE;
                    row["NAT_ID_NO_1"] = ptypedata.NAT_ID_NO_1 == "null" ? "" : ptypedata.NAT_ID_NO_1;
                    row["ID_NO_TYPE_1"] = ptypedata.ID_NO_TYPE_1 == "null" ? "" : ptypedata.ID_NO_TYPE_1;
                    row["ID_COUNTRY_1"] = ptypedata.ID_COUNTRY_1 == "null" ? "" : ptypedata.ID_COUNTRY_1;
                    row["NAT_ID_NO_2"] = ptypedata.NAT_ID_NO_2 == "null" ? "" : ptypedata.NAT_ID_NO_2;
                    row["ID_NO_TYPE_2"] = ptypedata.ID_NO_TYPE_2 == "null" ? "" : ptypedata.ID_NO_TYPE_2;
                    row["ID_COUNTRY_2"] = ptypedata.ID_COUNTRY_2 == "null" ? "" : ptypedata.ID_COUNTRY_2;
                    row["NAT_ID_NO_3"] = ptypedata.NAT_ID_NO_3 == "null" ? "" : ptypedata.NAT_ID_NO_3;
                    row["ID_NO_TYPE_3"] = ptypedata.ID_NO_TYPE_3 == "null" ? "" : ptypedata.ID_NO_TYPE_3;
                    row["ID_COUNTRY_3"] = ptypedata.ID_COUNTRY_3 == "null" ? "" : ptypedata.ID_COUNTRY_3;
                    row["NAT_ID_NO_4"] = ptypedata.NAT_ID_NO_4 == "null" ? "" : ptypedata.NAT_ID_NO_4;
                    row["ID_NO_TYPE_4"] = ptypedata.ID_NO_TYPE_4 == "null" ? "" : ptypedata.ID_NO_TYPE_4;
                    row["ID_COUNTRY_4"] = ptypedata.ID_COUNTRY_4 == "null" ? "" : ptypedata.ID_COUNTRY_4;
                    row["NAT_ID_NO_5"] = ptypedata.NAT_ID_NO_5 == "null" ? "" : ptypedata.NAT_ID_NO_5;
                    row["ID_NO_TYPE_5"] = ptypedata.ID_NO_TYPE_5 == "null" ? "" : ptypedata.ID_NO_TYPE_5;
                    row["ID_COUNTRY_5"] = ptypedata.ID_COUNTRY_5 == "null" ? "" : ptypedata.ID_COUNTRY_5;
                    row["SEX"] = ptypedata.SEX == "null" ? "" : ptypedata.SEX;
                    row["CO_NO"] = ptypedata.CO_NO == "null" ? "" : ptypedata.CO_NO;
                    row["PREF_LANG"] = ptypedata.PREF_LANG == "null" ? "" : ptypedata.PREF_LANG;
                    row["MARITAL_STAT"] = ptypedata.MARITAL_STAT == "null" ? "" : ptypedata.MARITAL_STAT;
                    row["TAX_REG_NO_1"] = ptypedata.TAX_REG_NO_1 == "null" ? "" : ptypedata.TAX_REG_NO_1;
                    row["TAX_REG_NO_COUNTRY_1"] = ptypedata.TAX_REG_NO_COUNTRY_1 == "null" ? "" : ptypedata.TAX_REG_NO_COUNTRY_1;
                    row["RESIDENT_MKR_1"] = ptypedata.RESIDENT_MKR_1 == "null" ? "" : ptypedata.RESIDENT_MKR_1;
                    row["TAX_REG_NO_2"] = ptypedata.TAX_REG_NO_2 == "null" ? "" : ptypedata.TAX_REG_NO_2;
                    row["TAX_REG_NO_COUNTRY_2"] = ptypedata.TAX_REG_NO_COUNTRY_2 == "null" ? "" : ptypedata.TAX_REG_NO_COUNTRY_2;
                    row["RESIDENT_MKR_2"] = ptypedata.RESIDENT_MKR_2 == "null" ? "" : ptypedata.RESIDENT_MKR_2;
                    row["TAX_REG_NO_3"] = ptypedata.TAX_REG_NO_3 == "null" ? "" : ptypedata.TAX_REG_NO_3;
                    row["TAX_REG_NO_COUNTRY_3"] = ptypedata.TAX_REG_NO_COUNTRY_3 == "null" ? "" : ptypedata.TAX_REG_NO_COUNTRY_3;
                    row["RESIDENT_MKR_3"] = ptypedata.RESIDENT_MKR_3 == "null" ? "" : ptypedata.RESIDENT_MKR_3;
                    row["TAX_REG_NO_4"] = ptypedata.TAX_REG_NO_4 == "null" ? "" : ptypedata.TAX_REG_NO_4;
                    row["TAX_REG_NO_COUNTRY_4"] = ptypedata.TAX_REG_NO_COUNTRY_4 == "null" ? "" : ptypedata.TAX_REG_NO_COUNTRY_4;
                    row["RESIDENT_MKR_4"] = ptypedata.RESIDENT_MKR_4 == "null" ? "" : ptypedata.RESIDENT_MKR_4;
                    row["TAX_REG_NO_5"] = ptypedata.TAX_REG_NO_5 == "null" ? "" : ptypedata.TAX_REG_NO_5;
                    row["TAX_REG_NO_COUNTRY_5"] = ptypedata.TAX_REG_NO_COUNTRY_5 == "null" ? "" : ptypedata.TAX_REG_NO_COUNTRY_5;
                    row["RESIDENT_MKR_5"] = ptypedata.RESIDENT_MKR_5 == "null" ? "" : ptypedata.RESIDENT_MKR_5;
                    row["COUNTRY_OF_NATIONALITY"] = ptypedata.COUNTRY_OF_NATIONALITY == "null" ? "" : ptypedata.COUNTRY_OF_NATIONALITY;
                    row["ADDRESS_USAGE_1"] = ptypedata.ADDRESS_USAGE_1 == "null" ? "" : ptypedata.ADDRESS_USAGE_1;
                    row["START_DATE_1"] = ptypedata.START_DATE_1 == "null" ? "" : ptypedata.START_DATE_1;
                    row["ADDRESS_LINE1_1"] = ptypedata.ADDRESS_LINE1_1 == "null" ? "" : ptypedata.ADDRESS_LINE1_1;
                    row["ADDRESS_LINE2_1"] = ptypedata.ADDRESS_LINE2_1 == "null" ? "" : ptypedata.ADDRESS_LINE2_1;
                    row["ADDRESS_LINE3_1"] = ptypedata.ADDRESS_LINE3_1 == "null" ? "" : ptypedata.ADDRESS_LINE3_1;
                    row["ADDRESS_LINE4_1"] = ptypedata.ADDRESS_LINE4_1 == "null" ? "" : ptypedata.ADDRESS_LINE4_1;
                    row["POST_CDE_1"] = ptypedata.POST_CDE_1 == "null" ? "" : ptypedata.POST_CDE_1;
                    row["COUNTRY_CODE_1"] = ptypedata.COUNTRY_CODE_1 == "null" ? "" : ptypedata.COUNTRY_CODE_1;
                    row["CP_STATUS_1"] = ptypedata.CP_STATUS_1 == "null" ? "" : ptypedata.CP_STATUS_1;
                    row["UPDATED_DATE_1"] = ptypedata.UPDATED_DATE_1 == "null" ? "" : ptypedata.UPDATED_DATE_1;
                    row["ADDRESS_USAGE_2"] = ptypedata.ADDRESS_USAGE_2 == "null" ? "" : ptypedata.ADDRESS_USAGE_2;
                    row["START_DATE_2"] = ptypedata.START_DATE_2 == "null" ? "" : ptypedata.START_DATE_2;
                    row["ADDRESS_LINE1_2"] = ptypedata.ADDRESS_LINE1_2 == "null" ? "" : ptypedata.ADDRESS_LINE1_2;
                    row["ADDRESS_LINE2_2"] = ptypedata.ADDRESS_LINE2_2 == "null" ? "" : ptypedata.ADDRESS_LINE2_2;
                    row["ADDRESS_LINE3_2"] = ptypedata.ADDRESS_LINE3_2 == "null" ? "" : ptypedata.ADDRESS_LINE3_2;
                    row["ADDRESS_LINE4_2"] = ptypedata.ADDRESS_LINE4_2 == "null" ? "" : ptypedata.ADDRESS_LINE4_2;
                    row["POST_CDE_2"] = ptypedata.POST_CDE_2 == "null" ? "" : ptypedata.POST_CDE_2;
                    row["COUNTRY_CODE_2"] = ptypedata.COUNTRY_CODE_2 == "null" ? "" : ptypedata.COUNTRY_CODE_2;
                    row["CP_STATUS_2"] = ptypedata.CP_STATUS_2 == "null" ? "" : ptypedata.CP_STATUS_2;
                    row["UPDATED_DATE_2"] = ptypedata.UPDATED_DATE_2 == "null" ? "" : ptypedata.UPDATED_DATE_2;
                    row["ADDRESS_USAGE_3"] = ptypedata.ADDRESS_USAGE_3 == "null" ? "" : ptypedata.ADDRESS_USAGE_3;
                    row["START_DATE_3"] = ptypedata.START_DATE_3 == "null" ? "" : ptypedata.START_DATE_3;
                    row["ADDRESS_LINE1_3"] = ptypedata.ADDRESS_LINE1_3 == "null" ? "" : ptypedata.ADDRESS_LINE1_3;
                    row["ADDRESS_LINE2_3"] = ptypedata.ADDRESS_LINE2_3 == "null" ? "" : ptypedata.ADDRESS_LINE2_3;
                    row["ADDRESS_LINE3_3"] = ptypedata.ADDRESS_LINE3_3 == "null" ? "" : ptypedata.ADDRESS_LINE3_3;
                    row["ADDRESS_LINE4_3"] = ptypedata.ADDRESS_LINE4_3 == "null" ? "" : ptypedata.ADDRESS_LINE4_3;
                    row["POST_CDE_3"] = ptypedata.POST_CDE_3 == "null" ? "" : ptypedata.POST_CDE_3;
                    row["COUNTRY_CODE_3"] = ptypedata.COUNTRY_CODE_3 == "null" ? "" : ptypedata.COUNTRY_CODE_3;
                    row["CP_STATUS_3"] = ptypedata.CP_STATUS_3 == "null" ? "" : ptypedata.CP_STATUS_3;
                    row["UPDATED_DATE_3"] = ptypedata.UPDATED_DATE_3 == "null" ? "" : ptypedata.UPDATED_DATE_3;
                    row["ADDRESS_USAGE_4"] = ptypedata.ADDRESS_USAGE_4 == "null" ? "" : ptypedata.ADDRESS_USAGE_4;
                    row["START_DATE_4"] = ptypedata.START_DATE_4 == "null" ? "" : ptypedata.START_DATE_4;
                    row["ADDRESS_LINE1_4"] = ptypedata.ADDRESS_LINE1_4 == "null" ? "" : ptypedata.ADDRESS_LINE1_4;
                    row["ADDRESS_LINE2_4"] = ptypedata.ADDRESS_LINE2_4 == "null" ? "" : ptypedata.ADDRESS_LINE2_4;
                    row["ADDRESS_LINE3_4"] = ptypedata.ADDRESS_LINE3_4 == "null" ? "" : ptypedata.ADDRESS_LINE3_4;
                    row["ADDRESS_LINE4_4"] = ptypedata.ADDRESS_LINE4_4 == "null" ? "" : ptypedata.ADDRESS_LINE4_4;
                    row["POST_CDE_4"] = ptypedata.POST_CDE_4 == "null" ? "" : ptypedata.POST_CDE_4;
                    row["COUNTRY_CODE_4"] = ptypedata.COUNTRY_CODE_4 == "null" ? "" : ptypedata.COUNTRY_CODE_4;
                    row["CP_STATUS_4"] = ptypedata.CP_STATUS_4 == "null" ? "" : ptypedata.CP_STATUS_4;
                    row["UPDATED_DATE_4"] = ptypedata.UPDATED_DATE_4 == "null" ? "" : ptypedata.UPDATED_DATE_4;
                    row["ADDRESS_USAGE_5"] = ptypedata.ADDRESS_USAGE_5 == "null" ? "" : ptypedata.ADDRESS_USAGE_5;
                    row["START_DATE_5"] = ptypedata.START_DATE_5 == "null" ? "" : ptypedata.START_DATE_5;
                    row["ADDRESS_LINE1_5"] = ptypedata.ADDRESS_LINE1_5 == "null" ? "" : ptypedata.ADDRESS_LINE1_5;
                    row["ADDRESS_LINE2_5"] = ptypedata.ADDRESS_LINE2_5 == "null" ? "" : ptypedata.ADDRESS_LINE2_5;
                    row["ADDRESS_LINE3_5"] = ptypedata.ADDRESS_LINE3_5 == "null" ? "" : ptypedata.ADDRESS_LINE3_5;
                    row["ADDRESS_LINE4_5"] = ptypedata.ADDRESS_LINE4_5 == "null" ? "" : ptypedata.ADDRESS_LINE4_5;
                    row["POST_CDE_5"] = ptypedata.POST_CDE_5 == "null" ? "" : ptypedata.POST_CDE_5;
                    row["COUNTRY_CODE_5"] = ptypedata.COUNTRY_CODE_5 == "null" ? "" : ptypedata.COUNTRY_CODE_5;
                    row["CP_STATUS_5"] = ptypedata.CP_STATUS_5 == "null" ? "" : ptypedata.CP_STATUS_5;
                    row["UPDATED_DATE_5"] = ptypedata.UPDATED_DATE_5 == "null" ? "" : ptypedata.UPDATED_DATE_5;
                    row["CP_USAGE_1"] = ptypedata.CP_USAGE_1 == "null" ? "" : ptypedata.CP_USAGE_1;
                    row["CP_DETAIL_1"] = ptypedata.CP_DETAIL_1 == "null" ? "" : ptypedata.CP_DETAIL_1;
                    row["COUNTRY_DIALING_CODE_1"] = ptypedata.COUNTRY_DIALING_CODE_1 == "null" ? "" : ptypedata.COUNTRY_DIALING_CODE_1;
                    row["CNTRY_CODE_1"] = ptypedata.CNTRY_CODE_1 == "null" ? "" : ptypedata.CNTRY_CODE_1;
                    row["CP_STATUS2_1"] = ptypedata.CP_STATUS2_1 == "null" ? "" : ptypedata.CP_STATUS2_1;
                    row["UPDATED_DATE2_1"] = ptypedata.UPDATED_DATE2_1 == "null" ? "" : ptypedata.UPDATED_DATE2_1;
                    row["CP_USAGE_2"] = ptypedata.CP_USAGE_2 == "null" ? "" : ptypedata.CP_USAGE_2;
                    row["CP_DETAIL_2"] = ptypedata.CP_DETAIL_2 == "null" ? "" : ptypedata.CP_DETAIL_2;
                    row["COUNTRY_DIALING_CODE_2"] = ptypedata.COUNTRY_DIALING_CODE_2 == "null" ? "" : ptypedata.COUNTRY_DIALING_CODE_2;
                    row["CNTRY_CODE_2"] = ptypedata.CNTRY_CODE_2 == "null" ? "" : ptypedata.CNTRY_CODE_2;
                    row["CP_STATUS2_2"] = ptypedata.CP_STATUS2_2 == "null" ? "" : ptypedata.CP_STATUS2_2;
                    row["UPDATED_DATE2_2"] = ptypedata.UPDATED_DATE2_2 == "null" ? "" : ptypedata.UPDATED_DATE2_2;
                    row["CP_USAGE_3"] = ptypedata.CP_USAGE_3 == "null" ? "" : ptypedata.CP_USAGE_3;
                    row["CP_DETAIL_3"] = ptypedata.CP_DETAIL_3 == "null" ? "" : ptypedata.CP_DETAIL_3;
                    row["COUNTRY_DIALING_CODE_3"] = ptypedata.COUNTRY_DIALING_CODE_3 == "null" ? "" : ptypedata.COUNTRY_DIALING_CODE_3;
                    row["CNTRY_CODE_3"] = ptypedata.CNTRY_CODE_3 == "null" ? "" : ptypedata.CNTRY_CODE_3;
                    row["CP_STATUS2_3"] = ptypedata.CP_STATUS2_3 == "null" ? "" : ptypedata.CP_STATUS2_3;
                    row["UPDATED_DATE2_3"] = ptypedata.UPDATED_DATE2_3 == "null" ? "" : ptypedata.UPDATED_DATE2_3;
                    row["CP_USAGE_4"] = ptypedata.CP_USAGE_4 == "null" ? "" : ptypedata.CP_USAGE_4;
                    row["CP_DETAIL_4"] = ptypedata.CP_DETAIL_4 == "null" ? "" : ptypedata.CP_DETAIL_4;
                    row["COUNTRY_DIALING_CODE_4"] = ptypedata.COUNTRY_DIALING_CODE_4 == "null" ? "" : ptypedata.COUNTRY_DIALING_CODE_4;
                    row["CNTRY_CODE_4"] = ptypedata.CNTRY_CODE_4 == "null" ? "" : ptypedata.CNTRY_CODE_4;
                    row["CP_STATUS2_4"] = ptypedata.CP_STATUS2_4 == "null" ? "" : ptypedata.CP_STATUS2_4;
                    row["UPDATED_DATE2_4"] = ptypedata.UPDATED_DATE2_4 == "null" ? "" : ptypedata.UPDATED_DATE2_4;
                    row["CP_USAGE_5"] = ptypedata.CP_USAGE_5 == "null" ? "" : ptypedata.CP_USAGE_5;
                    row["CP_DETAIL_5"] = ptypedata.CP_DETAIL_5 == "null" ? "" : ptypedata.CP_DETAIL_5;
                    row["COUNTRY_DIALING_CODE_5"] = ptypedata.COUNTRY_DIALING_CODE_5 == "null" ? "" : ptypedata.COUNTRY_DIALING_CODE_5;
                    row["CNTRY_CODE_5"] = ptypedata.CNTRY_CODE_5 == "null" ? "" : ptypedata.CNTRY_CODE_5;
                    row["CP_STATUS2_5"] = ptypedata.CP_STATUS2_5 == "null" ? "" : ptypedata.CP_STATUS2_5;
                    row["UPDATED_DATE2_5"] = ptypedata.UPDATED_DATE2_5 == "null" ? "" : ptypedata.UPDATED_DATE2_5;
                    row["CP_USAGE_6"] = ptypedata.CP_USAGE_6 == "null" ? "" : ptypedata.CP_USAGE_6;
                    row["CP_DETAIL_6"] = ptypedata.CP_DETAIL_6 == "null" ? "" : ptypedata.CP_DETAIL_6;
                    row["COUNTRY_DIALING_CODE_6"] = ptypedata.COUNTRY_DIALING_CODE_6 == "null" ? "" : ptypedata.COUNTRY_DIALING_CODE_6;
                    row["CNTRY_CODE_6"] = ptypedata.CNTRY_CODE_6 == "null" ? "" : ptypedata.CNTRY_CODE_6;
                    row["CP_STATUS2_6"] = ptypedata.CP_STATUS2_6 == "null" ? "" : ptypedata.CP_STATUS2_6;
                    row["EM_USAGE_1"] = ptypedata.EM_USAGE_1 == "null" ? "" : ptypedata.EM_USAGE_1;
                    row["EM_DETAIL_1"] = ptypedata.EM_DETAIL_1 == "null" ? "" : ptypedata.EM_DETAIL_1;
                    row["EM_STATUS_1"] = ptypedata.EM_STATUS_1 == "null" ? "" : ptypedata.EM_STATUS_1;
                    row["UPDATED_DATE3_1"] = ptypedata.UPDATED_DATE3_1 == "null" ? "" : ptypedata.UPDATED_DATE3_1;
                    row["EM_USAGE_2"] = ptypedata.EM_USAGE_2 == "null" ? "" : ptypedata.EM_USAGE_2;
                    row["EM_DETAIL_2"] = ptypedata.EM_DETAIL_2 == "null" ? "" : ptypedata.EM_DETAIL_2;
                    row["EM_STATUS_2"] = ptypedata.EM_STATUS_2 == "null" ? "" : ptypedata.EM_STATUS_2;
                    row["UPDATED_DATE3_2"] = ptypedata.UPDATED_DATE3_2 == "null" ? "" : ptypedata.UPDATED_DATE3_2;
                    row["PARTY_TYPE_SYS"] = ptypedata.PARTY_TYPE_SYS == "null" ? "" : ptypedata.PARTY_TYPE_SYS;
                    row["TYPE_OF_ORG_SYS"] = ptypedata.TYPE_OF_ORG_SYS == "null" ? "" : ptypedata.TYPE_OF_ORG_SYS;
                    row["EXT_SYSTEM_ID_SYS"] = ptypedata.EXT_SYSTEM_ID_SYS == "null" ? "" : ptypedata.EXT_SYSTEM_ID_SYS;
                    row["ORG_INCEPTION_DATE"] = ptypedata.ORG_INCEPTION_DATE == "null" ? "" : ptypedata.ORG_INCEPTION_DATE;
                    row["TRADING_NAME"] = ptypedata.TRADING_NAME == "null" ? "" : ptypedata.TRADING_NAME;
                    row["CNTRY_TAX_RESID_1"] = ptypedata.CNTRY_TAX_RESID_1 == "null" ? "" : ptypedata.CNTRY_TAX_RESID_1;
                    row["CNTRY_TAX_START_DATE_1"] = ptypedata.CNTRY_TAX_START_DATE_1 == "null" ? "" : ptypedata.CNTRY_TAX_START_DATE_1;
                    row["CNTRY_TAX_END_DATE_1"] = ptypedata.CNTRY_TAX_END_DATE_1 == "null" ? "" : ptypedata.CNTRY_TAX_END_DATE_1;
                    row["CNTRY_TAX_RESID_2"] = ptypedata.CNTRY_TAX_RESID_2 == "null" ? "" : ptypedata.CNTRY_TAX_RESID_2;
                    row["CNTRY_TAX_START_DATE_2"] = ptypedata.CNTRY_TAX_START_DATE_2 == "null" ? "" : ptypedata.CNTRY_TAX_START_DATE_2;
                    row["CNTRY_TAX_END_DATE_2"] = ptypedata.CNTRY_TAX_END_DATE_2 == "null" ? "" : ptypedata.CNTRY_TAX_END_DATE_2;
                    row["CNTRY_TAX_RESID_3"] = ptypedata.CNTRY_TAX_RESID_3 == "null" ? "" : ptypedata.CNTRY_TAX_RESID_3;
                    row["CNTRY_TAX_START_DATE_3"] = ptypedata.CNTRY_TAX_START_DATE_3 == "null" ? "" : ptypedata.CNTRY_TAX_START_DATE_3;
                    row["CNTRY_TAX_END_DATE_3"] = ptypedata.CNTRY_TAX_END_DATE_3 == "null" ? "" : ptypedata.CNTRY_TAX_END_DATE_3;
                    row["CNTRY_TAX_RESID_4"] = ptypedata.CNTRY_TAX_RESID_4 == "null" ? "" : ptypedata.CNTRY_TAX_RESID_4;
                    row["CNTRY_TAX_START_DATE_4"] = ptypedata.CNTRY_TAX_START_DATE_4 == "null" ? "" : ptypedata.CNTRY_TAX_START_DATE_4;
                    row["CNTRY_TAX_END_DATE_4"] = ptypedata.CNTRY_TAX_END_DATE_4 == "null" ? "" : ptypedata.CNTRY_TAX_END_DATE_4;
                    row["CNTRY_TAX_RESID_5"] = ptypedata.CNTRY_TAX_RESID_5 == "null" ? "" : ptypedata.CNTRY_TAX_RESID_5;
                    row["CNTRY_TAX_START_DATE_5"] = ptypedata.CNTRY_TAX_START_DATE_5 == "null" ? "" : ptypedata.CNTRY_TAX_START_DATE_5;
                    row["CNTRY_TAX_END_DATE_5"] = ptypedata.CNTRY_TAX_END_DATE_5 == "null" ? "" : ptypedata.CNTRY_TAX_END_DATE_5;
                    row["DWT_COUNTRY"] = ptypedata.DWT_COUNTRY == "null" ? "" : ptypedata.DWT_COUNTRY;
                    row["DWT_DTA_RATE"] = ptypedata.DWT_DTA_RATE == "null" ? "" : ptypedata.DWT_DTA_RATE;
                    row["DWT_START_DATE"] = ptypedata.DWT_START_DATE == "null" ? "" : ptypedata.DWT_START_DATE;
                    row["DWT_END_DATE"] = ptypedata.DWT_END_DATE == "null" ? "" : ptypedata.DWT_END_DATE;
                    row["IWT_COUNTRY"] = ptypedata.IWT_COUNTRY == "null" ? "" : ptypedata.IWT_COUNTRY;
                    row["IWT_DTA_RATE"] = ptypedata.IWT_DTA_RATE == "null" ? "" : ptypedata.IWT_DTA_RATE;
                    row["IWT_START_DATE"] = ptypedata.IWT_START_DATE == "null" ? "" : ptypedata.IWT_START_DATE;
                    row["IWT_END_DATE"] = ptypedata.IWT_END_DATE == "null" ? "" : ptypedata.IWT_END_DATE;
                    row["LDT_EXEMPT_MKR"] = ptypedata.LDT_EXEMPT_MKR == "null" ? "" : ptypedata.LDT_EXEMPT_MKR;
                    row["LDT_EXEMPT_CODE"] = ptypedata.LDT_EXEMPT_CODE == "null" ? "" : ptypedata.LDT_EXEMPT_CODE;
                    row["LDT_EXEMPT_DATE"] = ptypedata.LDT_EXEMPT_DATE == "null" ? "" : ptypedata.LDT_EXEMPT_DATE;
                    row["IWT_EXEMPT_MKR"] = ptypedata.IWT_EXEMPT_MKR == "null" ? "" : ptypedata.IWT_EXEMPT_MKR;
                    row["IWT_EXEMPT_CODE"] = ptypedata.IWT_EXEMPT_CODE == "null" ? "" : ptypedata.IWT_EXEMPT_CODE;
                    row["IWT_EXEMPT_DATE"] = ptypedata.IWT_EXEMPT_DATE == "null" ? "" : ptypedata.IWT_EXEMPT_DATE;
                    row["MONEY_LAUND_RISK"] = ptypedata.MONEY_LAUND_RISK == "null" ? "" : ptypedata.MONEY_LAUND_RISK;
                    row["CORRESPOND_PREF"] = ptypedata.CORRESPOND_PREF == "null" ? "" : ptypedata.CORRESPOND_PREF;
                    row["NICKNAME"] = ptypedata.NICKNAME == "null" ? "" : ptypedata.NICKNAME;
                    row["RACE"] = ptypedata.RACE == "null" ? "" : ptypedata.RACE;
                    row["import_status"] = ptypedata.import_status;
                    row["import_error"] = ptypedata.import_error == "null" ? "" : ptypedata.import_error;
                    row["file_id"] = ptypedata.file_id;
                    row["status_code"] = ptypedata.status_code;
                    row["batch_id"] = ptypedata.batch_id;
                    row["job_id"] = ptypedata.job_id;
                    row["status_flag"] = true;
                    row["created_by"] = string.Empty;
                    row["last_updated_by"] = string.Empty;
                    row["created_date"] = DateTime.Now;
                    row["last_updated_date"] = DateTime.Now;
                    dtPerferd.Rows.Add(row);

                }
            }

            return await _manualDataLoad.AddGCSDataError(dtPerferd);
        }

        public async Task<IEnumerable<DataLoad>> GetPasDataLoad(DataLoad data)
        {
            DataTable dtSourceSystem = new DataTable();
            dtSourceSystem.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < data.SourceSystemIds.Length; i++)
            {
                if (data.SourceSystemIds[i] != 0)
                {
                    row = dtSourceSystem.NewRow();
                    row["ID"] = data.SourceSystemIds[i];
                    dtSourceSystem.Rows.Add(row);
                }
            }

            DataTable dtFileType = new DataTable();
            dtFileType.Columns.Add("ID", typeof(int));
            for (int i = 0; i < data.file_type.Length; i++)
            {
                row = dtFileType.NewRow();
                row["ID"] = data.file_type[i];
                dtFileType.Rows.Add(row);
            }

            DataTable dtStatus = new DataTable();
            dtStatus.Columns.Add("ID", typeof(int));
            for (int i = 0; i < data.status_type.Length; i++)
            {
                row = dtStatus.NewRow();
                row["ID"] = data.status_type[i];
                dtStatus.Rows.Add(row);
            }
            DataTable dtTaxPeriodType = new DataTable();
            dtTaxPeriodType.Columns.Add("ID", typeof(int));
            for (int i = 0; i < data.tax_period.Length; i++)
            {
                if (data.tax_period[i] != 0)
                {
                    row = dtTaxPeriodType.NewRow();
                    row["ID"] = data.tax_period[i];
                    dtTaxPeriodType.Rows.Add(row);
                }
            }
            var result = await _manualDataLoad.GetPasDataLoad(data, dtSourceSystem, dtStatus, dtFileType, dtTaxPeriodType);
            foreach (DataLoad item in result)
            {
                if (!string.IsNullOrEmpty(item.TaxYears) && item.TaxYears.Contains(","))
                    item.strTaxYears = item.TaxYears.Split(',');
            }
            return result;
        }

        public async Task<Tuple<GetObjectRequest, bool>> DownloadFile(int file_id, string file_name, string archivedfoldername, string pickupfoldername, string manualpickupfoldername, string errorsfoldername)
        {
            GetObjectRequest request = new GetObjectRequest();
            bool fileExist = false;

            if (await _buckethelper.Exists(archivedfoldername, file_name))
            {
                fileExist = true;
                request.BucketName = _configurationSettings.GetBucketName();
                request.Key = archivedfoldername + file_name;
            }
            else if (await _buckethelper.Exists(pickupfoldername, file_name))
            {
                fileExist = true;
                request.BucketName = _configurationSettings.GetBucketName();
                request.Key = pickupfoldername + file_name;
            }
            else if (await _buckethelper.Exists(manualpickupfoldername, file_name))
            {
                fileExist = true;
                request.BucketName = _configurationSettings.GetBucketName();
                request.Key = manualpickupfoldername + file_name;
            }
            else if (await _buckethelper.Exists(errorsfoldername, file_name))
            {
                fileExist = true;
                request.BucketName = _configurationSettings.GetBucketName();
                request.Key = errorsfoldername + file_name;
            }
            return Tuple.Create(request, fileExist);
        }

        public async Task<Tuple<string, bool>> CheckIfFilExistsInFolder(FileModel lookupdata, string archivedfoldername, string pickupfoldername, string manualpickupfoldername, string errorsfoldername)
        {
            bool fileExist = false;
            string sourcefoldername = string.Empty;

            if (await _buckethelper.Exists(manualpickupfoldername, lookupdata.FileName))
            {
                fileExist = true;
                sourcefoldername = manualpickupfoldername;
            }
            else if (await _buckethelper.Exists(pickupfoldername, lookupdata.FileName))
            {
                fileExist = true;
                sourcefoldername = pickupfoldername;
            }
            else if (await _buckethelper.Exists(archivedfoldername, lookupdata.FileName))
            {
                fileExist = true;
                sourcefoldername = archivedfoldername;
            }
            else if (await _buckethelper.Exists(errorsfoldername, lookupdata.FileName))
            {
                fileExist = true;
                sourcefoldername = errorsfoldername;
            }
            return Tuple.Create(sourcefoldername, fileExist);
        }

        public async Task<int> UpdateAdvisorFileErrorData(List<StgItcAdvisorDetails> Pdata)
        {
            DataRow row;
            DataTable dtPerferd = new DataTable();

            dtPerferd.Columns.Add("row_id", typeof(int));
            dtPerferd.Columns.Add("TaxCertificateType", typeof(string));
            dtPerferd.Columns.Add("RecordSubmissionType", typeof(string));
            dtPerferd.Columns.Add("TaxYear", typeof(string));
            dtPerferd.Columns.Add("SourceSystemID", typeof(string));
            dtPerferd.Columns.Add("FundEntityCode", typeof(string));
            dtPerferd.Columns.Add("ClientID", typeof(string));
            dtPerferd.Columns.Add("PolicyID", typeof(string));
            dtPerferd.Columns.Add("ProductCode", typeof(string));
            dtPerferd.Columns.Add("ProductInstance", typeof(string));
            dtPerferd.Columns.Add("AdvisorID", typeof(string));
            dtPerferd.Columns.Add("ChannelID", typeof(string));
            dtPerferd.Columns.Add("NatureofPerson", typeof(string));
            dtPerferd.Columns.Add("Name", typeof(string));
            dtPerferd.Columns.Add("Initials", typeof(string));
            dtPerferd.Columns.Add("Forenames", typeof(string));
            dtPerferd.Columns.Add("IDNumber", typeof(string));
            dtPerferd.Columns.Add("PassportNumber", typeof(string));
            dtPerferd.Columns.Add("PassportCountryofIssue", typeof(string));
            dtPerferd.Columns.Add("TaxNumber", typeof(string));
            dtPerferd.Columns.Add("RegistrationNumber", typeof(string));
            dtPerferd.Columns.Add("DateofBirth", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressUnitNumber", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressComplex", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressStreetNumber", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressStreetName", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressSuburb", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressCity", typeof(string));
            dtPerferd.Columns.Add("PhysicalAddressPostCode", typeof(string));
            dtPerferd.Columns.Add("PostalsameasResidential", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine1", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine2", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine3", typeof(string));
            dtPerferd.Columns.Add("PostalAddressLine4", typeof(string));
            dtPerferd.Columns.Add("PostalAddressPostCode", typeof(string));
            dtPerferd.Columns.Add("LicenceNumber", typeof(string));
            dtPerferd.Columns.Add("file_id", typeof(int));
            dtPerferd.Columns.Add("status_code", typeof(int));
            dtPerferd.Columns.Add("batch_id", typeof(int));
            dtPerferd.Columns.Add("job_id", typeof(int));
            dtPerferd.Columns.Add("status_flag", typeof(int));
            dtPerferd.Columns.Add("created_by", typeof(string));
            dtPerferd.Columns.Add("last_updated_by", typeof(string));
            dtPerferd.Columns.Add("created_date", typeof(DateTime));
            dtPerferd.Columns.Add("last_updated_date", typeof(DateTime));
            dtPerferd.Columns.Add("File_rowid", typeof(int));


            if (Pdata.Count > 0)
            {

                foreach (var ptypedata in Pdata)
                {
                    row = dtPerferd.NewRow();
                    row["row_id"] = ptypedata.row_id;
                    row["TaxCertificateType"] = ptypedata.TaxCertificateType == null || ptypedata.TaxCertificateType.ToLower() == "null" ? "" : ptypedata.TaxCertificateType;
                    row["RecordSubmissionType"] = ptypedata.RecordSubmissionType == null || ptypedata.RecordSubmissionType.ToLower() == "null" ? "" : ptypedata.RecordSubmissionType;
                    row["TaxYear"] = ptypedata.TaxYear == null || ptypedata.TaxYear.ToLower() == "null" ? "" : ptypedata.TaxYear;
                    row["SourceSystemID"] = ptypedata.SourceSystemID == null || ptypedata.SourceSystemID.ToLower() == "null" ? "" : ptypedata.SourceSystemID;
                    row["FundEntityCode"] = ptypedata.FundEntityCode == null || ptypedata.FundEntityCode.ToLower() == "null" ? "" : ptypedata.FundEntityCode;
                    row["ClientID"] = ptypedata.ClientID == null || ptypedata.ClientID.ToLower() == "null" ? "" : ptypedata.ClientID;
                    row["PolicyID"] = ptypedata.PolicyID == null || ptypedata.PolicyID.ToLower() == "null" ? "" : ptypedata.PolicyID;
                    row["ProductCode"] = ptypedata.ProductCode == null || ptypedata.ProductCode.ToLower() == "null" ? "" : ptypedata.ProductCode;
                    row["ProductInstance"] = ptypedata.ProductInstance == null || ptypedata.ProductInstance.ToLower() == "null" ? "" : ptypedata.ProductInstance;
                    row["AdvisorID"] = ptypedata.AdvisorID == null || ptypedata.AdvisorID.ToLower() == "null" ? "" : ptypedata.AdvisorID;
                    row["ChannelID"] = ptypedata.ChannelID == null || ptypedata.ChannelID.ToLower() == "null" ? "" : ptypedata.ChannelID;
                    row["NatureofPerson"] = ptypedata.NatureofPerson == null || ptypedata.NatureofPerson.ToLower() == "null" ? "" : ptypedata.NatureofPerson;
                    row["Name"] = ptypedata.Name == null || ptypedata.Name.ToLower() == "null" ? "" : ptypedata.Name;
                    row["Initials"] = ptypedata.Initials == null || ptypedata.Initials.ToLower() == "null" ? "" : ptypedata.Initials;
                    row["Forenames"] = ptypedata.Forenames == null || ptypedata.Forenames.ToLower() == "null" ? "" : ptypedata.Forenames;
                    row["IDNumber"] = ptypedata.IDNumber == null || ptypedata.IDNumber.ToLower() == "null" ? "" : ptypedata.IDNumber;
                    row["PassportNumber"] = ptypedata.PassportNumber == null || ptypedata.PassportNumber.ToLower() == "null" ? "" : ptypedata.PassportNumber;
                    row["PassportCountryofIssue"] = ptypedata.PassportCountryofIssue == null || ptypedata.PassportCountryofIssue.ToLower() == "null" ? "" : ptypedata.PassportCountryofIssue;
                    row["TaxNumber"] = ptypedata.TaxNumber == null || ptypedata.TaxNumber.ToLower() == "null" ? "" : ptypedata.TaxNumber;
                    row["RegistrationNumber"] = ptypedata.RegistrationNumber == null || ptypedata.RegistrationNumber.ToLower() == "null" ? "" : ptypedata.RegistrationNumber;
                    row["DateofBirth"] = ptypedata.DateofBirth == null || ptypedata.DateofBirth.ToLower() == "null" ? "" : ptypedata.DateofBirth;
                    row["PhysicalAddressUnitNumber"] = ptypedata.PhysicalAddressUnitNumber == null || ptypedata.PhysicalAddressUnitNumber.ToLower() == "null" ? "" : ptypedata.PhysicalAddressUnitNumber;
                    row["PhysicalAddressComplex"] = ptypedata.PhysicalAddressComplex == null || ptypedata.PhysicalAddressComplex.ToLower() == "null" ? "" : ptypedata.PhysicalAddressComplex;
                    row["PhysicalAddressStreetNumber"] = ptypedata.PhysicalAddressStreetNumber == null || ptypedata.PhysicalAddressStreetNumber.ToLower() == "null" ? "" : ptypedata.PhysicalAddressStreetNumber;
                    row["PhysicalAddressStreetName"] = ptypedata.PhysicalAddressStreetName == null || ptypedata.PhysicalAddressStreetName.ToLower() == "null" ? "" : ptypedata.PhysicalAddressStreetName;
                    row["PhysicalAddressSuburb"] = ptypedata.PhysicalAddressSuburb == null || ptypedata.PhysicalAddressSuburb.ToLower() == "null" ? "" : ptypedata.PhysicalAddressSuburb;
                    row["PhysicalAddressCity"] = ptypedata.PhysicalAddressCity == null || ptypedata.PhysicalAddressCity.ToLower() == "null" ? "" : ptypedata.PhysicalAddressCity;
                    row["PhysicalAddressPostCode"] = ptypedata.PhysicalAddressPostCode == null || ptypedata.PhysicalAddressPostCode.ToLower() == "null" ? "" : ptypedata.PhysicalAddressPostCode;
                    row["PostalsameasResidential"] = ptypedata.PostalsameasResidential == "null" ? "" : ptypedata.PostalsameasResidential;
                    row["PostalAddressLine1"] = ptypedata.PostalAddressLine1 == null || ptypedata.PostalAddressLine1.ToLower() == "null" ? "" : ptypedata.PostalAddressLine1;
                    row["PostalAddressLine2"] = ptypedata.PostalAddressLine2 == null || ptypedata.PostalAddressLine2.ToLower() == "null" ? "" : ptypedata.PostalAddressLine2;
                    row["PostalAddressLine3"] = ptypedata.PostalAddressLine3 == null || ptypedata.PostalAddressLine3.ToLower() == "null" ? "" : ptypedata.PostalAddressLine3;
                    row["PostalAddressLine4"] = ptypedata.PostalAddressLine4 == null || ptypedata.PostalAddressLine4.ToLower() == "null" ? "" : ptypedata.PostalAddressLine4;
                    row["PostalAddressPostCode"] = ptypedata.PostalAddressPostCode == null || ptypedata.PostalAddressPostCode.ToLower() == "null" ? "" : ptypedata.PostalAddressPostCode;
                    row["LicenceNumber"] = ptypedata.LicenceNumber == null || ptypedata.LicenceNumber.ToLower() == "null" ? "" : ptypedata.LicenceNumber;
                    row["file_id"] = ptypedata.file_id;
                    row["status_code"] = 1108;
                    row["batch_id"] = ptypedata.batch_id;
                    row["job_id"] = ptypedata.job_id;
                    row["status_flag"] = true;
                    row["created_by"] = string.Empty;
                    row["last_updated_by"] = string.Empty;
                    row["created_date"] = DateTime.Now;
                    row["last_updated_date"] = DateTime.Now;
                    row["File_rowid"] = ptypedata.File_rowid;
                    dtPerferd.Rows.Add(row);

                }
            }
            return await _manualDataLoad.UpdateAdvisorFileErrorData(dtPerferd);
        }

        public async Task<int> UpdateFinanceFileErrorData(List<StgItcFinanceDetails> Pdata)
        {
            DataRow row;
            DataTable dtPerferd = new DataTable();

            dtPerferd.Columns.Add("row_id", typeof(int));
            dtPerferd.Columns.Add("TaxType", typeof(string));
            dtPerferd.Columns.Add("RecordSubmissionType", typeof(string));
            dtPerferd.Columns.Add("TaxYear", typeof(string));
            dtPerferd.Columns.Add("SourceSystemID", typeof(string));
            dtPerferd.Columns.Add("FundEntityCode", typeof(string));
            dtPerferd.Columns.Add("ClientID", typeof(string));
            dtPerferd.Columns.Add("PolicyID", typeof(string));
            dtPerferd.Columns.Add("ProductCode", typeof(string));
            dtPerferd.Columns.Add("ProductInstance", typeof(string));
            dtPerferd.Columns.Add("ClientIntermediatedIndicator", typeof(string));
            dtPerferd.Columns.Add("TaxSourceCode", typeof(string));
            dtPerferd.Columns.Add("March", typeof(double));
            dtPerferd.Columns.Add("April", typeof(double));
            dtPerferd.Columns.Add("May", typeof(double));
            dtPerferd.Columns.Add("June", typeof(double));
            dtPerferd.Columns.Add("July", typeof(double));
            dtPerferd.Columns.Add("August", typeof(double));
            dtPerferd.Columns.Add("September", typeof(double));
            dtPerferd.Columns.Add("October", typeof(double));
            dtPerferd.Columns.Add("November", typeof(double));
            dtPerferd.Columns.Add("December", typeof(double));
            dtPerferd.Columns.Add("January", typeof(double));
            dtPerferd.Columns.Add("February", typeof(double));
            dtPerferd.Columns.Add("CurrentAmountIncomeProtectionAmount", typeof(double));
            dtPerferd.Columns.Add("ArrearsAmount", typeof(double));
            dtPerferd.Columns.Add("ProductName", typeof(string));
            dtPerferd.Columns.Add("file_id", typeof(int));
            dtPerferd.Columns.Add("status_code", typeof(int));
            dtPerferd.Columns.Add("batch_id", typeof(int));
            dtPerferd.Columns.Add("job_id", typeof(int));
            dtPerferd.Columns.Add("status_flag", typeof(int));
            dtPerferd.Columns.Add("created_by", typeof(string));
            dtPerferd.Columns.Add("last_updated_by", typeof(string));
            dtPerferd.Columns.Add("created_date", typeof(DateTime));
            dtPerferd.Columns.Add("last_updated_date", typeof(DateTime));
            dtPerferd.Columns.Add("File_rowid", typeof(int));


            if (Pdata.Count > 0)
            {
                foreach (var ptypedata in Pdata)
                {
                    row = dtPerferd.NewRow();
                    row["row_id"] = ptypedata.row_id;
                    row["TaxType"] = ptypedata.TaxType == null || ptypedata.TaxType.ToLower() == "null" ? "" : ptypedata.TaxType;
                    row["RecordSubmissionType"] = ptypedata.RecordSubmissionType == null || ptypedata.RecordSubmissionType.ToLower() == "null" ? "" : ptypedata.RecordSubmissionType;
                    row["TaxYear"] = ptypedata.TaxYear == null || ptypedata.TaxYear.ToLower() == "null" ? "" : ptypedata.TaxYear;
                    row["SourceSystemID"] = ptypedata.SourceSystemID == null || ptypedata.SourceSystemID.ToLower() == "null" ? "" : ptypedata.SourceSystemID;
                    row["FundEntityCode"] = ptypedata.FundEntityCode == null || ptypedata.FundEntityCode.ToLower() == "null" ? "" : ptypedata.FundEntityCode;
                    row["ClientID"] = ptypedata.ClientID == null || ptypedata.ClientID.ToLower() == "null" ? "" : ptypedata.ClientID;
                    row["PolicyID"] = ptypedata.PolicyID == null || ptypedata.PolicyID.ToLower() == "null" ? "" : ptypedata.PolicyID;
                    row["ProductCode"] = ptypedata.ProductCode == null || ptypedata.ProductCode.ToLower() == "null" ? "" : ptypedata.ProductCode;
                    row["ProductInstance"] = ptypedata.ProductInstance == null || ptypedata.ProductInstance.ToLower() == "null" ? "" : ptypedata.ProductInstance;
                    row["ClientIntermediatedIndicator"] = ptypedata.ClientIntermediatedIndicator == null || ptypedata.ClientIntermediatedIndicator.ToLower() == "null" ? "" : ptypedata.ClientIntermediatedIndicator;
                    row["TaxSourceCode"] = ptypedata.TaxSourceCode == null || ptypedata.TaxSourceCode.ToLower() == "null" ? "" : ptypedata.TaxSourceCode;
                    row["March"] = ptypedata.March;
                    row["April"] = ptypedata.April;
                    row["May"] = ptypedata.May;
                    row["June"] = ptypedata.June;
                    row["July"] = ptypedata.July;
                    row["August"] = ptypedata.August;
                    row["September"] = ptypedata.September;
                    row["October"] = ptypedata.October;
                    row["November"] = ptypedata.November;
                    row["December"] = ptypedata.December;
                    row["January"] = ptypedata.January;
                    row["February"] = ptypedata.February;
                    row["CurrentAmountIncomeProtectionAmount"] = ptypedata.CurrentAmountIncomeProtectionAmount;
                    row["ArrearsAmount"] = ptypedata.ArrearsAmount;
                    row["ProductName"] = ptypedata.ProductName == "null" ? "" : ptypedata.ProductName;
                    row["file_id"] = ptypedata.file_id;
                    row["status_code"] = 1108;
                    row["batch_id"] = ptypedata.batch_id;
                    row["job_id"] = ptypedata.job_id;
                    row["status_flag"] = true;
                    row["created_by"] = string.Empty;
                    row["last_updated_by"] = string.Empty;
                    row["created_date"] = DateTime.Now;
                    row["last_updated_date"] = DateTime.Now;
                    row["File_rowid"] = ptypedata.File_rowid;
                    dtPerferd.Rows.Add(row);

                }
            }

            return await _manualDataLoad.UpdateFinanceFileErrorData(dtPerferd);
        }

        public async Task<IEnumerable<object>> GetPasDataLoadError(int file_id, int document_type_id, int page_no, int size)
        {
            var result = await _manualDataLoad.GetPasDataLoadError(file_id, document_type_id, page_no, size);
            return result;
        }

        public async Task<ValidationErrorDto> GetPasDataLoadErrorHeader(int file_id, int document_type_id, int page_no, int size)
        {
            var temp = await _manualDataLoad.GetPasDataLoadError(file_id, document_type_id, page_no, size);
            DataTable dt = DtGetRows(temp.ToList());
            var result = await _manualDataLoad.GetPasDataLoadErrorHeader(file_id, document_type_id, dt);
            ValidationErrorDto objalidationErrorDto = new ValidationErrorDto();
            objalidationErrorDto.lstDataLoadErrorHeader = result.ToList();
            var result2 = await _manualDataLoad.GetErrorDescription(file_id, document_type_id, dt);
            objalidationErrorDto.lstDataLoadErrorDecription = result2.ToList();
            return objalidationErrorDto;
        }

        private static DataTable DtGetRows(dynamic lstRowsData)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("ID", typeof(int));
            DataRow row;
            for (int i = 0; i < lstRowsData.Count; i++)
            {
                row = dt.NewRow();
                row["ID"] = lstRowsData[i].row_id;
                dt.Rows.Add(row);
            }
            return dt;
        }

        public async Task<IEnumerable<DataLoad>> GetPasFileDataById(int file_id)
        {
            var result = await _manualDataLoad.GetPasFileDataById(file_id);
            foreach (DataLoad item in result)
            {
                if (!string.IsNullOrEmpty(item.TaxYears) && item.TaxYears.Contains(","))
                    item.strTaxYears = item.TaxYears.Split(',');
            }
            return result;
        }
        public async Task<int> UpdateMemberFileErrorData(List<StgItcMembershipDetails> Pdata)
        {
            DataRow row;
            DataTable dtPerferd = new DataTable();

            dtPerferd.Columns.Add("row_id", typeof(int));
            dtPerferd.Columns.Add("TaxType", typeof(string));
            dtPerferd.Columns.Add("RecordSubmissionType", typeof(string));
            dtPerferd.Columns.Add("TaxYear", typeof(string));
            dtPerferd.Columns.Add("SourceSystemID", typeof(string));
            dtPerferd.Columns.Add("FundEntityCode", typeof(string));
            dtPerferd.Columns.Add("ClientID", typeof(string));
            dtPerferd.Columns.Add("PolicyID", typeof(string));
            dtPerferd.Columns.Add("ProductCode", typeof(string));
            dtPerferd.Columns.Add("ProductInstance", typeof(string));
            dtPerferd.Columns.Add("PolicyOnDate", typeof(string));
            dtPerferd.Columns.Add("PolicyOffDate", typeof(string));
            dtPerferd.Columns.Add("file_id", typeof(int));
            dtPerferd.Columns.Add("status_code", typeof(int));
            dtPerferd.Columns.Add("batch_id", typeof(int));
            dtPerferd.Columns.Add("job_id", typeof(int));
            dtPerferd.Columns.Add("status_flag", typeof(int));
            dtPerferd.Columns.Add("created_by", typeof(string));
            dtPerferd.Columns.Add("last_updated_by", typeof(string));
            dtPerferd.Columns.Add("created_date", typeof(DateTime));
            dtPerferd.Columns.Add("last_updated_date", typeof(DateTime));
            dtPerferd.Columns.Add("File_rowid", typeof(int));


            if (Pdata.Count > 0)
            {

                foreach (var ptypedata in Pdata)
                {
                    row = dtPerferd.NewRow();
                    row["row_id"] = ptypedata.row_id;
                    row["TaxType"] = ptypedata.TaxType == null || ptypedata.TaxType.ToLower() == "null" ? "" : ptypedata.TaxType;
                    row["RecordSubmissionType"] = ptypedata.RecordSubmissionType == null || ptypedata.RecordSubmissionType.ToLower() == "null" ? "" : ptypedata.RecordSubmissionType;
                    row["TaxYear"] = ptypedata.TaxYear == null || ptypedata.TaxYear.ToLower() == "null" ? "" : ptypedata.TaxYear;
                    row["SourceSystemID"] = ptypedata.SourceSystemID == null || ptypedata.SourceSystemID.ToLower() == "null" ? "" : ptypedata.SourceSystemID;
                    row["FundEntityCode"] = ptypedata.FundEntityCode == null || ptypedata.FundEntityCode.ToLower() == "null" ? "" : ptypedata.FundEntityCode;
                    row["ClientID"] = ptypedata.ClientID == null || ptypedata.ClientID.ToLower() == "null" ? "" : ptypedata.ClientID;
                    row["PolicyID"] = ptypedata.PolicyID == null || ptypedata.PolicyID.ToLower() == "null" ? "" : ptypedata.PolicyID;
                    row["ProductCode"] = ptypedata.ProductCode == null || ptypedata.ProductCode.ToLower() == "null" ? "" : ptypedata.ProductCode;
                    row["ProductInstance"] = ptypedata.ProductInstance == null || ptypedata.ProductInstance.ToLower() == "null" ? "" : ptypedata.ProductInstance;
                    row["PolicyOnDate"] = ptypedata.PolicyOnDate == null || ptypedata.PolicyOnDate.ToLower() == "null" ? DBNull.Value : Convert.ToDateTime(ptypedata.PolicyOnDate).ToString("yyyy/MM/dd");
                    row["PolicyOffDate"] = ptypedata.PolicyOffDate == null || ptypedata.PolicyOffDate.ToLower() == "null" ? DBNull.Value : Convert.ToDateTime(ptypedata.PolicyOffDate).ToString("yyyy/MM/dd");
                    row["file_id"] = ptypedata.file_id;
                    row["status_code"] = 1108;
                    row["batch_id"] = ptypedata.batch_id;
                    row["job_id"] = ptypedata.job_id;
                    row["status_flag"] = true;
                    row["created_by"] = string.Empty;
                    row["last_updated_by"] = string.Empty;
                    row["created_date"] = DateTime.Now;
                    row["last_updated_date"] = DateTime.Now;
                    row["File_rowid"] = ptypedata.File_rowid;
                    dtPerferd.Rows.Add(row);

                }
            }
            return await _manualDataLoad.UpdateMemberFileErrorData(dtPerferd);
        }

        public async Task<int> CheckIfFileHasMissingInformation(int document_type_id, int file_id)
        {
            return await _manualDataLoad.CheckIfFileHasMissingInformation(document_type_id, file_id);
        }

        public async Task<IEnumerable<MissingInformationDto>> GetMissingInformationByFileId(int document_type_id, int file_id)
        {
            return await _manualDataLoad.GetMissingInformationByFileId(document_type_id, file_id);
        }

        public async Task<int> AddPasMissingInformation(string LookupValueName, string LookupValueDescription, string LookupTypeName, int FileId, string misc_value)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _manualDataLoad.AddPasMissingInformation(userName, LookupValueName, LookupValueDescription, LookupTypeName, FileId, misc_value);
        }

        public async Task<int> CheckIfLookupExists(string LookupValueName, string LookupTypeName, int FileId)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _manualDataLoad.CheckIfLookupExists(LookupValueName, LookupTypeName, FileId, userName);
        }

        public async Task<int> AddMissingTaxPeriodData(TaxPeriodDto taxPeriodDto)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _manualDataLoad.AddMissingTaxPeriodData(taxPeriodDto, userName);
        }

        public async Task<int> ReprocessFile(int DocumentTypeId, int FileId)
        {
            var userName = _httpContextAccessor.HttpContext.User.FindFirst("name").Value;
            return await _manualDataLoad.ReprocessFile(DocumentTypeId, FileId, userName);
        }
    }
}
