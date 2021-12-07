using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Service.Interfaces
{
    public interface IAwsS3BucketHelperService
    {
        Task<int> UploadFile(System.IO.Stream inputStream, string fileName, string foldername);
        Task<bool> ProcessFile(string sourcepath, string destinationpah, string fileName);
        Task<bool> Exists(string path, string filename);
        Task<bool> DeleteFile(string sourcepath, string deletefoldername, string fileName);
    }
}
