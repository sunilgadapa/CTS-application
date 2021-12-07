USE [omcusttaxqa]
GO
SET IDENTITY_INSERT [dbo].[M_STATUS] OFF
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1001, N'Ready to process', N'Manual file uploaded sucessfully to manual pickup directory. Read to move to pick up directory', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T08:37:19.353' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1002, N'Ready for promotion', N'All data valid. Ready for promotion', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T08:49:33.300' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1003, N'Rejected', N'File Rejected (Trailer totals, format issues)', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1004, N'In Progress', N'Busy Loading / validating', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1005, N'System Failure', N'Any service not avalible druing the data load process', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1006, N'Partial Upload', N'Some data failed validation or lookup values not found', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1007, N'File Loading', N'File has been moved from Manual to pick up directory', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1008, N'ETL process Initiated', N'The file is picked up by the ETL process', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1010, N'Technical Error', N'System error. Data not processed', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1011, N'Delete in progress', N'File delete in progress. Data to be deleted', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1012, N'Loaded – No Errors', N'Non PAS files – Record has no validation errors', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1013, N'Loaded – With Errors', N'Non PAS files – Record contains validation error(s)', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1014, N'Ready for Signoff', N'The PAS file loaded sucesfully without any validation errors', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1015, N'Signed off', N'The PAS file was signed off without any validation errors', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1016, N'Signed off – Errors excluded', N'The PAS file was signed off Excluding validation errors', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1017, N'Has Corrections', N'Look up vlaue was added to the PAS file data and The file is ready for reporcess', 1, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1101, N'Landing - Successful', N'Record landed succesfully', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1102, N'ValidatedWithoutErrors', N'Record has no validation errors', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1103, N'ValidatedWithErrors', N'Record contains validation error(s)', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1104, N'Ready To Submit To SARS', N'Record ready to be submitted to SARS', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1105, N'Packaged Live', N'Record packaged for submission to SARS', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1106, N'Deleted', N'Record has been deleted', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1107, N'Superceded', N'Record has been replace by a newer record', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1108, N'Record – Corrected from UI', N'Record corrected and Inserted from UI', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1109, N'Ready For Promotion', N'Record in the file was successfully validated and the file was signed off', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1110, N'IT3F Member - Finance - Advisor -  Record  Missing', N'This indicates that the Record was found incompleted for promotion. Member data dosent have associated finance data', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1111, N'Queued For GCS Request', N'GCS request to be created to fetch client demographic data', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1112, N'Await GCS response', N'GCS requested was created and dropped in the GCS folder', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1113, N'Promoted with Errors', N'The promotion level validation failed', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1114, N'Ready For Logical File Creation', N'This status indicates that the Promotion was successfully completed and the process can proceed to creation of test or live SARS submission files', 6, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1201, N'Submitted / File Submitted To SARS', N'Submitted To SARS', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1202, N'Acknowledged / Acknowledged By SARS', N'Acknowledged By SARS', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1203, N'Accepted / File Accepted By SARS', N'Accepted By SARS', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1204, N'Error', N'Error Response From SARS', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1205, N'Accepted with Warnings', N'Accepted With Warnings From SARS', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1206, N'Rejected - Critical Errors', N'entire file rejected as contains critical errors. The file must be corrected and resubmitted to enable processing', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1207, N'Rejected - File Structure Errors', N'entire file rejected as it contains file structure errors. The file must be corrected and resubmitted to enable processing', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1208, N'Rejected - Group File Validation Error', N'entire file rejected as the file was submitted as part of a group and one or more of the files in the group failed the validations associated with the submission of a file as part of a group', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1209, N'Rejected - Group File Validation Error', N'Group submission incomplete and service level agreement expired for SARS to wait for all files in a group to be submitted', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1210, N'Partial Upload', N'This can be any combination of accepted fields, rejected fields, fields accepted with a warning or duplicate records', 7, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1301, N'Submitted / Submitted To SARS', N'Submitted To SARS', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1302, N'Acknowledged / Acknowledged By SARS', N'Acknowledged By SARS', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1303, N'Accepted / Accepted By SARS', N'Accepted By SARS', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1304, N'Rejected', N'Error Response From SARS', 9, 1, N'OMCORE\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1305, N'Accepted with Warnings', N'Accepted With Warnings From SARS', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1306, N'Mandatory field left blank', N'Mandatory field does not contain a value', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1307, N'Incorrect field length', N'Field length does not comply with the specification', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1308, N'Incorrect field format', N'Field format does not comply with the specification', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1309, N'Invalid field value', N'Field can only have a defined set of values. The value supplied in the field does not appear in the defined set of values', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( 1310, N'Invalid Logic', N'Field value does not meet a logic rule i.e. A + B must be equal to this field or Field does not pass Mod 10 test', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (1311, N'SARS System Rejection', N'Field failed because it does not meet a data or business rule requirement within a SARS system i.e. Tax Reference number does not exist', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (1312, N'Duplicate Record', N'Duplicate Record already existing', 9, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (1401, N'Has Corrections', N'Some data corrections made. File ready to reprocess', 10, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (1402, N'Blocked - File Duplicated', N'Duplicate file name - No data processed', 10, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
INSERT [dbo].[M_STATUS] (  [status_code], [display_status], [status_description], [status_group_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (1403, N'Data Suppressed', N'All records within the file contain zero financial values. No record eligible for processing', 10, 1, N'omcore\XY37770', CAST(N'2021-10-07T09:09:08.773' AS DateTime), NULL, NULL)
GO
