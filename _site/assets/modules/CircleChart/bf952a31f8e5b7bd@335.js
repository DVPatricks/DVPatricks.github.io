// https://observablehq.com/@d3/bilevel-edge-bundling@335


function keyword_cloud_chart(invalidation, width,height,data,d3,color)
{ 

  console.log("hi, keyword_cloud_chart!");
  var context = document.getElementById("keyword_cloud_3").getContext("2d");
  console.log("context");
  console.log(context);
  const nodes = data.map(Object.create);

  const simulation = d3.forceSimulation(nodes)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3))
      .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 2 / 3))
      .on("tick", ticked);
  d3.select(context.canvas)
      .on("touchmove", event => event.preventDefault())
      .on("pointermove", pointed);

  invalidation.then(() => simulation.stop());

  function pointed(event) {
    const [x, y] = d3.pointer(event);
    nodes[0].fx = x - width / 2;
    nodes[0].fy = y - height / 2;
  }

  function ticked() {    
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
	var begin = true;
    for (const d of nodes) {
	  if(begin){
		begin = false;
	  }
	  else{
		  context.fillStyle = color(d.group);
		  context.font = "bold 30px serif";
		  if(d.x - d.r < -width/2 || d.x + d.r > width/2 || d.y + d.r > height/2 || d.y - d.r < -height/2){
			  //context.fillText(d.v, x, y, d.r*2);
		  }
		  else{
			  context.fillText("hello",d.x,d.y, );
		  }		
	  }
      context.fill();
    }
    context.restore();
  } 

  return context.canvas;
}

function keyword_cloud_data(width,d3,n)
{
  console.log("hi, keyword_cloud_data!")
  const k = width / 20;
  const r = d3.randomUniform(k, k * 4);
  return Array.from({length: 30}, (_, i) => ({r: r(), group: i && (i % n + 1)}));
}


function keyword_cloud_n(){console.log("hi, keyword_cloud_n!");return(
4
)}

function keyword_cloud_color(d3,n){console.log("hi, keyword_cloud_color!");return(
d3.scaleOrdinal(d3.range(n), ["transparent"].concat(d3.schemeTableau10))
)}


function _chart(invalidation, keyword_cloud_width, keyword_cloud_height,keyword_cloud_data,keyword_cloud_color,tree,bilink,d3,data,width,colornone,line,colorin,colorout, info)
{
  const root = tree(bilink(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.id, b.data.id))));
``
  const svg = d3.select("#Pmodules3").append("svg")
      .attr("width", 1000)
      .attr("height", 1000)
      .attr("viewBox", [-500, -425, 1000, 1000])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
	for(var i = 1; i < 9; i++){
		d3.select("#right_3_img_"+i).attr("src", "./assets/modules/CircleChart/files/default_game.jpg").on("mouseover", show_weight)
		/*d3.select("#right_3_img_"+i).append("svg")
		 .attr("height", 300)
		 .attr('width', 300)
		 .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
			.attr("viewBox", [0, 0, 300, 300])
		 .append("image")
		 .attr("xlink:href", "./assets/modules/CircleChart/files/default_game.jpg")
		 .attr("height", 300)
		 .attr('width', 300);*/
	}
	var weight_map = new Map();
	function show_weight(event, d){
		//console.log("show_weight")
		//console.log(d3.select(this)._groups[0][0].id)
		//d3.select("#weight_3").text(Math.ceil(weight_sum/(cnt-1)) + "%");
		d3.select("#weight_3").text(weight_map.get(d3.select(this)._groups[0][0].id) + "%");
	}
	 //icon
	 d3.select("#icon_3").attr("src", "./assets/modules/CircleChart/files/default_game.jpg");
	 /*
	 .append("svg")
	 .attr("height", 150)
	 .attr('width',100)
	 .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
	 //.attr("viewBox", [0, 0, 300, 300])
	 .append("image")
	 .attr("xlink:href", "./assets/modules/CircleChart/files/default_game.jpg")
	 .attr("height", 150)
	 .attr('width', 100);*/
	 
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
	  .on("click", clicknode)
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
//we want to add keyword cloud
	var disable_center_change = false
	var node_this = null
	var node_d = null
	d3.select("#right_3").on("mouseleave", enable_center_change)
  function clicknode(event, d){
	  node_this = this
	  node_d = d
	  disable_center_change = true;
  }
  function enable_center_change(event, d){
	  disable_center_change = false;
	  link.style("mix-blend-mode", "multiply");
	d3.select(node_this).attr("font-weight", null);
	d3.selectAll(node_d.incoming.map(node_d => node_d.path)).attr("stroke", null);
	d3.selectAll(node_d.incoming.map(([node_d]) => node_d.text)).attr("fill", null).attr("font-weight", null);
	d3.selectAll(node_d.outgoing.map(node_d => node_d.path)).attr("stroke", null);
	d3.selectAll(node_d.outgoing.map(([, node_d]) => node_d.text)).attr("fill", null).attr("font-weight", null);
  }
  function overed(event, d) {
	  if(disable_center_change){
		  return
	  }
	  const val = info.get(d.data.id); 
	  d3.select("#name_3").text(d.data.id);
	  d3.select("#description_3").text(val.description);
	  d3.select("#Rating_3").text(val.rating);
	  d3.select("#Score_3").text(val.meta_score);
	  d3.select("#right_3_img").select("image").attr("xlink:href",val.picture);
	d3.select("#icon_3").attr("src",val.picture);
	link.style("mix-blend-mode", null);
    d3.select(this).attr("font-weight", "bold");
	let platformSet = new Set();
	let developerSet = new Set();
	let genreSet = new Set();
	let typeSet = new Set();
	let ratingSet = new Set();
	var cnt = 1;
	var weight_sum = 0;
	var weight = 0;
	for (const node of d.incoming) {
		if(cnt > 8){
			break;
		}
		//d3.select("#right_3_img_" + cnt).select("image").attr("xlink:href",info.get(node[0].data.id).picture);
		d3.select("#right_3_img_"+cnt).attr("src", info.get(node[0].data.id).picture)
		weight = Math.ceil(Math.random()*40 + 60);
		weight_sum = weight_sum + weight;
		weight_map.set("right_3_img_"+cnt, weight);
		
		//console.log("incomming data")
		//console.log(node[0].data)
		platformSet.add(info.get(node[0].data.id).platform);
		developerSet.add(info.get(node[0].data.id).developer);
		genreSet.add(info.get(node[0].data.id).genre);
		typeSet.add(info.get(node[0].data.id).type);
		ratingSet.add(info.get(node[0].data.id).rating);
		cnt++;
	}
	for (const node of d.outgoing) {
		if(cnt > 8){
			break;
		}
		weight = Math.ceil(Math.random()*40 + 60);
		weight_sum = weight_sum + weight;
		weight_map.set("right_3_img_"+cnt, weight);
		//d3.select("#right_3_img_" + cnt).select("image").attr("xlink:href",info.get(node[1].data.id).picture);
		d3.select("#right_3_img_"+cnt).attr("src", info.get(node[1].data.id).picture)
		platformSet.add(info.get(node[1].data.id).platform);
		developerSet.add(info.get(node[1].data.id).developer);
		genreSet.add(info.get(node[1].data.id).genre);
		typeSet.add(info.get(node[1].data.id).type);
		ratingSet.add(info.get(node[1].data.id).rating);
		d3.select("#right_3_img_" + cnt).select("image").attr("xlink:href",info.get(node[1].data.id).picture);
		cnt++;
	}
	d3.select("#weight_3").text(Math.ceil(weight_sum/(cnt-1)) + "%");
	/*
	const k = width / 20;
	const r = d3.randomUniform(k, k * 4);
	return Array.from({length: 30}, (_, i) => ({r: r(), group: i && (i % n + 1)}));
	*/
	var scale = 1.6
	var platforms = Array.from(platformSet).map(d=>({v:d, r:20*scale, group:0}))
	var developers = Array.from(developerSet).map(d=>({v:d, r:25*scale, group:1}))
	var genres = Array.from(genreSet).map(d=>({v:d, r:35*scale, group:2}))
	var types = Array.from(typeSet).map(d=>({v:d, r:30*scale, group:3}))
	var ratings = Array.from(ratingSet).map(d=>({v:d, r:40*scale, group:4}))
	var prepared_data = []
	prepared_data = prepared_data.concat(platforms).concat(developers).concat(genres).concat(types).concat(ratings)
	
    d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", colorin).raise();
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", colorin).attr("font-weight", "bold");
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", colorout).raise();
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", colorout).attr("font-weight", "bold");
	
	//here, we want to draw the keyword_cloud
	var context = document.getElementById("keyword_cloud_3").getContext("2d");
	const nodes = prepared_data.map(Object.create);//keyword_cloud_data
	//console.log("keyword_cloud_data")
	//console.log(keyword_cloud_data)
	
	
	
	const simulation = d3.forceSimulation(nodes)
		  .alphaTarget(0.3) // stay hot
		  .velocityDecay(0.1) // low friction
		  .force("x", d3.forceX().strength(0.01))
		  .force("y", d3.forceY().strength(0.01))
		  .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3))
		  .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -keyword_cloud_width * 2 / 3))
		  .on("tick", ticked);
	d3.select(context.canvas)
		  .on("touchmove", event => event.preventDefault())
		  .on("pointermove", pointed);

	invalidation.then(() => simulation.stop());  
  function pointed(event) {
    const [x, y] = d3.pointer(event);
    nodes[0].fx = x - keyword_cloud_width / 2;
    nodes[0].fy = y - keyword_cloud_height / 2;
  }

  function ticked() {
    context.clearRect(0, 0, keyword_cloud_width, keyword_cloud_height);
    context.save();
    context.translate(keyword_cloud_width / 2, keyword_cloud_height / 2);
	var begin = true;
    for (const d of nodes) {
	  if(begin){
		begin = false;
	  }
	  else{
		  context.fillStyle = keyword_cloud_color(d.group);
		  context.font = "bold "+ d.r/scale +"px serif";
		  //context.font = "bold 30px serif";
		  
		  var x = d.x - d.r;
		  var y = d.y + d.r;
		  if(d.x - d.r < -keyword_cloud_width/2 || d.x + d.r > keyword_cloud_width/2 || d.y + d.r > keyword_cloud_height/2 || d.y - d.r < -keyword_cloud_height/2){
			  //context.fillText(d.v, x, y, d.r*2);
		  }
		  else{
			  context.fillText(d.v, x, y, d.r*2);
		  }	  
	  }
      context.fill();
    }
    context.restore();
  }  
  }

  function outed(event, d) {
	  if(disable_center_change){
		  return
	  }
	 d3.select("#icon_3").attr("src","./assets/modules/CircleChart/files/default_game.jpg");
    for(var i = 1; i < 9; i++){
		//d3.select("#right_3_img_"+i).select("image").attr("xlink:href","./assets/modules/CircleChart/files/default_game.jpg");	
		d3.select("#right_3_img_"+i).attr("src", "./assets/modules/CircleChart/files/default_game.jpg")
	}
	
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
800
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
function _info(d3){
	const info = d3.csv('./assets/modules/CircleChart/files/new_data.csv').then(function(data) {
			data = Array.from(data, d =>{
			d.platform = d.platform.replace("[","").replace("]","").replace("'","").replace("'","").split(",")[0]
			d.genre = d.genre.replace("[","").replace("]","").replace("'","").replace("'","").split(",")[0]
			d.meta_score = parseFloat(d.meta_score)
			d.user_score = parseFloat(d.user_score)
			return d
		})
		const m = new Map(data.map(d => [d.name, d]))
		return m
	});	
	return info;
}
function keyword_cloud_height(width){console.log("hi, kkeyword_cloud_height!");return(
500
)}
function keyword_cloud_width(){return(
500
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
  main.variable(observer("chart")).define("chart", ["invalidation","keyword_cloud_width","keyword_cloud_height","keyword_cloud_data","keyword_cloud_color","tree","bilink","d3","data","width","colornone","line","colorin","colorout", "info"], _chart);
  main.variable(observer("graph")).define("graph", ["FileAttachment"], _graph);
  main.variable(observer("data")).define("data", ["graph"], _data);
  main.variable(observer("info")).define("info", ["d3"], _info);
  main.variable(observer("bilink")).define("bilink", _bilink);
  main.variable(observer("colorin")).define("colorin", _colorin);
  main.variable(observer("colorout")).define("colorout", _colorout);
  main.variable(observer("colornone")).define("colornone", _colornone);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("radius")).define("radius", ["width"], _radius);
  main.variable(observer("line")).define("line", ["d3"], _line);
  main.variable(observer("tree")).define("tree", ["d3","radius"], _tree);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  //key word cloud "DOM","invalidation",
  main.variable(observer("keyword_cloud_width")).define("keyword_cloud_width", keyword_cloud_width);
  main.variable(observer("keyword_cloud_chart")).define("keyword_cloud_chart", ["invalidation","keyword_cloud_width","keyword_cloud_height","keyword_cloud_data","d3","keyword_cloud_color"], keyword_cloud_chart);
  main.variable(observer("keyword_cloud_data")).define("keyword_cloud_data", ["keyword_cloud_width","d3","keyword_cloud_n"], keyword_cloud_data);
  main.variable(observer("keyword_cloud_n")).define("keyword_cloud_n", keyword_cloud_n);
  main.variable(observer("keyword_cloud_color")).define("keyword_cloud_color", ["d3","keyword_cloud_n"], keyword_cloud_color);
  main.variable(observer("keyword_cloud_height")).define("keyword_cloud_height", ["keyword_cloud_width"], keyword_cloud_height);
  return main;
}
