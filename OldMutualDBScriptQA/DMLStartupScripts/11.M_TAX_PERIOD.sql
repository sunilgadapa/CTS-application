USE [omcusttaxqa]
GO
SET IDENTITY_INSERT [dbo].[M_TAX_PERIOD] OFF
GO
INSERT [dbo].[M_TAX_PERIOD] ( [tax_period_description], [tax_type_id], [tax_year], [tax_period_type_id], [submission_start_date], [submission_end_date], [landing_start_date], [lading_end_date], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'2020 - SARS ANNUAL SUBMISSION', 243, 241, 472, CAST(N'2019-03-01T00:00:00.000' AS DateTime), CAST(N'2020-02-28T00:00:00.000' AS DateTime), CAST(N'2020-03-01T00:00:00.000' AS DateTime), CAST(N'2020-05-31T00:00:00.000' AS DateTime), 1, N'OMCORE\XY48562', N'OMCORE\XY48562', CAST(N'2021-10-08T10:58:29.947' AS DateTime), CAST(N'2021-10-08T10:58:29.947' AS DateTime))
GO
INSERT [dbo].[M_TAX_PERIOD] ( [tax_period_description], [tax_type_id], [tax_year], [tax_period_type_id], [submission_start_date], [submission_end_date], [landing_start_date], [lading_end_date], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'2020 - SARS BI-ANNUAL SUBMISSION ', 243, 241, 473, CAST(N'2019-03-01T00:00:00.000' AS DateTime), CAST(N'2019-08-31T00:00:00.000' AS DateTime), CAST(N'2019-09-01T00:00:00.000' AS DateTime), CAST(N'2019-10-31T00:00:00.000' AS DateTime), 1, N'OMCORE\XY48562', N'OMCORE\XY48562', CAST(N'2021-10-08T10:58:29.947' AS DateTime), CAST(N'2021-10-08T10:58:29.947' AS DateTime))
GO