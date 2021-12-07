USE [omcusttaxqa]
GO
SET IDENTITY_INSERT [dbo].[M_CITY] OFF
GO
INSERT [dbo].[M_CITY] (  [city_code], [city_name], [province_id], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'021', N'Cape Town', 1, 1, N'OMCORE\Xy37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL)
GO
INSERT [dbo].[M_CITY] (  [city_code], [city_name], [province_id], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'031', N'Durban', 1, 1, N'OMCORE\Xy37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL)
GO
INSERT [dbo].[M_CITY] (  [city_code], [city_name], [province_id], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'011', N'Johannesburg', 1, 1, N'OMCORE\xy37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL)
GO

SET IDENTITY_INSERT [dbo].[M_COUNTRY] OFF
GO
INSERT [dbo].[M_COUNTRY] ( [country_name], [country_code], [country_isd_code], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date], [country_iso_code_2], [country_iso_code_3]) VALUES (N'India', N'+91', 91, 1, N'OMCOREXY37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL, NULL, NULL)
GO
INSERT [dbo].[M_COUNTRY] (  [country_name], [country_code], [country_isd_code], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date], [country_iso_code_2], [country_iso_code_3]) VALUES ( N'UK', N'+44', 44, 1, N'OMCOREXY37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL, NULL, NULL)
GO
INSERT [dbo].[M_COUNTRY] (  [country_name], [country_code], [country_isd_code], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date], [country_iso_code_2], [country_iso_code_3]) VALUES ( N'ZA', N'+27', 27, 1, N'OMCORE\XY37876', N'OMCORE\XY37876', CAST(N'2021-07-14T09:24:33.827' AS DateTime), NULL, NULL, NULL)
GO
INSERT [dbo].[M_COUNTRY] (  [country_name], [country_code], [country_isd_code], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date], [country_iso_code_2], [country_iso_code_3]) VALUES ( N'South Africa', N'+28', 28, 1, N'OMCORE\XY37876', N'OMCORE\XY37876', CAST(N'2021-09-13T00:00:00.000' AS DateTime), NULL, NULL, N'ZAF')
GO
INSERT [dbo].[M_COUNTRY] (  [country_name], [country_code], [country_isd_code], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date], [country_iso_code_2], [country_iso_code_3]) VALUES ( N'USA', N'+29', 29, 1, N'OMCORE\XY37876', N'OMCORE\XY37876', CAST(N'2021-09-13T00:00:00.000' AS DateTime), NULL, NULL, NULL)
GO
INSERT [dbo].[M_COUNTRY] (  [country_name], [country_code], [country_isd_code], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date], [country_iso_code_2], [country_iso_code_3]) VALUES ( N'UAE', N'+30', 30, 1, N'OMCORE\XY37876', N'OMCORE\XY37876', CAST(N'2021-09-13T00:00:00.000' AS DateTime), NULL, NULL, NULL)
GO
INSERT [dbo].[M_COUNTRY] (  [country_name], [country_code], [country_isd_code], [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date], [country_iso_code_2], [country_iso_code_3]) VALUES ( N'Australia', N'+31', 30, 1, N'OMCORE\XY37876', N'OMCORE\XY37876', CAST(N'2021-09-03T00:00:00.000' AS DateTime), NULL, NULL, NULL)
GO

SET IDENTITY_INSERT [dbo].[M_PROVINCE] OFF
GO
INSERT [dbo].[M_PROVINCE] ( [province_name], [province_code],   [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'Western Cape', N'123', 3, 1, N'OMCORE\xy37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL)
GO
INSERT [dbo].[M_PROVINCE] ( [province_name], [province_code],   [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'Gauteng', N'546', 3, 1, N'OMCORE\xy37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL)
GO
SET IDENTITY_INSERT [dbo].[M_SUBURB] OFF
GO
INSERT [dbo].[M_SUBURB] (  [suburb_code], [suburb_name],   [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'8005', N'Bakoven', 2, 1, N'MCORE\xy37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL)
GO
INSERT [dbo].[M_SUBURB] (  [suburb_code], [suburb_name],   [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'8006', N'Bantry Bay', 2, 1, N'MCORE\xy37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL)
GO
INSERT [dbo].[M_SUBURB] (  [suburb_code], [suburb_name],   [status_flag], [created_by], [last_updated_by], [created_date], [last_updated_date]) VALUES ( N'7806', N'Hout Bay', 2, 1, N'MCORE\xy37365', NULL, CAST(N'2021-06-26T10:09:27.203' AS DateTime), NULL)
GO