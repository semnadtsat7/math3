import Thailand from "./Thailand";

const country = {
    [Thailand.code]: Thailand
}

export const getMap = (code) => {
    return country[code] //need to change to country code eg. Thailand = 1
}

export { default } from "./Map";
// /* eslint-disable import/no-anonymous-default-export */
// export default {
//     label: "Map of Yasothon, Thailand",
//     viewBox: "0 0 873 695",
//     locations: [
//       {
//         name: "",
//         id: "",
//         transform: "",
//         path: "",
//       },
//     ],
//   };
