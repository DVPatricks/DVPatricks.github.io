// https://observablehq.com/@d3/bubble-chart@377
import define1 from "./7a9e12f9fb3d8e06@459.js";
import define2 from "./a33468b95d0b15b0@808.js";

function _key(Swatches,chart){return(
Swatches(chart.scales.color)
)}

function _chart(BubbleChart, files, game_files){return(
BubbleChart(files, game_files, {
  label: d => [...d.id.split(".").pop().split(/(?=[A-Z][a-z])/g), d.value.toLocaleString("en")].join("\n"),
  value: d => d.value,
  group: d => d.id.split(".")[1],
  title: d => d.id.split(".")[2],
  //link: d => `https://github.com/prefuse/Flare/blob/master/flare/src/${d.id.replace(/\./g, "/")}.as`,
  width: 1152
})
)}

function _flare(FileAttachment){return(
FileAttachment("flare.csv").csv({typed: true})
)}

function _game(FileAttachment){return(
  FileAttachment("games.csv").csv({typed: true})
  )}

function _files(flare){return(
flare.filter(d => d.value !== null)
)}

function _game_files(game){return(
  game.filter(d => d.value !== null)
  )}

function _BubbleChart(d3,location){return(
function BubbleChart(data, game_data, {
  name = ([x]) => x, // alias for label
  label = name, // given d in data, returns text to display on the bubble
  value = ([, y]) => y, // given d in data, returns a quantitative size
  group, // given d in data, returns a categorical value for color
  title, // given d in data, returns text to show on hover
  link, // given a node d, its link (if any)
  linkTarget = "_blank", // the target attribute for links, if any
  width = 800, // outer width, in pixels
  height = width, // outer height, in pixels
  padding = 3, // padding between circles
  margin = 10, // default margins
  marginTop = 0, // top margin, in pixels
  marginRight = 0, // right margin, in pixels
  marginBottom = 0, // bottom margin, in pixels
  marginLeft = 50, // left margin, in pixels
  groups, // array of group names (the domain of the color scale)
  colors = d3.schemeTableau10, // an array of colors (for groups)
  fill = "#ccc", // a static fill color, if no group channel is specified
  fillOpacity = 0.7, // the fill opacity of the bubbles
  stroke, // a static stroke around the bubbles
  strokeWidth, // the stroke width around the bubbles, if any
  strokeOpacity, // the stroke opacity around the bubbles, if any
} = {}) {
  // get the game info map
  const gameMap = new Map()
  game_data.forEach((x, i) => {
    gameMap.set(x['name'], x)
  })
  console.log(gameMap)



  // Compute the values.
  const D = d3.map(data, d => d);
  const V = d3.map(data, value);
  const G = group == null ? null : d3.map(data, group);
  const I = d3.range(V.length).filter(i => V[i] > 0);

  // Unique the groups.
  if (G && groups === undefined) groups = I.map(i => G[i]);
  groups = G && new d3.InternSet(groups);

  // Construct scales.
  const color = G && d3.scaleOrdinal(groups, colors);

  // Compute labels and titles.
  const L = label == null ? null : d3.map(data, label);
  const T = title === undefined ? L : title == null ? null : d3.map(data, title);

  // Compute layout: create a 1-deep hierarchy, and pack it.
  const root = d3.pack()
      .size([width - marginLeft - marginRight , height - marginTop - marginBottom])
      .padding(padding)
    (d3.hierarchy({children: I})
      .sum(i => V[i]));

  const svg = d3.select("#Pmodules1").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-marginLeft, -marginTop, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
      .attr("fill", "currentColor")
      .attr("font-size", 15)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");
  
  const leaf = svg.selectAll("a")
    .data(root.leaves())
    .join("a")
      // .attr("xlink:href", link == null ? null : (d, i) => link(D[d.data], i, data))
      // .attr("target", link == null ? null : linkTarget)
      .attr("transform", d => `translate(${d.x},${d.y})`)
      
      d3.select("#img_text1").transition().delay(200).text("Rayman Legends")
      if (gameMap.get("Rayman Legends")) d3.select("#img1").attr('src', gameMap.get("Rayman Legends")['picture']);
      d3.select("#img_text2").transition().delay(200).text("Rayman 2: The Great Escape")
      if (gameMap.get("Rayman 2: The Great Escape")) d3.select("#img2").attr('src', gameMap.get("Rayman 2: The Great Escape")['picture']);
      d3.select("#img_text3").transition().delay(200).text("Trials Evolution")
      if (gameMap.get("Trials Evolution")) d3.select("#img3").attr('src', gameMap.get("Trials Evolution")['picture']);
      d3.select("#img_text4").transition().delay(200).text("Silent Hunter III")
      if (gameMap.get("Silent Hunter III")) d3.select("#img4").attr('src', gameMap.get("Silent Hunter III")['picture']);
      d3.select("#img_text5").transition().delay(200).text("Rayman 2 Revolution")
      if (gameMap.get("Rayman 2 Revolution")) d3.select("#img5").attr('src', gameMap.get("Rayman 2 Revolution")['picture']);
      d3.select("#img_text6").transition().delay(200).text("Far Cry 3")
      if (gameMap.get("Far Cry 3")) d3.select("#img6").attr('src', gameMap.get("Far Cry 3")['picture']);
      d3.select("#img_text7").transition().delay(200).text("Assassin's Creed: Brotherhood")
      if (gameMap.get("Assassin's Creed: Brotherhood")) d3.select("#img7").attr('src', gameMap.get("Assassin's Creed: Brotherhood")['picture']);
      d3.select("#img_text8").transition().delay(200).text("Assassin's Creed II")
      if (gameMap.get("Assassin's Creed II")) d3.select("#img8").attr('src', gameMap.get("Assassin's Creed II")['picture']);
  
  leaf.append("circle")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
      // .attr("fill", "url(#Nintendo)")
      .attr("fill", d=> "url(#"+T[d.data]+")")
      .attr("filter", "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))")
      .attr("r", d => d.r)
      .data(data)
      .attr('id', d => d.value)
    .on('mouseover', function (d, i) {
      d3.select(this).style("cursor", "pointer"); 
      d3.select(this).style("opacity", 0.5)
      d3.select(this).style("background","url('https://www.webwandtattoo.com/de/img/arc059-png/folder/products-detalle-png/aufkleber-nintendo-logo.png') no-repeat")
      })
	  .on("click", function(d,i){
	    let circle = d3.select(this)
			circle.attr("transform", "scale(0.8 0.8)")
			let elems = d3.selectAll("#corp_name, #game_num, #corp_desc, #img1_div, #img2_div, #img3_div, #img4_div, #img5_div, #img6_div, #img7_div, #img8_div")
      let rep_games = i.games.split("|@|")
      elems.transition().style("opacity", 0)
      d3.select("#game_num").transition().delay(200).text(i.value)
      d3.select("#corp_name").transition().delay(200).text(i.id.split(".")[2])
      d3.select("#img_text1").transition().delay(200).text(rep_games[0])
      if (gameMap.get(rep_games[0])) d3.select("#img1").attr('src', gameMap.get(rep_games[0])['picture']);
      d3.select("#img_text2").transition().delay(200).text(rep_games[1])
      if (gameMap.get(rep_games[1])) d3.select("#img2").attr('src', gameMap.get(rep_games[1])['picture']);
      d3.select("#img_text3").transition().delay(200).text(rep_games[2])
      if (gameMap.get(rep_games[2])) d3.select("#img3").attr('src', gameMap.get(rep_games[2])['picture']);
      d3.select("#img_text4").transition().delay(200).text(rep_games[3])
      if (gameMap.get(rep_games[3])) d3.select("#img4").attr('src', gameMap.get(rep_games[3])['picture']);
      d3.select("#img_text5").transition().delay(200).text(rep_games[4])
      if (gameMap.get(rep_games[4])) d3.select("#img5").attr('src', gameMap.get(rep_games[4])['picture']);
      d3.select("#img_text6").transition().delay(200).text(rep_games[5])
      if (gameMap.get(rep_games[5])) d3.select("#img6").attr('src', gameMap.get(rep_games[5])['picture']);
      d3.select("#img_text7").transition().delay(200).text(rep_games[6])
      if (gameMap.get(rep_games[6])) d3.select("#img7").attr('src', gameMap.get(rep_games[6])['picture']);
      d3.select("#img_text8").transition().delay(200).text(rep_games[7])
      if (gameMap.get(rep_games[7])) d3.select("#img8").attr('src', gameMap.get(rep_games[7])['picture']);

      d3.select("#corp_desc").transition().delay(200).text(i.des)

      
      elems.transition().delay(200).duration(500).style("opacity", 1)
      circle.transition().delay(200).attr("transform", "scale(1 1)")
      
      // ################
      // change the left
      // ################
      for (let k = 0; k<8; k++){
          d3.select("#img"+(k+1)).on('click', function(d, i){
            d3.select(this).transition().duration(200).style("border-style", "inset")
            d3.select(this).transition().delay(100).duration(200).style("border-style", "outset")
          

            if (gameMap.get(rep_games[k])) {
              d3.select("#game_name").transition().delay(200).text(gameMap.get(rep_games[k])['name']);
              d3.select("#game_date").transition().delay(200).text(gameMap.get(rep_games[k])['date']);
              d3.select("#game_meta").transition().delay(200).text(gameMap.get(rep_games[k])['meta_score']);
              d3.select("#game_genre").transition().delay(200).text(gameMap.get(rep_games[k])['genre']);
              d3.select("#game_intro").transition().delay(200).text(gameMap.get(rep_games[k])['description']);
              d3.select("#M1video").attr('src', gameMap.get(rep_games[k])['video']);
              d3.select("#M1videotag").attr('poster', gameMap.get(rep_games[k])['picture']);
              var video = document.getElementById('M1videotag');
              video.load();
              video.play();
          }}).on('mouseover', function (d, i) {
            d3.select(this).style("cursor", "pointer"); 
            d3.select(this).style("opacity", 0.8)
            }).on('mouseout', function (d, i) {
              d3.select(this).style("cursor", "pointer"); 
              d3.select(this).style("opacity", 1);
            })
          }}
      )
	  .on('mouseout', function (d, i) {
      d3.select(this).style("cursor", "pointer"); 
      d3.select(this).style("opacity", 1);
	  })
    
	  //add top 10 games for each company;
    jQuery.fn.d3Click = function () {
      this.each(function (i, e) {
        var evt = new MouseEvent("click");
        e.dispatchEvent(evt);
      });
    };
    $("#150").d3Click();
	
  if (L) {
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    leaf.append("clipPath")
        .attr("id", d => `${uid}-clip-${d.data}`)
      .append("circle")
        .attr("r", d => d.r);
	
    // leaf.append("text")
    //     .attr("clip-path", d => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`)
    //   .selectAll("tspan")
    //   .data(d => `${L[d.data]}`.split(/\n/g))
    //   .join("tspan")
    //     .attr("x", 0)
    //     .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
    //     .attr("fill-opacity", (d, i, D) => i === D.length - 1 ? 0.7 : null)
    //     .text(d => d);
  }

  return Object.assign(svg.node(), {scales: {color}});
}
)}

export default function bubble(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
	["flare.csv", {url: new URL("./files/top30.csv", import.meta.url), mimeType: null, toString}],
  ["games.csv", {url: new URL("../../games.csv", import.meta.url), mimeType: null, toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("key")).define("key", ["Swatches","chart"], _key);
  main.variable(observer("chart")).define("chart", ["BubbleChart","files","game_files"], _chart);
  main.variable(observer("flare")).define("flare", ["FileAttachment"], _flare);
  main.variable(observer("game")).define("game", ["FileAttachment"], _game);
  main.variable(observer("files")).define("files", ["flare"], _files);
  main.variable(observer("game_files")).define("game_files", ["game"], _game_files);
  // main.variable(observer()).define(["howto"], _6);
  main.variable(observer("BubbleChart")).define("BubbleChart", ["d3","location"], _BubbleChart);
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  const child2 = runtime.module(define2);
  main.import("Swatches", child2);
  return main;
}
