import "./RegionalMap.css";
import React, { useState } from "react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  //SVGMap,
  Col,
  Row,
  Box,
} from "../../../core/components";

import { SVGMap } from "../../v1.sectorExecutive"

import {
  EnvironmentOutlined,
  CompressOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import {
  getLocationName,
  getLocationClassName,
  getLocationAverage,
  getLocationData,
} from "./utils";

function RegionalMap(props) {
  const { loading, datasource, country, handleMouseClickRegion} = props;

  const [zoom, setZoomState] = useState(1);
  const [localtion, setLocationState] = useState({
    pointedLocation: null,
    PointedAverage: 0,
  });

  function handleLocationMouseOver(event) {
    const pointedLocation = getLocationName(event);
    const pointedAverage = getLocationAverage(event);
    setLocationState({
      pointedLocation: pointedLocation,
      PointedAverage: pointedAverage,
    });
  }

  return (
    <div>
      <TransformWrapper
        options={{ wrapperClass: "w-100", contentClass: "w-100" }}
        minScale={1}
        maxScale={3}
        onZoom={(e) => {
          setZoomState(e.state.scale);
        }}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            {!loading && (
              <Box mb="3">
                <Row gutter={[8, 8]} type="flex" justify="end">
                  <Col xs={10} sm={7} style={{ textAlign: "right" }}>
                    <div className="App-indicator">
                      <i
                        onClick={() => {
                          zoomIn();
                          setZoomState(zoom + 1);
                        }}
                        style={{
                          paddingRight: 5,
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                      >
                        <ZoomInOutlined />
                      </i>
                      <i
                        onClick={() => {
                          zoomOut();
                          setZoomState(zoom - 1);
                        }}
                        style={{
                          paddingRight: 5,
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                      >
                        <ZoomOutOutlined />
                      </i>
                      <i
                        onClick={() => {
                          resetTransform();
                          setZoomState(1);
                        }}
                        style={{
                          paddingRight: 5,
                          fontSize: 15,
                          cursor: "pointer",
                        }}
                      >
                        <CompressOutlined />
                      </i>
                    </div>
                  </Col>
                </Row>
              </Box>
            )}

            <TransformComponent wrapperClass="w-100" contentClass="w-100">
              <SVGMap
                onLocationClick={handleMouseClickRegion}
                map={getLocationData(country)}
                loading={loading}
                onLocationMouseOver={handleLocationMouseOver}
                onLocationItem={(location) => {
                  // modify object here.
                  if (!datasource) {
                    return location;
                  }

                  let item = datasource.filter((e) => {
                    return e.geocode === location.code;
                  });
                  if (item?.length > 0) {
                    location.locationClassName = getLocationClassName(
                      //item[0].totalPercentage
                      item[0].data?.percentage
                    );
                    //location.average = item[0].totalPercentage?.toFixed(2);
                    location.average = item[0].data?.percentage?.toFixed(2);
                  }

                  return location;
                }}
              ></SVGMap>
            </TransformComponent>

            {!loading && (
              <Box>
                <div style={{ position: "relative" }}>
                  <div id="popupTooltip" className="App-popup-tooltip">
                    <h5 className="text-white">
                      <EnvironmentOutlined />
                      <span>
                        {" "}
                        {localtion.pointedLocation
                          ? localtion.pointedLocation
                          : "-"}
                      </span>
                    </h5>
                    <p>
                      คะแนนเฉลี่ย:{" "}
                      {localtion.PointedAverage ? (
                        <b>{localtion.PointedAverage}%</b>
                      ) : (
                        "-"
                      )}
                    </p>
                  </div>
                </div>
              </Box>
            )}
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  );
}

export default RegionalMap;

