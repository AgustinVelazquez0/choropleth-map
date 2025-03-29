// components/ChoroplethMap.jsx
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import Legend from "./Legend";

const ChoroplethMap = () => {
  const [educationData, setEducationData] = useState(null);

  useEffect(() => {
    Promise.all([
      d3.json(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
      ),
      d3.json(
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
      ),
    ])
      .then(([educationData, countiesData]) => {
        setEducationData(educationData);

        const colorScale = d3
          .scaleQuantize()
          .domain([0, d3.max(educationData, (d) => d.bachelorsOrHigher)])
          .range(["#f0f0f0", "#ffcccc", "#ff6666", "#cc0000"]);

        const svg = d3.select("#choropleth");

        const counties = feature(
          countiesData,
          countiesData.objects.counties
        ).features;

        svg
          .selectAll(".county")
          .data(counties)
          .enter()
          .append("path")
          .attr("class", "county")
          .attr("d", d3.geoPath())
          .attr("data-fips", (d) => d.id)
          .attr("data-education", (d) => {
            const countyData = educationData.find((c) => c.fips === d.id);
            return countyData ? countyData.bachelorsOrHigher : 0;
          })
          .attr("fill", (d) => {
            const countyData = educationData.find((c) => c.fips === d.id);
            return countyData
              ? colorScale(countyData.bachelorsOrHigher)
              : "#ccc";
          })
          .on("mouseover", function (event, d) {
            const countyData = educationData.find((c) => c.fips === d.id);
            d3.select("#tooltip")
              .style("visibility", "visible")
              .text(
                `${countyData.area_name}, ${countyData.state}: ${countyData.bachelorsOrHigher}%`
              )
              .attr("data-education", countyData.bachelorsOrHigher)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 28}px`);
          })
          .on("mouseout", () => {
            d3.select("#tooltip").style("visibility", "hidden");
          });
      })
      .catch((err) => console.error("Error cargando los datos:", err));
  }, []);

  return (
    <div>
      <svg id="choropleth" width="960" height="600"></svg>
      {educationData && <Legend educationData={educationData} />}
      <div
        id="tooltip"
        style={{ position: "absolute", visibility: "hidden" }}
      ></div>
    </div>
  );
};

export default ChoroplethMap;
