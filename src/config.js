import * as Icons from "@material-ui/icons";

export default {
  mission: true,
  env: "prod", // "dev" or "prod"
  host: "", // localhost for API page_v2
  items_1: [
    // {
    //     icon: Icons.BusinessCenter,
    //     text: "ระดับชั้น/ห้องเรียน",
    //     path: "/info",
    //     routes: [{
    //         name: "InfoPageV2",
    //         path: "/info"
    //     }],
    //     roles: ["User"],
    //     positions: ["", "S-2", "S-4", "A-1"],
    // },
    //ปิดระดับชั้น/ห้องเรียนสำหรับคุณครู S-4,S-2,A-1 เพราะเปิดใช้รูปเฟืองแทนการเข้าแบบปกติ
    //เข้า /info ผ่าน src/components/Menu.v2.tsx ดัวยเงื่อนไขเพิ่มเติมดังนี้
    //if (_positions == 'S-4') { setShowSpace(true) }
    //ย้าย /info อยู่ด้านล่างใน กลุ่มเรียน เพื่อให้ครูเขามีสิทธิถึงได้
    {
      icon: Icons.People,
      text: "กลุ่มเรียน",
      path: "/groups",
      routes: [
        {
          name: "InfoPageV2",
          path: "/info",
        },
        {
          name: "GroupListPageTSV1",
          path: "/groups",
        },
        {
          name: "GroupPageTSV1",
          path: "/groups/:groupId/:tab?",
        },
      ],
      roles: ["User"],
      positions: ["", "S-2", "S-4", "A-1"],
    },
    {
      icon: Icons.Assignment,
      text: "นักเรียน",
      path: "/students",
      routes: [
        {
          name: "StudentListPageTSV1",
          path: "/students",
        },
        {
          name: "StudentPageTSV1",
          path: "/students/:studentId/:tab?",
        },
      ],
      roles: ["User"],
      positions: ["", "S-2", "S-4", "A-1"],
    },
    {
      icon: Icons.Assignment,
      text: "บทเรียน",
      path: "/maps",
      routes: [
        {
          name: "MapListPage",
          path: "/maps",
        },
      ],
      roles: ["User"],
      positions: ["", "S-2", "S-4", "A-1"],
    },
    {
      icon: Icons.Assignment,
      text: "ข้อสอบ/แบบฝึกหัด",
      path: "/sheets",
      routes: [
        {
          name: "SheetListPage",
          path: "/sheets",
        },
      ],
      roles: ["User"],
      positions: ["", "S-2", "S-4", "A-1"],
    },
    {
      icon: Icons.AssistantPhoto,
      text: "การบ้าน",
      path: "/missions",
      routes: [
        {
          name: "MissionListPage",
          path: "/missions",
        },
        {
          name: "MissionCreate",
          path: "/missions/create",
        },
        {
          name: "MissionEdit",
          path: "/missions/edit/:missionId",
        },
        {
          name: "MissionDetail",
          path: "/missions/detail/:missionId",
        },
      ],
      roles: ["User"],
      positions: ["", "S-2", "S-4", "A-1"],
    },
    {
      icon: Icons.Stars,
      text: "รางวัล",
      path: "/rewards",
      routes: [
        {
          name: "RewardListPage",
          path: "/rewards",
        },
      ],
      roles: ["User"],
      positions: ["", "S-2", "S-4", "A-1"],
    },
    {
      icon: Icons.CheckCircle,
      text: "อนุมัติรางวัล",
      path: "/approve-rewards",
      routes: [
        {
          name: "ApproveRewardListPage",
          path: "/approve-rewards",
        },
      ],
      roles: ["User"],
      positions: ["", "S-2", "S-4", "A-1"],
    },
    {
      icon: Icons.DashboardOutlined,
      text: "ภาพรวมจังหวัด",
      path: "/statistics/province/overview",
      routes: [
        {
          name: "PageProvinceOverview",
          path: "/statistics/province/overview",
        },
      ],
      roles: ["User"],
      positions: ["", "S-1", "P-1"],
      type: "Management",
    },
    {
      icon: Icons.DashboardOutlined,
      text: "ภาพรวมโรงเรียน",
      path: "/statistics/school/overview",
      routes: [
        {
          name: "PageSchoolOverview",
          path: "/statistics/school/overview",
        },
      ],
      roles: ["User"],
      positions: ["", "S-1", "S-2"],
      type: "Management",
    },
    {
      icon: Icons.School,
      text: "โรงเรียน",
      path: "/schools",
      routes: [
        {
          name: "PageMSchools",
          path: "/schools",
        },
        {
          name: "PageMSchoolDetail",
          path: "/schools/:id",
        },
        {
          name: "PageMSchoolDetailStudents",
          path: "/schools/:id/students",
        },
        {
          name: "PageMSchoolDetailGroups",
          path: "/schools/:id/groups",
        },
      ],
      roles: ["Developer", "Admin", "User", "Super Admin"],
      positions: ["", "S-1", "S-2", "A-1"],
      type: "Management",
    },
    {
      icon: Icons.GroupWork,
      text: "สังกัด",
      path: "/affiliates",
      routes: [
        {
          name: "PageAffiliate",
          path: "/affiliates",
        },
      ],
      roles: ["Developer", "Admin", "User", "Super Admin"],
      positions: ["", "A-1"],
      type: "Management",
    },
    {
      icon: Icons.Person,
      text: "จัดการผู้ใช้งาน",
      path: "/users",
      routes: [
        {
          name: "PageUser",
          path: "/users",
        },
        {
          name: "PageUserEdit",
          path: "/users/:id",
        },
      ],
      roles: ["Developer", "Admin", "Super Admin"],
      positions: ["A-1"],
      type: "Management",
    },
    {
      icon: Icons.Person,
      text: "โรงเรียนในจังหวัด",
      path: "/statistics/school/province",
      routes: [
        {
          name: "PageSchool",
          path: "/statistics/school/province",
        },
      ],
      roles: ["User"],
      positions: ["", "S-1", "P-1"],
      type: "Management",
    },
    {
      icon: Icons.DashboardOutlined,
      text: "ภาพรวมโรงเรียน",
      path: "/overview/school",
      routes: [
        {
          name: "PageAcademicAffairsOverview",
          path: "/overview/school",
        },
      ],
      roles: ["User"],
      positions: ["R-3", "S-3"],
      type: "Management",
    },
    // {
    //   icon: Icons.DashboardOutlined,
    //   text: "ภาพรวมครู",
    //   path: "/statistics/teacherOverview/schoolID",
    //   routes: [
    //     {
    //       name: "PageTeacherOverview",
    //       path: "/statistics/teacherOverview/schoolID",
    //     },
    //   ],
    //   roles: ["User"],
    //   positions: ["S-1", "R-3", "R-5", "S-3"],
    //   type: "Management",
    // },
    // {
    //   icon: Icons.Person,
    //   text: "รายชื่อครูในหมวด",
    //   path: "/statistics/teacher",
    //   routes: [
    //     {
    //       name: "PageTeacher",
    //       path: "/statistics/teacher",
    //     },
    //     {
    //       name: "PageTeacherDetail",
    //       path: "/statistics/teacher/:id",
    //     },
    //   ],
    //   roles: ["User"],
    //   positions: ["", "S-1", "R-3", "S-3"],
    //   type: "Management",
    // },
    {
      icon: Icons.DashboardOutlined,
      text: "ภาพรวมโรงเรียนทั้งหมดในระบบ",
      path: "/statistics/country/overview",
      routes: [
        {
          name: "PageCountryOverview",
          path: "/statistics/country/overview",
        },
      ],
      roles: ["User"],
      positions: ["R-1"],
      type: "Management",
    },
    {
      icon: Icons.DashboardOutlined,
      text: "ภาพรวมระดับเขตพื้นที่การศึกษา",
      path: "/statistics/esa/overview",
      routes: [
        {
          name: "PageEsaOverview",
          path: "/statistics/esa/overview",
        },
      ],
      roles: ["User"],
      positions: ["R-2"],
      type: "Management",
    },
    // {
    //   icon: Icons.DashboardOutlined,
    //   text: "ภาพรวมกระทรวง",
    //   path: "/statistics/ministry/overview",
    //   routes: [
    //     {
    //       name: "PageMinistryOverview",
    //       path: "/statistics/ministry/overview",
    //     },
    //   ],
    //   roles: ["User"],
    //   positions: ["R-5"],
    //   type: "Management",
    // },
    {
      icon: Icons.DashboardOutlined,
      text: "รายงานความก้าวหน้า",
      path: "/statistics/progress",
      routes: [
        {
          name: "PageESAProgressOverview",
          path: "/statistics/progress",
        },
        {
          name: "PageTeacherOverview",
          path: "/statistics/teacherOverview/:schoolId",
        },
      ],
      roles: ["User"],
      positions: [
        "S-1",
        "S-2",
        "S-3",
        "S-4",
        "P-1",
        "T-1",
        "R-1",
        "R-2",
        "R-3",
        "R-4",
        "R-5",
      ],
      type: "Management",
    },
    {
      icon: Icons.DashboardOutlined,
      text: "รายงานความก้าวหน้าMockup",
      path: "/statistics/progress_",
      routes: [
        {
          name: "PageESAProgressOverviewMockup",
          path: "/statistics/progress_",
        },
        {
          name: "PageTeacherOverview",
          path: "/statistics/teacherOverview/:schoolId",
        },
      ],
      roles: ["User"],
      positions: ["R-5"],
      type: "Management",
    },
    {
      icon: Icons.DashboardOutlined,
      text: "ภาพรวมโรงเรียนในเครือ",
      path: "/statistics/affiliation/overview",
      routes: [
        {
          name: "PageAffiliationOverview",
          path: "/statistics/affiliation/overview",
        },
      ],
      roles: ["User"],
      positions: ["T-1"],
      type: "Management",
    },
    {
      icon: Icons.DashboardOutlined,
      text: "ภาพรวมครู",
      path: "/profile",
      routes: [
        {
          name: "PageTeacherProfile",
          path: "/profile",
        },
        {
          name: "PageEditTeacherProfile",
          path: "/editProfile",
        },
      ],
      roles: ["User"],
      positions: ["S-4"],
      type: "Management",
    },
    {
      icon: Icons.DashboardOutlined,
      text: "ภาพรวมนักเรียน",
      path: "/overview/student",
      routes: [
        {
          name: "PageStudentOverview",
          path: "/overview/student",
        },
      ],
      roles: ["User"],
      positions: ["S-4"],
      type: "Management",
    },
    // {
    //   icon: Icons.DashboardOutlined,
    //   text: "การบ้าน",
    //   path: "/overview/homework",
    //   routes: [
    //     {
    //       name: "PageHomeworkOverview",
    //       path: "/overview/homework",
    //     },
    //   ],
    //   roles: ["User"],
    //   positions: ["S-4"],
    //   type: "Management",
    // },
    {
      icon: Icons.Assignment,
      text: "จัดการบทเรียน",
      path: "/maps",
      routes: [
        {
          name: "PageMaps",
          path: "/maps",
        },
      ],
      roles: ["Developer", "Admin", "Super Admin"],
      positions: ["A-1"],
      type: "Management",
    },
    {
      icon: Icons.Assignment,
      text: "จัดการเวอร์ชั่น",
      path: "/version",
      routes: [
        {
          name: "PageVersion",
          path: "/version",
        },
      ],
      roles: ["Developer", "Admin", "Super Admin"],
      positions: ["A-1"],
      type: "Management",
    },
    {
      icon: Icons.Assignment,
      text: "จัดการข้อสอบ",
      path: "/quizzes",
      routes: [
        {
          name: "PageQuizzes",
          path: "/quizzes",
        },
      ],
      roles: ["Developer", "Admin", "Super Admin"],
      positions: ["A-1"],
      type: "Management",
    },
    {
      icon: Icons.Assignment,
      text: "อัพโหลดรูปข้อสอบ",
      path: "/uploadQuizImage",
      routes: [
        {
          name: "PageUploadQuizImage",
          path: "/uploadQuizImage",
        },
      ],
      roles: ["Developer", "Admin", "Super Admin"],
      positions: ["A-1"],
      type: "Management",
    },
    {
      icon: Icons.Assignment,
      text: "ค้นหาPINนักเรียน",
      path: "/studentPIN",
      routes: [
        {
          name: "PageStudentPin",
          path: "/studentPIN",
        },
      ],
      roles: ["Developer", "Admin", "Super Admin"],
      positions: ["A-1"],
      type: "Management",
    },
    {
      icon: Icons.DashboardOutlined,
      text: "โน้ต",
      path: "/notes",
      routes: [
        {
          name: "PageNote",
          path: "/notes",
        },
      ],
      roles: ["User"],
      positions: ["S-4"],
      type: "Management",
    },
    {
      icon: Icons.DashboardOutlined,
      text: "Report ความก้าวหน้า",
      path: "/report/progress",
      routes: [
        {
          name: "PageESAProgressOverviewAdminReport",
          path: "/report/progress",
        },
        {
          name: "PageTeacherOverview",
          path: "/report/teacherOverview/:schoolId",
        },
      ],
      roles: ["Developer", "Admin", "Super Admin"],
      positions: [
        "A-1",
      ],
      type: "Management",
    },
  ],
  items_2: [
    {
      icon: Icons.Help,
      text: "วิธีการใช้งาน",
      path: "/howto",
      routes: [
        {
          name: "HowToPage",
          path: "/howto",
        },
      ],
      roles: ["All"],
      positions: ["All"],
    },
    {
      icon: Icons.CloudDownload,
      text: "ดาวน์โหลดเกม",
      path: "/download",
      routes: [
        {
          name: "DownloadPage",
          path: "/download",
        },
      ],
      roles: ["All"],
      positions: ["All"],
    },
  ],
  items_3: [
    {
      routes: [
        {
          name: "ChatPageV1",
          path: "/chat",
        },
      ],
      roles: ["All"],
      positions: ["All"],
    },
    {
      routes: [
        {
          name: "ManageCSV",
          path: "/manage-csv",
        },
      ],
      roles: ["All"],
      positions: ["All"],
    },
    {
      text: "เพิ่มโรงเรียน",
      routes: [
        {
          name: "PageMSchoolCreate",
          path: "/schools/create",
        },
        {
          name: "PageMSchoolEdit",
          path: "/schools/edit/:id",
        },
      ],
      roles: ["Admin", "Developer", "Super Admin"],
      positions: ["", "S-1", "S-2", "A-1"],
    },
    {
      text: "เพิ่มสังกัด",
      routes: [
        {
          name: "PageAffiliateCreate",
          path: "/affiliates/create",
        },
      ],
      roles: ["Admin", "Developer", "Super Admin"],
      positions: ["", "S-1", "S-2", "A-1"],
    },
  ],
};
