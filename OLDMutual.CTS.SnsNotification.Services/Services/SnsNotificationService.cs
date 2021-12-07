using Amazon.Runtime.CredentialManagement;
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using Microsoft.AspNetCore.Http;
using OLDMutual.CTS.SnsNotification.Data.Interfaces;
using OLDMutual.CTS.SnsNotification.Domain.Models;
using OLDMutual.CTS.SnsNotification.Service.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace OLDMutual.CTS.SnsNotification.Service.Services
{

    public class SnsNotificationService : ISnsNotificationService
    {
        private readonly ISnsNotification _snsNotification;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public SnsNotificationService(ISnsNotification snsNotification, IHttpContextAccessor httpContextAccessor)
        {
            _snsNotification = snsNotification;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// Get Notification Count
        /// </summary>
        /// <returns>Object</returns>
        public async Task<NotificationCountResult> GetNotificationCount()
        {
            /*Change user id as dynamic lator*/
            var eMail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            var result = _snsNotification.GetNotificationCount(eMail);
            return await result;
        }

        /// <summary>
        /// Get Notification result based on user id and notification Type
        /// </summary>
        /// <param name="notificationParams">Input params for procedure</param>
        /// <returns>LIst Object</returns>
        public async Task<IEnumerable<NotificationResult>> GetNotificationResult(NotificationParams notificationParams)
        {
            var eMail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            notificationParams.Email = eMail;
            return await _snsNotification.GetNotificationResult(notificationParams);
        }

        /// <summary>
        /// Publishes a message to an Amazon SNS topic.
        /// </summary>

        public async Task<bool> PublishToTopicForEmailAsync()
        {
            NotificationParams notificationParams = new NotificationParams();
            notificationParams.Page = 1;
            notificationParams.Size = 1000000;
            notificationParams.Notification_Type = "Email";
            var result = await _snsNotification.GetNotificationResult(notificationParams);

            var sharedFile = new SharedCredentialsFile();
            sharedFile.TryGetProfile("default", out var profile);
            AWSCredentialsFactory.TryGetAWSCredentials(profile, sharedFile, out var credentials);
            var snsClient = new AmazonSimpleNotificationSer‌​viceClient(credentials, region: Amazon.RegionEndpoint.EUWest1);
            // If there are more than 100 Amazon SNS topics, the call to
            // ListTopicsAsync will return a value to pass to the
            // method to retrieve the next 100 (or less) topics.
            string nextToken = string.Empty;
            List<SnsTopic> snsTopics;
            do
            {
                var topicResult = await snsClient.ListTopicsAsync(nextToken);
                snsTopics = GetTopicsList(topicResult.Topics);
                nextToken = topicResult.NextToken;
            }
            while (!string.IsNullOrEmpty(nextToken));

            foreach (var template in result)
            {
                var topicArn = snsTopics.FirstOrDefault(t => t.topicArn == template.MessagingEvent);
                var request = new PublishRequest
                {
                    TopicArn = topicArn.topicArn,
                    Message = template.Template,
                };
                await snsClient.PublishAsync(request);
               
            }
            return true;
        }

        /// <summary>
        /// Displays the list of Amazon SNS Topic ARNs.
        /// </summary>
        /// <param name="topicList">The list of Topic ARNs.</param>
        private List<SnsTopic> GetTopicsList(List<Topic> topicList)
        {
            SnsTopic snsTopic;
            List<SnsTopic> snsTopics = new List<SnsTopic>();
            foreach (var topic in topicList)
            {
                snsTopic = new SnsTopic();
                snsTopic.topicArn = topic.TopicArn;
                snsTopics.Add(snsTopic);
            }
            return snsTopics;
        }

        /// <summary>
        /// Archive notification
        /// </summary>
        /// <param name="notificationId">Notification id to be archived</param>
        /// <param name="isAllSelected">This field indicates that,we selecte all record or not</param>
        /// <param name="IsArchiving">This field indicates that notification is being archived or removed from archive</param>
        /// <returns>integer value</returns>
        public async Task<int> ArchiveNotification(int notificationId, int isAllSelected, int isArchiving)
        {
            var eMail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            var result = await _snsNotification.ArchiveNotification(notificationId, isAllSelected, isArchiving, eMail);
            return result;
        }

        /// <summary>
        /// Update notification Status and get data by id
        /// </summary>
        /// <param name="notificationId">Notification id to be updated</param>
        /// <returns></returns>
        public async Task<NotificationResult> GetNotificationByIdAndUpdate(int notificationId)
        {
            var eMail = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.Name).Value;
            var result = await _snsNotification.GetNotificationByIdAndUpdate(notificationId, eMail);
            return result;
        }

    }
}
