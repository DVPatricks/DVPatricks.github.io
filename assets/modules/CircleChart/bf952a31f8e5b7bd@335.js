// https://observablehq.com/@d3/bilevel-edge-bundling@335

function _chart(tree,bilink,d3,data,width,colornone,line,colorin,colorout)
{
  const root = tree(bilink(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.id, b.data.id))));

  const svg = d3.select("#Pmodules3").append("svg")
      .attr("viewBox", [-width / 2, -width / 2, width, width]);
  // d3.select("Pmodules").append("svg")
  const node = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
    .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.id)
      .each(function(d) { d.text = this; })
      .on("mouseover", overed)
      .on("mouseout", outed)
      .call(text => text.append("title").text(d => `${d.data.id}
${d.outgoing.length} outgoing
${d.incoming.length} incoming`));

  const link = svg.append("g")
      .attr("stroke", colornone)
      .attr("fill", "none")
    .selectAll("path")
    .data(root.leaves().flatMap(leaf => leaf.outgoing))
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", ([i, o]) => line(i.path(o)))
      .each(function(d) { d.path = this; });

  function overed(event, d) {
    link.style("mix-blend-mode", null);
    d3.select(this).attr("font-weight", "bold");
    d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", colorin).raise();
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", colorin).attr("font-weight", "bold");
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", colorout).raise();
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", colorout).attr("font-weight", "bold");
  }

  function outed(event, d) {
    link.style("mix-blend-mode", "multiply");
    d3.select(this).attr("font-weight", null);
    d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", null).attr("font-weight", null);
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", null).attr("font-weight", null);
  }

  return svg.node();
}


function _graph(FileAttachment){return(
FileAttachment("miserables.json").json()
)}

function _data(graph)
{
  const {nodes, links} = graph;
  const groupById = new Map;
  const nodeById = new Map(nodes.map(node => [node.id, node]));

  for (const node of nodes) {
    let group = groupById.get(node.group);
    if (!group) groupById.set(node.group, group = {id: node.group, children: []});
    group.children.push(node);
    node.targets = [];
  }

  for (const {source: sourceId, target: targetId} of links) {
    nodeById.get(sourceId).targets.push(targetId);
  }

  return {children: [...groupById.values()]};
}


function _bilink(){return(
function bilink(root) {
  const map = new Map(root.leaves().map(d => [d.data.id, d]));
  for (const d of root.leaves()) d.incoming = [], d.outgoing = d.data.targets.map(i => [d, map.get(i)]);
  for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
  return root;
}
)}

function _colorin(){return(
"#00f"
)}

function _colorout(){return(
"#f00"
)}

function _colornone(){return(
"#ccc"
)}

function _width(){return(
954
)}

function _radius(width){return(
width / 2
)}

function _line(d3){return(
d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius(d => d.y)
    .angle(d => d.x)
)}

function _tree(d3,radius){return(
d3.cluster()
    .size([2 * Math.PI, radius - 100])
)}

function _d3(require){return(
require("d3@6")
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    //["miserables.json", {url: new URL("./files/a54fa5363b4035634b31bda01f902f2620a54a6366986631347558458e2484388de6575e5015e38bccc7db6637d87f80ad4ed7bdcab81ec3f31b75908a22a42d", import.meta.url), mimeType: "application/json", toString}]
	["miserables.json", {url: new URL("./files/bundle", import.meta.url), mimeType: "application/json", toString}]
	//bundle
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("chart")).define("chart", ["tree","bilink","d3","data","width","colornone","line","colorin","colorout"], _chart);
  main.variable(observer("graph")).define("graph", ["FileAttachment"], _graph);
  main.variable(observer("data")).define("data", ["graph"], _data);
  main.variable(observer("bilink")).define("bilink", _bilink);
  main.variable(observer("colorin")).define("colorin", _colorin);
  main.variable(observer("colorout")).define("colorout", _colorout);
  main.variable(observer("colornone")).define("colornone", _colornone);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("radius")).define("radius", ["width"], _radius);
  main.variable(observer("line")).define("line", ["d3"], _line);
  main.variable(observer("tree")).define("tree", ["d3","radius"], _tree);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  return main;
}
