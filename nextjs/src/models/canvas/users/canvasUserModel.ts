import { EnrollmentModel } from "../enrollments/enrollmentModel";

export interface UserModel {
  id: number;
  name: string;
  sortable_name: string;
  short_name: string;
  sis_user_id: string;
  integration_id: string;
  login_id: string;
  avatar_url: string;
  enrollments: EnrollmentModel[];
  email: string;
  locale: string;
  effective_locale: string;
  time_zone: string;
  bio: string;
  permissions: { [key: string]: boolean };
  sis_import_id?: number;
  last_login?: string; // ISO 8601 date string
}
