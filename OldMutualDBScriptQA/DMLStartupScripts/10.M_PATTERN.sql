USE [omcusttaxqa]
GO
SET IDENTITY_INSERT [dbo].[M_PATERN] OFF
GO
INSERT [dbo].[M_PATERN] (  [pattern], [pattern_desc], [pattern_type], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( N'^[ A-Za-z0-9_@./#&+-]*$', N'This pattern will be used to validate the domain reference as a text property', N'Text with number', 1, N'OMCORE\\XY37876', CAST(N'2021-08-11T13:54:04.053' AS DateTime), N'OMCORE\\XY37876', CAST(N'2021-08-11T13:54:04.053' AS DateTime))
GO
INSERT [dbo].[M_PATERN] (  [pattern], [pattern_desc], [pattern_type], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( N'^[0-9]*$', N'This pattern will be used to validate the domain reference as a number property', N'Number', 1, N'OMCORE\\XY37876', CAST(N'2021-08-11T14:32:01.397' AS DateTime), N'OMCORE\\XY37876', CAST(N'2021-08-11T14:32:01.397' AS DateTime))
GO
INSERT [dbo].[M_PATERN] (  [pattern], [pattern_desc], [pattern_type], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( N'^[ A-Za-z_@./#&+-]*$', NULL, N'Plain text with special character', 1, N'OMCORE\XY37876', CAST(N'2021-09-27T00:00:00.000' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-09-27T00:00:00.000' AS DateTime))
GO
INSERT [dbo].[M_PATERN] (  [pattern], [pattern_desc], [pattern_type], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( N'^[a-zA-Z ]*$', NULL, N'Plain text', 1, N'OMCORE\XY37876', CAST(N'2021-09-27T00:00:00.000' AS DateTime), N'OMCORE\XY37876', CAST(N'2021-09-27T00:00:00.000' AS DateTime))
GO
INSERT [dbo].[M_PATERN] (  [pattern], [pattern_desc], [pattern_type], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date]) VALUES ( N'^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$', NULL, N'Email', 1, N'OMCORE\\XY38176', CAST(N'2021-09-27T00:00:00.000' AS DateTime), N'OMCORE\\XY38176', CAST(N'2021-09-27T00:00:00.000' AS DateTime))
GO
