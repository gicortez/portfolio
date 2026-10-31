import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

// Pie chart
function renderPieChart(projectsGiven) {
  // clear old paths and legend so they don't stack up
  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // count projects per year
  let rolledData = d3.rollups(projectsGiven, (v) => v.length, (d) => d.year);
  let data = rolledData.map(([year, count]) => ({ value: count, label: year }));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);

  arcData.forEach((d, i) => {
    svg.append('path').attr('d', arcGenerator(d)).attr('fill', colors(i));
  });

  data.forEach((d, i) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);