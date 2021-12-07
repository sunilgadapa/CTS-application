using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;
using Amazon.S3;
using Amazon.S3.Model;
using ExcelDataReader;
using FluentValidation.Results;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;

using OLDMutual.CTS.ManualDataLoad.Domain.Models;
using OLDMutual.CTS.ManualDataLoad.Domain.Validators;
using OLDMutual.CTS.ManualDataLoad.Service.Interfaces;
using OLDMutual.CTS.ManualDataLoad.Service.Services;
using OLDMutual.CTS.ManualDataLoad.Shared.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;


namespace OLDMutual.CTS.ManualDataLoad.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class ManualDataLoadController : Controller
    {
        readonly JsonResult js = new JsonResult();
        private readonly IManualDataLoadService _manualDataLoadService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IAwsS3BucketFileService _awsS3FileService;
        private readonly IAmazonS3 _amazonS3;
        CredentialProfile basicProfile;
        AWSCredentials awsCredentials;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        private readonly IHostEnvironment _env;
        public ManualDataLoadController(IManualDataLoadService manualDataLoadService
            , IWebHostEnvironment hostingEnvironment
            , IAwsS3BucketFileService awsS3FileService, IAmazonS3 s3Client, IHostEnvironment env
            , IHubContext<BroadcastHub, IHubClient> hubContext)
        {
            _manualDataLoadService = manualDataLoadService;
            _hostingEnvironment = hostingEnvironment;
            _awsS3FileService = awsS3FileService;
            this._amazonS3 = s3Client;
            _env = env;
            _hubContext = hubContext;
        }


        #region manualdataload
        /*  
       .......................................................................................................
       * This is the GetDropdowndata GET API  
       * @param type is used to specify the name of the drop down list
       * GetDropdowndata() is used to get drop down data on manual data load page
       .......................................................................................................
       */
        [HttpGet("GetDropdowndata")]
        [Authorize]
        public async Task<IActionResult> GetDropdowndata(string type)
        {
            try
            {
                var sourcesystem = await _manualDataLoadService.GETDropDownData(type);
                if (!sourcesystem.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = type + " data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = type + " data  found";
                    js.data = sourcesystem;
                    return Ok(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /*  
       .......................................................................................................
       * This is the GetDataLoad POST API  
       * @param data is used to specify the name filter data in a JSON format as arequest body
       * GetDataLoad() is used to get files data on the manual data load page by selected filters
       .......................................................................................................
       */
        [HttpPost("GetDatLoad")]
        [Authorize]
        public async Task<IActionResult> GetDataLoad(DataLoad data)
        {
            try
            {
                var sourcesystem = await _manualDataLoadService.GETDataLoad(data);
                if (!sourcesystem.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Data found";
                    js.data = sourcesystem;
                    return Ok(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /*  
      .......................................................................................................
      * This is the UploadFile POST API  
      * @param file_type is used to get the file type id as a req header
      * @param tax_period is used to get the tax period as a req header
      * UploadFile() is used to upload the file in a S3 bucket
      .......................................................................................................
      */
        [HttpPost("UploadFile")]
        [RequestFormLimits(MultipartBodyLengthLimit = 209715200)]
        [Authorize]
        public async Task<IActionResult> UploadFile([FromForm] int file_type, [FromForm] int tax_period)
        {
            try
            {
                var supportedTypes = new[] { ".csv", ".xls", ".xlsx", ".txt" };
                var GcsSupportedTypes = new[] { ".txt" };
                if (!Request.Form.Files.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Please select file!";
                    js.data = false;
                    return Ok(js);
                }
                var file = Request.Form.Files[0];
                string folderName = "Upload";
                string webRootPath = _hostingEnvironment.ContentRootPath;
                string newPath = Path.Combine(webRootPath, folderName);
                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    var extension = Path.GetExtension(file.FileName).ToLower();
                    if (file_type == 3 && !GcsSupportedTypes.Contains(extension))
                    {
                        js.Statuscode = (int)HttpStatusCode.NotFound;
                        js.Message = "Please upload txt file.";
                        js.data = null;
                        return NotFound(js);
                    }
                    else if (!supportedTypes.Contains(extension))
                    {
                        js.Statuscode = (int)HttpStatusCode.NotFound;
                        js.Message = "Please upload csv,xls,xlsx or txt file.";
                        js.data = null;
                        return NotFound(js);
                    }
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.ToString();
                    string fullPath = Path.Combine(newPath, fileName);
                    using (var fsSource = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(fsSource);
                    }
                    string[] splitLines;

                    int? columncount;
                    switch (file_type)
                    {
                        case 1:
                            columncount = 40;
                            break;
                        case 2:
                            columncount = 33;
                            break;
                        case 4:
                            columncount = 8;
                            break;
                        case 6:
                            columncount = 4;
                            break;
                        case 9:
                            columncount = 12;
                            break;
                        case 10:
                            columncount = 26;
                            break;
                        case 11:
                            columncount = 36;
                            break;
                        case 19:
                            columncount = 40;
                            break;
                        default:
                            columncount = null;
                            break;
                    }
                    if (file_type != 3)
                    {
                        if (extension == ".txt" || extension == ".csv")
                        {
                            using (StreamReader sr = new StreamReader(fullPath))
                            {
                                string line = sr.ReadLine();
                                if (line == null)
                                {
                                    js.Statuscode = (int)HttpStatusCode.NotFound;
                                    js.Message = "Some error occured for uploading file";
                                    js.data = null;
                                    return NotFound(js);
                                }
                                else
                                {
                                    splitLines = extension == ".txt" ? line.Split(new char[] { '|', ',' }) : line.Split(new char[] { ',' });
                                    if (splitLines.Length == 1)
                                    {
                                        js.Statuscode = (int)HttpStatusCode.BadRequest;
                                        js.Message = "Incorrect seperator used in the file";
                                        js.data = null;
                                        return BadRequest(js);
                                    }
                                    else if (splitLines.Length > 0 && splitLines.Length != columncount)
                                    {
                                        js.Statuscode = (int)HttpStatusCode.BadRequest;
                                        js.Message = "No of columns information in the file not found as per file type";
                                        js.data = null;
                                        return BadRequest(js);
                                    }

                                }
                            }
                        }
                        else
                        {
                            int ExcelColumnCount = 0;
                            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
                            using (var stream = System.IO.File.Open(fullPath, FileMode.Open, FileAccess.Read))
                            {
                                using (var reader = ExcelReaderFactory.CreateReader(stream))
                                {
                                    ExcelColumnCount = reader.FieldCount;
                                }
                            }
                            if (ExcelColumnCount != columncount)
                            {
                                js.Statuscode = (int)HttpStatusCode.BadRequest;
                                js.Message = "No of columns information in the file not found as per file type";
                                js.data = null;
                                return BadRequest(js);
                            }
                        }
                    }
                    int result = await _awsS3FileService.UploadFile(fullPath, file_type, fileName, tax_period);
                    if (result == 4)
                    {
                        js.Statuscode = (int)HttpStatusCode.Conflict;
                        js.Message = "File already exists in the system";
                        js.data = null;
                        return Conflict(js);
                    }
                    else if (result == 3)
                    {
                        js.Statuscode = (int)HttpStatusCode.NotFound;
                        js.Message = "Some error occured for uploading file";
                        js.data = null;
                        return NotFound(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "File Uploaded successfully";
                        js.data = result;
                        return Ok(js);
                    }
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Please don't select empty file!";
                    js.data = false;
                    return Ok(js);
                }

            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }
        /*  
        .......................................................................................................
        * This is the DeleteFile POST API  
        * @param lookupdata is used to get the data in JSON format as request body    
        * DeleteFile() is used to delte the file from a S3 bucket
        .......................................................................................................
        */

        [HttpPost("DeleteFile")]
        [Authorize]
        public async Task<IActionResult> DeleteFile(List<FileModel> lookupdata)
        {
            try
            {
                FileModelValidator _validator = new FileModelValidator();
                var res = _validator.Validate(lookupdata);

                if (!res.IsValid)
                {
                    List<string> ValidationMessages = new List<string>();

                    foreach (ValidationFailure failure in res.Errors)
                    {
                        ValidationMessages.Add(failure.PropertyName + ": " + failure.ErrorMessage);
                    }
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Some Error occured";
                    js.data = ValidationMessages;
                    return NotFound(js);

                }
                else
                {
                    for (int i = 0; i < lookupdata.Count; i++)
                    {
                        string pickupfoldername = await _manualDataLoadService.GetFileType(0, lookupdata[i].Ids) + "Pickup/";
                        string manualpickupfoldername = await _manualDataLoadService.GetFileType(0, lookupdata[i].Ids) + "ManualPickup/";
                        string archivedfoldername = await _manualDataLoadService.GetFileType(0, lookupdata[i].Ids) + "Archived/";
                        string deletefoldername = await _manualDataLoadService.GetFileType(0, lookupdata[i].Ids) + "Deleted/";
                        string errorfoldername = await _manualDataLoadService.GetFileType(0, lookupdata[i].Ids) + "Deleted/";
                        var tupleResult = await _manualDataLoadService.CheckIfFilExistsInFolder(lookupdata[i], archivedfoldername, pickupfoldername, manualpickupfoldername, errorfoldername);
                        if (tupleResult.Item2)
                        {
                            await _awsS3FileService.DeleteFile(lookupdata[i].Ids, lookupdata[i].FileName, tupleResult.Item1, deletefoldername);
                        }
                    }

                    var result = await _manualDataLoadService.DeleteFile(lookupdata);
                    if (result == 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.NotFound;
                        js.Message = "Selected file not deleted";
                        js.data = null;
                        return NotFound(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "Selected file deleted successfully";
                        js.data = null;
                        return Ok(js);
                    }
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.InnerException.Message;
                return BadRequest(js);
            }

        }
        /*  
        .......................................................................................................
        * This is the GetFileDataById GET API  
        * @param file_id is used to get the file id as a req header
        * GetFileDataById() is used to get the file details by id
        .......................................................................................................
        */
        [HttpGet("GetFileDataById")]
        [Authorize]
        public async Task<IActionResult> GetFileDataById(int file_id)
        {
            try
            {
                var result = await _manualDataLoadService.GETDataLoadByid(file_id);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "File Data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "File data found";
                    js.data = result;
                    return Ok(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /*  
       .......................................................................................................
       * This is the GetDataLoadError GET API  
       * @param file_id is used to get the file id as a req header
       * @param documment_type_id is used to get the file type id as a req header
       * @param page_no is used to get the page number as a req header
       * @param size is used to get the page size as a req header
       * GetDataLoadError() is used to get the data load errors
       .......................................................................................................
       */
        [HttpGet("GetDataLoadError")]
        [Authorize]
        public async Task<IActionResult> GetDataLoadErrorAsync(int file_id, int documment_type_id, int page_no, int size)
        {
            try
            {
                var result = await _manualDataLoadService.GETDataLoadErrorBy(file_id, documment_type_id, page_no, size);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Error record not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Error data found";
                    js.data = result;
                    return Ok(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /*  
       .......................................................................................................
       * This is the GetDataLoadErrorHeader GET API  
       * @param file_id is used to get the file id as a req header
       * @param documment_type_id is used to get the file type id as a req header
       * @param page_no is used to get the page number as a req header
       * @param size is used to get the page size as a req header
       * GetDataLoadErrorHeaderAsync() is used to get the data load error headers
       .......................................................................................................
       */

        [HttpGet("GetDataLoadErrorHeader")]
        [Authorize]
        public async Task<IActionResult> GetDataLoadErrorHeaderAsync(int file_id, int documment_type_id, int page_no, int size)
        {
            try
            {
                var result = await _manualDataLoadService.GETDataLoadHeadderErrorBy(file_id, documment_type_id, page_no, size);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Error record not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Error data found";
                    js.data = result;
                    return Ok(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }
        /*  
       .......................................................................................................
       * This is the ProcessFile POST API  
       * @param file_id is used to get the file id as a req header
       * @param file_name is used to get the file name as a req header      
       * ProcessFile() is used to process the file to move from one dir to another
       .......................................................................................................
       */
        [HttpPost("ProcessFile")]
        [Authorize]
        public async Task<IActionResult> ProcessFile(int file_id, string file_name)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var result = await _awsS3FileService.ProcessFile(file_id, file_name);

                    if (!result)
                    {
                        js.Statuscode = (int)HttpStatusCode.NotFound;
                        js.Message = "File already in process.";
                        js.data = null;
                        return NotFound(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "File uploaded successfully.";
                        js.data = result;
                        await _hubContext.Clients.All.BroadcastMessage();
                        return Ok(js);
                    }

                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User is not valid";
                    js.data = null;
                    return NotFound(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /*  
       .......................................................................................................
       * This is the DownloadFile POST API  
       * @param file_id is used to get the file id as a req header
       * @param file_name is used to get the file name as a req header      
       * DownloadFile() is used to download the selected file
       .......................................................................................................
       */
        [HttpGet("DownloadFile")]
        [Authorize]
        public async Task<IActionResult> DownloadFile(int file_id, string file_name)
        {
            try
            {
                GetObjectResponse objectResponse;
                string archivedfoldername = await _manualDataLoadService.GetFileType(0, file_id) + "Archived/";
                string pickupfoldername = await _manualDataLoadService.GetFileType(0, file_id) + "Pickup/";
                string manualpickupfoldername = await _manualDataLoadService.GetFileType(0, file_id) + "ManualPickup/";
                string errorsfoldername = await _manualDataLoadService.GetFileType(0, file_id) + "Errors/";
                var result = await _manualDataLoadService.DownloadFile(file_id, file_name, archivedfoldername, pickupfoldername, manualpickupfoldername, errorsfoldername);

                if (result.Item2)
                {
                    if (_env.IsDevelopment())
                    {
                        var sharedFile = new SharedCredentialsFile();
                        if (sharedFile.TryGetProfile("default", out basicProfile) &&
                            AWSCredentialsFactory.TryGetAWSCredentials(basicProfile, sharedFile, out awsCredentials))
                        {
                            using (var client = new AmazonS3Client(awsCredentials, basicProfile.Region))
                            {
                                objectResponse = await client.GetObjectAsync(result.Item1);
                            }
                        }
                        else
                        {
                            js.Statuscode = (int)HttpStatusCode.NotFound;
                            js.Message = "Something went wrong!";
                            js.data = null;
                            return NotFound(js);
                        }
                    }
                    else
                    {
                        objectResponse = await _amazonS3.GetObjectAsync(result.Item1);
                    }

                    if (objectResponse.ResponseStream == null)
                    {
                        return NotFound();
                    }

                    return File(objectResponse.ResponseStream, objectResponse.Headers.ContentType, file_name);
                }

                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "File Not Found in s3 bucket Folder.";
                    js.data = null;
                    return NotFound(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }
        /*  
      .......................................................................................................
      * This is the UpdatePreferFileData POST API  
      * @param ErrorData is used to get the data in a JSON format as a request body         
      * UpdatePreferFileData() is used to update the prefered correspondence error data
      .......................................................................................................
      */
        [HttpPost("UpdatePreferFileData")]
        [Authorize]
        public async Task<IActionResult> UpdatePreferFileData([FromForm] ListPreferedData ErrorData)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var result = await _manualDataLoadService.AddPreferedNewDataError(ErrorData.Pdata);

                    if (result == 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.BadRequest;
                        js.Message = "Some Error occured.";
                        js.data = null;
                        return NotFound(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "Error updated successfully.";
                        js.data = result;
                        return Ok(js);
                    }

                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User is not valid";
                    js.data = null;
                    return NotFound(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }
        /*  
     .......................................................................................................
     * This is the UpdateGCSFileData POST API  
     * @param ErrorData is used to get the data in a JSON format as a request body         
     * UpdateGCSFileData() is used to update the GCS file error data
     .......................................................................................................
     */

        [HttpPost("UpdateGCSFileData")]
        [Authorize]
        public async Task<IActionResult> UpdateGCSFileData([FromForm] ListGcsResponseData ErrorData)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var result = await _manualDataLoadService.AddGCSDataError(ErrorData.Gdata);

                    if (result == 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.BadRequest;
                        js.Message = "Some Error occured.";
                        js.data = null;
                        return NotFound(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "Error updated successfully.";
                        js.data = result;
                        return Ok(js);
                    }

                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User is not valid";
                    js.data = null;
                    return NotFound(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /*  
     .......................................................................................................
     * This is the UpdateCThiredPartyFileData POST API  
     * @param ErrorData is used to get the data in a JSON format as a request body         
     * UpdateCThiredPartyFileData() is used to update the client third party file error data
     .......................................................................................................
     */
        [HttpPost("UpdateCThiredPartyFileData")]
        [Authorize]
        public async Task<IActionResult> UpdateCThiredPartyFileData([FromForm] ListClientDetailThirdParty ErrorData)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var result = await _manualDataLoadService.AddClientThiredpartyDataError(ErrorData.CError);

                    if (result == 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.BadRequest;
                        js.Message = "Some Error occured.";
                        js.data = null;
                        return NotFound(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "Error updated successfully.";
                        js.data = result;
                        return Ok(js);
                    }

                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User is not valid";
                    js.data = null;
                    return NotFound(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /*  
    .......................................................................................................
    * This is the UpdateSampleCerFileData POST API  
    * @param ErrorData is used to get the data in a JSON format as a request body         
    * UpdateSampleCerFileData() is used to update the sample certificate file error data
    .......................................................................................................
    */
        [HttpPost("UpdateSampleCerFileData")]
        [Authorize]
        public async Task<IActionResult> UpdateSampleCerFileData([FromForm] ListSampleCerData ErrorData)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var result = await _manualDataLoadService.AddSampleCertificateError(ErrorData.CerData);

                    if (result == 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.BadRequest;
                        js.Message = "Some Error occured.";
                        js.data = null;
                        return NotFound(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "Error updated successfully.";
                        js.data = result;
                        return Ok(js);
                    }

                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User is not valid";
                    js.data = null;
                    return NotFound(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }

        /*  
   .......................................................................................................
   * This is the UpdateAdvisorFileData POST API  
   * @param ErrorData is used to get the data in a JSON format as a request body         
   * UpdateAdvisorFileData() is used to update the advisor file error data
   .......................................................................................................
   */
        [HttpPost("UpdateAdvisorFileData")]
        [Authorize]
        public async Task<IActionResult> UpdateAdvisorFileData([FromForm] ListAdvisorData ErrorData)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var result = await _manualDataLoadService.AddAdvisorDataError(ErrorData.AdvData);

                    if (result == 0)
                    {
                        js.Statuscode = (int)HttpStatusCode.BadRequest;
                        js.Message = "Some Error occured.";
                        js.data = null;
                        return NotFound(js);
                    }
                    else
                    {
                        js.Statuscode = (int)HttpStatusCode.OK;
                        js.Message = "Error Updated successfully";
                        js.data = result;
                        return Ok(js);
                    }

                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User is not valid";
                    js.data = null;
                    return NotFound(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }
        /*  
  .......................................................................................................
  * This is the DeleteErrorRow POST API  
  * @param ErrorData is used to get the data in a JSON format as a request body         
  * DeleteErrorRow() is used to delete the selected error record
  .......................................................................................................
  */
        [HttpPost("DeleteErrorRow")]
        [Authorize]
        public async Task<IActionResult> DeleteErrorRow(FileErrorModel lookupdata)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    FileErrorModelValidator _validator = new FileErrorModelValidator();
                    var res = _validator.Validate(lookupdata);

                    if (!res.IsValid)
                    {
                        List<string> ValidationMessages = new List<string>();

                        foreach (ValidationFailure failure in res.Errors)
                        {
                            ValidationMessages.Add(failure.PropertyName + ": " + failure.ErrorMessage);
                        }
                        js.Statuscode = (int)HttpStatusCode.NotFound;
                        js.Message = "Some Error occured";
                        js.data = ValidationMessages;
                        return NotFound(js);

                    }
                    else
                    {
                        var result = await _manualDataLoadService.DeleteErrorRecord(lookupdata);
                        if (result == 0)
                        {
                            js.Statuscode = (int)HttpStatusCode.NotFound;
                            js.Message = "Selected error record not deleted";
                            js.data = null;
                            return NotFound(js);
                        }
                        else
                        {
                            js.Statuscode = (int)HttpStatusCode.OK;
                            js.Message = "Selected error record deleted successfully";
                            js.data = null;
                            return Ok(js);
                        }
                    }

                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "User is not valid";
                    js.data = null;
                    return NotFound(js);
                }
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.InnerException.Message;
                return BadRequest(js);
            }

        }
        #endregion
    }
}
