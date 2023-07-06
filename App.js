let values = {
  name: "Joy",
  email: "sirisamon0826@gmail.com",
  roleId: "SZL2FHFr5aLsmYHoFakt",
  positionId: "M8TBJmClcL7pfbfZ7DhB",
  permissions: {
    affiliations: ["view", "edit"],
    schools: ["view", "edit"],
  },
  userId: "2DjZMnkXH1SFFnfG8ji4UxnTTMK2",
};

const tmp_result = {};
let tmp_name = "";
Object.entries(values.permissions).forEach((value, i) => {
  value.forEach(function (obj1, index, items) {
    if (Array.isArray(obj1)) {
      items[index] = obj1.reduce(function (obj, v) {
        obj[v] = true;
        return obj;
      }, {});

      tmp_result[tmp_name] = items[index];
    } else {
      tmp_name = obj1;
    }
  });
});

values.permissions = tmp_result;
////////////////////////////////////////////////////////////////////////////////////////////////

values = {
  uid: "0CHP9NMPknXw2ScDz7jhHT8QJsh1",
  email: "fr.prayoon@yahoo.com",
  name: "Poonoy",
  roles: "User",
  rolesId: "a1DYBqaZO3bmUBwa7569",
  provinceId: null,
  schoolId: null,
  positions: {
    name: {
      thai: "ผู้อำนวยการ",
      eng: "",
    },
    id: "S-1",
  },
  positionsId: "M8TBJmClcL7pfbfZ7DhB",
  permissions: [
    {
      view: true,
      edit: true,
      name: "จังหวัด",
      type: "provinces",
    },
    {
      create: true,
      edit: true,
      view: true,
      name: "โรงเรียน",
      type: "schools",
    },
    {
      create: true,
      view: true,
      name: "อำเภอ",
      type: "districts",
    },
    {
      edit: false,
      applyList: [],
      create: false,
      view: false,
      name: "เครือ",
      type: "affiliations",
    },
  ],
  permissionId: "XHm2EgMe7QXmEICX0f1r",
};

const _initialValues = {
  options: [
    {
      label: "ดูข้อมูล",
      value: "view",
      checked: true,
    },
    {
      label: "เพิ่มข้อมูล",
      value: "create",
      checked: false,
    },
    {
      label: "แก้ไขข้อมูล",
      value: "edit",
      checked: true,
    },
  ],
  type: "default",
};

values.permissions.forEach((item) => {
  for (const property in item) {
    if (typeof item[property] == "boolean") {
      var option = _initialValues.options.filter(
        (x) => x.value === `${property}`
      );
      if (option) {
        item.options = item.options ?? [];

        const _option = option[0];
        _option.checked = item[property];

        //console.log(_option.label, property, item[property]);

        item.options.push(_option);
      }
    }
    //console.log(`${property}: ${item[property]}`);
  }

  console.log(JSON.stringify(item));
});
