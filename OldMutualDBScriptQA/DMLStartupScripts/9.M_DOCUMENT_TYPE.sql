USE [omcusttaxqa]
GO
SET IDENTITY_INSERT [dbo].[M_DOCUMENT_TYPE] ON 
GO
INSERT [dbo].[M_DOCUMENT_TYPE] ([document_type_id], [document_type], [document_description], [document_type_extension], [document_frequency], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (1, N'Client Third Party CSV Manual File Load', N'Client Third Party CSV Manual File Load', N'.CSV', N'1', 1, N'OMCORE\XY37365', CAST(N'2021-06-29T12:42:17.693' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-06-29T12:42:17.693' AS DateTime))
GO
INSERT [dbo].[M_DOCUMENT_TYPE] ([document_type_id], [document_type], [document_description], [document_type_extension], [document_frequency], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (2, N'MDM Advisor Data Load', N'MDM Advisor Data Load', N'Advisor Datan Load', N'1', 1, N'OMCORE\XY37365', CAST(N'2021-06-29T12:42:17.693' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-06-29T12:42:17.693' AS DateTime))
GO
INSERT [dbo].[M_DOCUMENT_TYPE] ([document_type_id], [document_type], [document_description], [document_type_extension], [document_frequency], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (3, N'GCS Manual Data Load', N'GCS Manual Data Load', N'GCS Manual DATA Upload', N'1', 1, N'OMCORE\XY37365', CAST(N'2021-06-29T12:42:17.693' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-06-29T12:42:17.693' AS DateTime))
GO
INSERT [dbo].[M_DOCUMENT_TYPE] ([document_type_id], [document_type], [document_description], [document_type_extension], [document_frequency], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (4, N'Preffered Correspondence Manual Data Load', N'Preffered Correspondence Manual Data Load', N'Preffered Correspondence Manual Data Load', N'1', 1, N'OMCORE\XY37365', CAST(N'2021-06-29T12:42:17.693' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-06-29T12:42:17.693' AS DateTime))
GO
INSERT [dbo].[M_DOCUMENT_TYPE] ([document_type_id], [document_type], [document_description], [document_type_extension], [document_frequency], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (6, N'Sample Certificate', N'Sample Certificate', N'Sample Certificate', N'1', 1, N'OMCORE\XY37365', CAST(N'2021-06-29T12:42:17.693' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-06-29T12:42:17.693' AS DateTime))
GO
INSERT [dbo].[M_DOCUMENT_TYPE] ([document_type_id], [document_type], [document_description], [document_type_extension], [document_frequency], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (9, N'ITC Member File', N'Member File', N'Member File', N'1', 1, N'OMCORE\XY37876', CAST(N'2021-09-09T00:00:00.000' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-09-09T00:00:00.000' AS DateTime))
GO
INSERT [dbo].[M_DOCUMENT_TYPE] ([document_type_id], [document_type], [document_description], [document_type_extension], [document_frequency], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (10, N'ITC Finance File', N'Finance File', N'Finance File', N'1', 1, N'OMCORE\XY37876', CAST(N'2021-09-09T00:00:00.000' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-09-09T00:00:00.000' AS DateTime))
GO
INSERT [dbo].[M_DOCUMENT_TYPE] ([document_type_id], [document_type], [document_description], [document_type_extension], [document_frequency], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES (11, N'ITC Advisor File', N'ITC Advisor File', N'ITC Advisor File', N'1', 1, N'OMCORE\XY37876', CAST(N'2021-09-09T00:00:00.000' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-09-09T00:00:00.000' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[M_DOCUMENT_TYPE] OFF
GO
