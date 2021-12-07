USE [omcusttaxqa]
GO
SET IDENTITY_INSERT [dbo].[B_USER_ROLE] OFF
GO
INSERT [dbo].[B_USER_ROLE] ([user_id], [role_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date], [tax_module_id], [expiry_date]) VALUES 
( (select user_id from M_USER where user_name='OMCORE\XY37876'), 14, 1, N'Vishal Benade', CAST(N'2021-07-30T04:05:36.320' AS DateTime), N'Vishal Benade', CAST(N'2021-07-30T04:05:36.320' AS DateTime), null, CAST(N'2021-12-28T00:00:00.000' AS DateTime))
GO
INSERT [dbo].[B_USER_ROLE] ([user_id], [role_id], [status_flag], [created_by], [created_date], [last_updated_by], [last_updated_date], [tax_module_id], [expiry_date]) VALUES 
(select user_id from M_USER where user_name='OMCORE\XY37754', 14, 1, N'Vishal Benade', CAST(N'2021-07-30T04:05:36.320' AS DateTime), N'Vishal Benade', CAST(N'2021-07-30T04:05:36.320' AS DateTime), null, CAST(N'2021-12-28T00:00:00.000' AS DateTime))
GO