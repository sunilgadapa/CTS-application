using System;
using System.Threading.Tasks;

namespace OLDMutual.CTS.ManualDataLoad.Data.Interfaces
{
    public interface IAwsS3File : IDisposable
    {
        Task<int> UploadFile(string fullPath, int file_type, string filename, int tax_perid);
        Task<bool> ProcessFile(int file_id, string filename);
    }
}
