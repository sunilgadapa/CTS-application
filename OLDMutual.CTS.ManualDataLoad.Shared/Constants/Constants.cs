using System;
using System.Collections.Generic;
using System.Text;

namespace OLDMutual.CTS.ManualDataLoad.Shared.Constants
{
    public static class Constants
    {
        public const string AWS_SECRET_LOCALConStr = "oml/dev/db/connection_string";
        public const string AWS_SECRET_DEVConStr = "oml/dev/db/connection_string";
        public const string AWS_SECRET_QAConStr = "oml/qa/db/connection_string";
        public const string AWS_SECRET_UATConStr = "oml/uat/db/connection_string";
        public const string AWS_SECRET_PRODConStr = "oml/prod/db/connection_string";
        public const string AWS_SECRET_NONPRODS3BucketName = "oml/dev/s3/bucket_name";
        public const string AWS_SECRET_UATS3BucketName = "oml/uat/s3/bucket_name";
        public const string AWS_SECRET_PRODS3BucketName = "oml/prod/s3/bucket_name";
    }
}
