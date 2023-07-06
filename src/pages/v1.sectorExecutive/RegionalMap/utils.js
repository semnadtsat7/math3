import { getMap } from "./";

export function getLocationId(event) {
  return event.target.id;
}

export function getLocationName(event) {
  return event?.target?.attributes?.name?.value;
}

export function getLocationAverage(event) {
  return event?.target?.attributes?.average?.value;
}

export function getLocationSelected(event) {
  return event.target.attributes["aria-checked"].value === "true";
}

export function getLocationClassName(average) {
  if (average >= 80 && average <= 100) {
    return "svg-map__location-excellent";
  }

  if (average >= 60 && average <= 79) {
    return "svg-map__location-great";
  }

  if (average >= 40 && average <= 59) {
    return "svg-map__location-good";
  }

  if (average >= 20 && average <= 39) {
    return "svg-map__location-fair";
  }

  if (average > 0 && average <= 19) {
    return "svg-map__location-developing";
  }

  if (average = 0) {
    return "svg-map__location-noData";
  }

  return "svg-map__location";
}

export function getLocationData(country) {
  return getMap(country.toString());
}
