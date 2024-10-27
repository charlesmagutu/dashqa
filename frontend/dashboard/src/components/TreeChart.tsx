import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

const RadialTreeChart: React.FC<{ data: TreeNode }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear existing content
    d3.select(svgRef.current).selectAll("*").remove();

    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2;

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create hierarchy
    const root = d3.hierarchy(data);

    // Create tree layout
    const tree = d3.tree<TreeNode>()
      .size([2 * Math.PI, radius - 100]);

    const nodes = tree(root);
    
    // Create links
    svg.selectAll(".link")
      .data(nodes.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkRadial()
        .angle(d => d.target.x ?? 0)
        .radius(d => d.target.y ?? 0))
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5);

    // Create nodes
    const node = svg.selectAll(".node")
      .data(nodes.descendants())
      .enter().append("g")
      .attr("class", "node")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI}) translate(${d.y},0)`);

    // Add circles to nodes
    node.append("circle")
      .attr("r", 5)
      .attr("fill", d => d.children ? "#69b3a2" : "#ffcc00")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .on("mouseover", function(event, d) {
        const tooltip = d3.select("#tooltip");
        tooltip.style("opacity", 1)
               .html(d.data.name)
               .style("left", `${event.pageX}px`)
               .style("top", `${event.pageY}px`);
      })
      .on("mouseout", function() {
        d3.select("#tooltip").style("opacity", 0);
      });

    // Add text labels to nodes
    node.append("text")
      .attr("dy", ".35em")
      .attr("x", d => d.children ? -8 : 8)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .style("font-family", "Arial")
      .style("font-size", "12px")
      .style("fill", "#333");

  }, [data]);

  return (
    <>
      <svg ref={svgRef} />
      <div id="tooltip" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }} />
    </>
  );
};

export default RadialTreeChart;
