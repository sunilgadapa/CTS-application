USE [omcusttaxqa]
GO
SET IDENTITY_INSERT [dbo].[M_LOOKUP_TYPE] OFF
GO
INSERT [dbo].[M_LOOKUP_TYPE] ([lookup_type], [lookup_type_description], [submission_domain_flag], [tax_type_id], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date], [lookup_value_alias], [master_data_name], [validation_flag]) 
VALUES ( N'Contact_type', N'its an individual', 1, NULL, 1, N'Vishal Benade', N'Vishal Benade', CAST(N'2021-08-27T06:51:11.517' AS DateTime), CAST(N'2021-08-27T06:51:11.517' AS DateTime), N'Advisor', NULL, NULL, NULL)
GO
INSERT [dbo].[M_LOOKUP_TYPE] ([lookup_type], [lookup_type_description], [submission_domain_flag], [tax_type_id], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date], [lookup_value_alias], [master_data_name], [validation_flag]) 
VALUES ( N'TaxPeriodType', N'TaxPeriodType', NULL, NULL, 1, N'Vishal Benade', N'Vishal Benade', CAST(N'2021-10-08T09:58:33.200' AS DateTime), CAST(N'2021-10-08T09:58:33.200' AS DateTime), NULL, NULL, NULL)
GO
