export interface Course {
    id: number;
    fullname: string;
    summary: string;
    courseimage?: string;
    startdate?: number;
    enddate?: number;
    category?: number;
}