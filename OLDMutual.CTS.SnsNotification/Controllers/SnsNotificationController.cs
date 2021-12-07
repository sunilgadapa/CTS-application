using Amazon.Runtime.CredentialManagement;
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;

using OLDMutual.CTS.SnsNotification.Domain.Models;
using OLDMutual.CTS.SnsNotification.Service.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;


namespace OLDMutual.CTS.SnsNotification.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class SnsNotificationController : Controller
    {
        private readonly IConfiguration _config;
        private readonly ISnsNotificationService _snsNotificationService;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        private readonly JsonResult js = new JsonResult();

        public SnsNotificationController(IConfiguration configuration, ISnsNotificationService snsNotificationService, IHubContext<BroadcastHub, IHubClient> hubContext)
        {
            _config = configuration;
            _snsNotificationService = snsNotificationService;
            _hubContext = hubContext;
        }


        // GET: api/SNSTopics/5
        [Route("SubscribeTopic")]
        [HttpPost]
        [Authorize]
        //  public async Task<ActionResult<SNSTopic>> GetSNSTopic(long id)
        public async Task<IActionResult> SubscribeSNSTopic1(string emailId, [FromQuery] string[] emailList, string topicARN)
        {
            try
            {                
                List<string> SubscribeStatusMessages = new List<string>();
                var sharedFile = new SharedCredentialsFile();
                sharedFile.TryGetProfile("default", out var profile);
                AWSCredentialsFactory.TryGetAWSCredentials(profile, sharedFile, out var credentials);
                var snsClient = new AmazonSimpleNotificationSer‌​viceClient(credentials, region: Amazon.RegionEndpoint.EUWest1);
                var requestList = new ListSubscriptionsByTopicRequest(topicARN);
                var responseList = await snsClient.ListSubscriptionsByTopicAsync(requestList);

                if (!emailList.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Email list is empty";
                    js.data = null;
                    return NotFound(js);
                }

                foreach (string useremailId in emailList)
                {
                    do
                    {
                        foreach (var sub in responseList.Subscriptions)
                        {
                            if (sub.Endpoint.ToLower().Equals(useremailId.ToLower()))
                            {
                                SubscribeStatusMessages.Add("User " + useremailId + " is already subscribed to " + topicARN);
                            }
                            else
                            {
                                SubscribeRequest subscribeRequest2 = new SubscribeRequest(topicARN, "email", useremailId);
                                SubscribeResponse subscribeResponse2 = await snsClient.SubscribeAsync(subscribeRequest2);
                                if (subscribeResponse2.HttpStatusCode == HttpStatusCode.OK)
                                {
                                    SubscribeStatusMessages.Add("User " + useremailId + " is subscribed to " + topicARN + " successfully!");
                                }
                                else
                                {
                                    SubscribeStatusMessages.Add("User " + useremailId + " is not able subscribed to " + topicARN);
                                }
                            }
                        }



                    } while (!string.IsNullOrEmpty(responseList.NextToken));

                }
                js.Statuscode = (int)HttpStatusCode.OK;
                js.Message = SubscribeStatusMessages.ToString();
                js.data = null;
                return Ok(js);
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }
        }




        [Route("UnSubscribeTopic")]
        [HttpPost]
        [Authorize]
        //  public async Task<ActionResult<SNSTopic>> GetSNSTopic(long id)
        public async Task<IActionResult> UnSubscribeSNSTopic1([FromQuery] string[] emailList, string topicARN)
        {
            try
            {                
                List<string> unSubscribeStatus = new List<string>();

                var sharedFile = new SharedCredentialsFile();
                sharedFile.TryGetProfile("default", out var profile);
                AWSCredentialsFactory.TryGetAWSCredentials(profile, sharedFile, out var credentials);
                var snsClient = new AmazonSimpleNotificationSer‌​viceClient(credentials, region: Amazon.RegionEndpoint.EUWest1);
                var requestList = new ListSubscriptionsByTopicRequest(topicARN);
                var responseList = await snsClient.ListSubscriptionsByTopicAsync(requestList);
                if (!emailList.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Email list is empty";
                    js.data = null;
                    return NotFound(js);
                }

                foreach (string useremailId in emailList)
                {
                    do
                    {
                        foreach (var sub in responseList.Subscriptions)
                        {

                            if (sub.Endpoint.ToLower().Equals(useremailId.ToLower()))
                            {
                                var unsubrequest = new UnsubscribeRequest(sub.SubscriptionArn);
                                if ((unsubrequest.SubscriptionArn == "Pending Confirmation") || (unsubrequest.SubscriptionArn == "Deleted"))
                                {
                                    unSubscribeStatus.Add("The current status of subscription for " + useremailId + " is :" + unsubrequest.SubscriptionArn);
                                }
                                else
                                {
                                    UnsubscribeResponse subscribeResponse3 = await snsClient.UnsubscribeAsync(unsubrequest);
                                    if (subscribeResponse3.HttpStatusCode == HttpStatusCode.OK)
                                    {
                                        unSubscribeStatus.Add("The  " + useremailId + "has been UnSubscribed from Topic :" + unsubrequest.SubscriptionArn);
                                    }
                                    else
                                    {
                                        unSubscribeStatus.Add("The  " + useremailId + "has not been UnSubscribed from Topic :" + unsubrequest.SubscriptionArn);
                                    }
                                }

                            }
                        }

                    } while (!string.IsNullOrEmpty(responseList.NextToken));
                }
                js.Statuscode = (int)HttpStatusCode.OK;
                js.Message = unSubscribeStatus.ToString();
                js.data = null;
                return Ok(js);
            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }

        }

        [Route("PublishTopic")]
        [HttpPost]
        [Authorize]
        //  public async Task<ActionResult<SNSTopic>> GetSNSTopic(long id)
        public async Task<IActionResult> PublishSNSTopic1(string topicARN)
        {
            try
            {
                var emailTemplate = _config.GetSection("SNSSettings").GetSection("Message1").Value;

                var sharedFile = new SharedCredentialsFile();
                sharedFile.TryGetProfile("default", out var profile);
                AWSCredentialsFactory.TryGetAWSCredentials(profile, sharedFile, out var credentials);
                var snsClient = new AmazonSimpleNotificationSer‌​viceClient(credentials, region: Amazon.RegionEndpoint.EUWest1);
                PublishRequest publishRequest = new PublishRequest(topicARN, emailTemplate, "Message from Topic1");
                PublishResponse publishResponse = await snsClient.PublishAsync(publishRequest);

                js.Statuscode = (int)HttpStatusCode.OK;
                js.Message = "Message successfully published to Topic " + topicARN;
                js.data = publishResponse;
                return Ok(js);

            }
            catch (Exception ex)
            {
                js.Statuscode = (int)HttpStatusCode.InternalServerError;
                js.data = null;
                js.Message = ex.Message.ToString();
                return BadRequest(js);
            }

        }

        /// <summary>
        /// Publish event for dahsboard
        /// </summary>
        /// <returns></returns>

        [Route("publishEventForDashboard")]
        [HttpPost]
        public async Task<ActionResult> PublishEventForDashboard()
        {
            await _hubContext.Clients.All.BroadcastMessage();
            js.Statuscode = (int)HttpStatusCode.OK;
            js.Message = "Notification successfully published Dashboard";
            js.data = "Ok";
            return Ok(js);
        }
        /// <summary>
        /// Publish event for Email
        /// </summary>
        /// <returns></returns>
        [Route("publishEventForEmail")]
        [HttpPost]
        public async Task<ActionResult> PublishEventForEmail()
        {

            var result = await _snsNotificationService.PublishToTopicForEmailAsync();
            if (result)
            {
                js.Statuscode = (int)HttpStatusCode.OK;
                js.Message = "Notification successfully published Dashboard";
                js.data = result;
                return Ok(js);
            }
            else
            {
                js.Statuscode = (int)HttpStatusCode.NotFound;
                js.Message = "Notification successfully published Dashboard";
                js.data = result;
                return NotFound(js);
            }
        }
        /// <summary>
        /// Get Notification Count
        /// </summary>
        /// <returns>Object</returns>
        [Route("notificationCount")]
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<NotificationCountResult>> GetNotificationCount()
        {
            try
            {

                var result = await _snsNotificationService.GetNotificationCount();
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = " data  found";
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

        /// <summary>
        /// Get the list of notification
        /// </summary>
        /// <param name="notificationParams">Parameters for get notification</param>
        /// <returns>Object list</returns>
        [Route("notificationResult")]
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<NotificationCountResult>> GetNotificationResult([FromQuery] NotificationParams notificationParams)
        {
            try
            {

                var result = await _snsNotificationService.GetNotificationResult(notificationParams);
                if (!result.Any())
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "data not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = " data  found";
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

        /// <summary>
        /// Archive notification
        /// </summary>
        /// <param name="notificationId">Notification id to be archived</param>
        /// <param name="isAllSelected">This field indicates that,we selecte all record or not</param>
        /// <param name="IsArchiving">This field indicates that notification is being archived or removed from archive</param>
        /// <returns>integer value</returns>
        [Route("archiveNotification")]
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> ArchiveNotification(int notificationId, int isAllSelected, int isArchiving)
        {
            try
            {
                var message = string.Empty;
                if(isArchiving==1)
                {
                    message = "Notification archived successfully.";
                }
                else
                {
                    message = "Notification has been removed from archived.";
                }
                var result = await _snsNotificationService.ArchiveNotification(notificationId, isAllSelected, isArchiving);
                if (result == 0)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = message;
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = message;
                    js.data = null;
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

        /// <summary>
        /// Update notification Status and get data by id
        /// </summary>
        /// <param name="notificationId">Notification id to be Updated</param>
        /// <returns>integer value</returns>
        [Route("getNotificationByIdAndUpdate")]
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetNotificationByIdAndUpdate(int notificationId)
        {
            try
            {
                var result = await _snsNotificationService.GetNotificationByIdAndUpdate(notificationId);
                if (result == null)
                {
                    js.Statuscode = (int)HttpStatusCode.NotFound;
                    js.Message = "Selected notification not found";
                    js.data = null;
                    return NotFound(js);
                }
                else
                {
                    js.Statuscode = (int)HttpStatusCode.OK;
                    js.Message = "Notification status updated successfully.";
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
    }
}
