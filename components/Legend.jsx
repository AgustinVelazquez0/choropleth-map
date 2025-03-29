// components/Legend.jsx
import React, { useEffect } from "react";
import * as d3 from "d3";

const Legend = ({ educationData }) => {
  useEffect(() => {
    if (educationData) {
      // Eliminar cualquier elemento previo dentro de #legend para evitar duplicación
      d3.select("#legend").selectAll("*").remove();

      // Crear la escala de colores para la leyenda, añadiendo un color más oscuro para el 60%
      const colorScale = d3
        .scaleQuantize()
        .domain([0, 60]) // Ahora el dominio llega hasta 60
        .range(["#f0f0f0", "#ffcccc", "#ff6666", "#cc0000", "#990000"]); // Agregamos un color más oscuro para el 60%

      const legendWidth = 240; // Ampliamos un poco el ancho para agregar el nuevo color
      const legendHeight = 20;

      // Crear el SVG de la leyenda
      const legendSvg = d3
        .select("#legend")
        .append("svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight + 30); // Añadir más espacio extra para los porcentajes

      // Añadir los rectángulos de color a la leyenda
      legendSvg
        .append("g")
        .selectAll("rect")
        .data(colorScale.range())
        .enter()
        .append("rect")
        .attr("width", legendWidth / colorScale.range().length) // Ajustamos para que haya espacio para el nuevo color
        .attr("height", legendHeight)
        .attr("x", (d, i) => i * (legendWidth / colorScale.range().length)) // Calculamos el desplazamiento para el nuevo color
        .attr("fill", (d) => d);

      // Añadir los porcentajes personalizados debajo de la barra de colores
      const customTicks = [0, 15, 30, 45, 60]; // Agregamos 60 al final
      legendSvg
        .append("g")
        .selectAll("text")
        .data(customTicks) // Usamos los valores personalizados
        .enter()
        .append("text")
        .attr(
          "x",
          (d, i) => (i + 0.5) * (legendWidth / colorScale.range().length)
        ) // Colocar los números centrados
        .attr("y", legendHeight + 15) // Espacio debajo de la barra
        .attr("text-anchor", "middle")
        .text((d) => `${d}%`); // Mostrar los valores personalizados
    }
  }, [educationData]); // Solo se ejecutará cuando cambie 'educationData'

  return <div id="legend"></div>;
};

export default Legend;
