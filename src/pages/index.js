import Home from "./home";

import SignInPageV4 from "./v4.sign-in";

import ChatPageV1 from "./v1.chat";
import MapListPage from "./maps";

import SheetListPage from "./sheets";
/* ปิด Feature การลงข้อสอบของ Admin ส่วนของพี่บ๊วย เพราะใช้ยากมาก รอพี่บ๊วยแก้
import ManageQuizzesPage from "./quiz/index";
import ManageLessonByIdPage from "./quiz/quiz-lesson";
import ManageDetailByIdPage from "./quiz/quiz-detail";
import ManageQuestionByIdPage from "./quiz/quiz-question";
import ManageChoiceByIdPage from "./quiz/quiz-choice";
*/
import RewardListPage from "./rewards";
import ApproveRewardListPage from "./approve-rewards";

import MissionListPage from "./missions";
import MissionCreate from "./missionCreate";
import MissionEdit from "./missionEdit";
import MissionDetail from "./missionDetail";

import ManageCSV from "./manage-csv";
/* ปิด Feature การลงข้อสอบของ Admin ส่วนของพี่บ๊วย เพราะใช้ยากมาก รอพี่บ๊วยแก้
import Dashboard from "./dashboard/index";
*/
import StudentPageTSV1 from "./student.ts.v1";
import StudentListPageTSV1 from "./students.ts.v1";

import GroupPageTSV1 from "./group.ts.v1";
import GroupListPageTSV1 from "./groups.ts.v1";

import InfoPageV2 from "./v2.info";

import HowToPage from "./howto";
import DownloadPage from "./download";

import {
  PageTeacherDetail,
  PageTeacherOverview,
  PageSchoolOverview,
  PageTeacher,
} from "./v1.statistics";

import {
  PageMSchools,
  PageMSchoolDetail,
  PageMSchoolCreate,
  PageMSchoolEdit,
  PageMSchoolDetailStudents,
  PageMSchoolDetailGroups,
} from "./v1.school";

import { PageAffiliate, PageAffiliateCreate } from "./v1.affiliate";
import { PageUser, PageUserEdit } from "./v1.user";

import { PageCountryOverview } from "./v1.sectorExecutive";

import { PageAffiliationOverview } from "./v1.affiliationOverview";

import { PageEsaOverview } from "./v1.esaOverview";

import { PageProvinceOverview, PageSchool } from "./v1.provinceOverview";

import { PageTeacherProfile } from "./v1.teacherOverview";

import { PageEditTeacherProfile } from "./v1.teacherOverview";

import { PageStudentOverview } from "./v1.teacherOverview";

import { PageHomeworkOverview } from "./v1.teacherOverview";

import { PageAcademicAffairsOverview } from "./v1.academicAffairsOverview";

import { PageMaps, PageQuizzes, PageVersion, PageStudentPin, PageUploadQuizImage } from "./v1.admin";

import { PageMinistryOverview } from "./v1.ministryOverview";

import { PageESAProgressOverview } from "./v1.esaProgressOverview";
import { PageESAProgressOverviewAdminReport } from "./v1.esaProgressOverviewAdminReport";
import { PageESAProgressOverviewMockup } from "./v1.esaProgressOverviewMockup";

import { PageNote} from "./v1.note";

const pages = {
  Home: Home,

  SignInPageV4: SignInPageV4,

  ChatPageV1: ChatPageV1,
  MapListPage: MapListPage,

  SheetListPage: SheetListPage,
  RewardListPage: RewardListPage,
  ApproveRewardListPage: ApproveRewardListPage,

  MissionListPage: MissionListPage,
  MissionCreate: MissionCreate,
  MissionEdit: MissionEdit,
  MissionDetail: MissionDetail,

  ManageCSV: ManageCSV,

  StudentPageTSV1: StudentPageTSV1,
  StudentListPageTSV1: StudentListPageTSV1,

  GroupPageTSV1: GroupPageTSV1,
  GroupListPageTSV1: GroupListPageTSV1,

  InfoPageV2: InfoPageV2,

  HowToPage: HowToPage,
  DownloadPage: DownloadPage,

  PageTeacherDetail: PageTeacherDetail,
  PageTeacherOverview: PageTeacherOverview,
  PageProvinceOverview: PageProvinceOverview,
  PageSchool: PageSchool,
  PageSchoolOverview: PageSchoolOverview,
  PageTeacher: PageTeacher,

  PageMSchools: PageMSchools,
  PageMSchoolDetail: PageMSchoolDetail,
  PageMSchoolCreate: PageMSchoolCreate,
  PageMSchoolEdit: PageMSchoolEdit,
  PageMSchoolDetailStudents: PageMSchoolDetailStudents,
  PageMSchoolDetailGroups: PageMSchoolDetailGroups,

  PageAffiliate: PageAffiliate,
  PageAffiliateCreate: PageAffiliateCreate,

  PageUser: PageUser,
  PageUserEdit: PageUserEdit,

  //ผู้บริหารภาคส่วน
  PageCountryOverview: PageCountryOverview,

  //เจ้าของเครือโรงเรียน
  PageAffiliationOverview: PageAffiliationOverview,

  //ระดับเขตพื้นที่การศึกษา
  PageEsaOverview: PageEsaOverview,

  //ภาพรวมครู (position ครู)
  PageTeacherProfile: PageTeacherProfile,

  //เพิ่มข้อมูลครู
  PageEditTeacherProfile: PageEditTeacherProfile,

  //ภาพรวมนักเรียน
  PageStudentOverview: PageStudentOverview,

  //ภาพรวมการบ้าน
  PageHomeworkOverview: PageHomeworkOverview,

  //ภาพรวมโรงเรียน (position หัวหน้าฝ่ายวิชาการ)
  PageAcademicAffairsOverview: PageAcademicAffairsOverview,

  //จัดการบทเรียน
  PageMaps: PageMaps,
  //จัดการเวอร์ชั่น
  PageVersion: PageVersion,
  //จัดการข้อสอบ
  PageQuizzes: PageQuizzes,
  // อัพโหลดรูปข้อสอบ
  PageUploadQuizImage: PageUploadQuizImage,
  //ค้นหาPINนักเรียน
  PageStudentPin: PageStudentPin,

  //กระทรวง
  PageMinistryOverview: PageMinistryOverview,

  //ความก้าวหน้าเขตพื้นที่
  PageESAProgressOverview: PageESAProgressOverview,
  PageESAProgressOverviewAdminReport: PageESAProgressOverviewAdminReport,
  PageESAProgressOverviewMockup: PageESAProgressOverviewMockup,

  //โน้ตนักเรียนสำหรับครู
  PageNote: PageNote,
};

export const getPages = (page) => {
  return pages[page];
};
