using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Service.Interfaces
{
    public interface IAwsS3BucketFileService
    {
        Task<int> UploadFile(string fullPath,int file_type,string filename,int tax_period);
        Task<bool> ProcessFile(int file_id, string filename);
        Task<bool> DeleteFile(int file_id, string filename, string sourcefoldername, string deletefoldername);
    }
}
