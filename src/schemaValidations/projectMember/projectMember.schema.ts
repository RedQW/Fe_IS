import z from "zod";

// Define the individual account schema
export const ProjectMemberSchema = z.object({
  id: z.string(),
  "user-name": z.string(),
  "student-code": z.string(),
  avatar: z.string(),
  "ojt-semester-university": z.string(),
  "technical_skills": z.string(),
});

// Define the filter schema for Mem not in project
export const MemberNotInProFilterSchema = z.object({
  "user-name": z.string().optional(),
  "student-code": z.string().optional(),
  role: z.string().optional(),
  semester: z.string().optional(),
  university: z.string().optional(),
});

// Define the pagination schema for Mem not in project
export const MemberNotInProPageSchema = z.object({
  page: z.number(),
  psize: z.number(),
  items: z.number(),
  pages: z.number(),
});

// Define the full response schema for Mem not in project
export const MemberNotInProListRes = z.object({
  paging: MemberNotInProPageSchema,
  filter: MemberNotInProFilterSchema,
  data: z.array(ProjectMemberSchema),
  status: z.number(),
});

// Define the full response schema for Mem in project
export const ProjectMemberListRes = z.object({
  data: z.array(ProjectMemberSchema),
  status: z.number(),
});

export const ProjectMemberRes = z.object({
  status: z.number(),
  message: z.string(),
});

export const AddMember = z.object({
  email: z.string(),
  password: z.string(),
  role: z.string(),
  "user-name": z.string()
});

export type ProjectMemberListResType = z.TypeOf<typeof ProjectMemberListRes>;
export type ProjectMemberResType = z.TypeOf<typeof ProjectMemberRes>;
export type ProjectMemberType = z.TypeOf<typeof ProjectMemberSchema>;

// Mem not in project
export type MemberNotInProFilterType = z.TypeOf<typeof MemberNotInProFilterSchema>;
export type MemberNotInProListResType = z.TypeOf<typeof MemberNotInProListRes>;