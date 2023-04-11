export type jobDataType = {
  emails: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: attachmentType[];
  retry?: number;
};

export type attachmentType = {
  path: string;
};
