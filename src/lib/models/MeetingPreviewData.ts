import type { Meeting } from '.';

export type MeetingPreviewData = Pick<Meeting, 'name' | 'slug' | 'color'>;
