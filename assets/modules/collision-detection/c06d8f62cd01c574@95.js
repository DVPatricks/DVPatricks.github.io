// https://observablehq.com/@d3/collision-detection/2@95


function _chart(DOM,width,height,data,d3,filter)
{ 
  var full_width = window.screen.availWidth - 400
  width = full_width
  height = 535 
  // const context = DOM.context2d(width, height);
  var nodes;
  var data_;

  d3.select("#canvas")
  .attr("style", `position: relative; width: ${full_width}px; height: ${height}px`)


  var layer1 = d3.select("#canvas").insert("canvas")
    .attr("id","canvas_1")
    .attr("width", width)
    .attr("height", height)
    .attr("style", `position: absolute; left:${(full_width - width)/2}px; z-index: 0;`)

  const context = document.getElementById("canvas_1").getContext("2d");
  layer1.on("touchmove", event => event.preventDefault())
  .on("pointermove", pointed);
  compute();

  var layer2 = d3.select("#canvas")
  .append("a")
  .attr("id", "start")
  .insert("canvas")
  .attr("id","canvas_2")
  .attr("width", 200)
  .attr("height", 200)
  .attr("background", "#ffffff")
  .attr("style", "position: absolute; left: 40%; top: 30%; z-index: 0;")
  .on("click",recommend)
  .on("mouseover",shadow)
  .on("mouseout",startButton)

  function shadow(){
    let cxt = document.getElementById("canvas_2").getContext('2d')
    cxt.clearRect(0,0,200,200);
    let gra = cxt.createLinearGradient(10,10,390,390)
    gra.addColorStop(0,'#ffa6a1')
    gra.addColorStop(0.6,'#eeaa44')
    gra.addColorStop(1,'#feca2f')
    
    cxt.shadowOffsetX = 5;
    cxt.shadowOffsetY = 5;
    cxt.shadowColor = 'rgba(0,0,0,0.5)';
    cxt.shadowBlur = 5;

    cxt.fillStyle = gra
    cxt.strokeStyle = 'white'
    cxt.lineWidth = '1'
    cxt.beginPath()
    cxt.arc(100,100,95,0,2 * Math.PI)
    cxt.closePath()
    cxt.font = '25px sans-serif'
    cxt.textAlign = 'center'
    cxt.fill()
    cxt.strokeText('RECOMMEND',100,105)

  }

  function recommend(){
    let option = d3.select("#selected").text()
    let dataR = data.filter(item => item.genre == option)
    generateCard(dataR[Math.floor(Math.random() * dataR.length)])

  }

  function generateCard(item){
    console.log(item)
    d3.select("#game-name").text(item.name)
    d3.select("#img-src")
      .attr("src", item.picture)
    d3.select("#description")
      .text(item.description)
    d3.select("#ref")
      .attr("href", item.url)
    d3.select("#modal_user_score")
      .text("User score: " + item.user_score)
    d3.select("#modal_meta_score")
      .text("Meta score: " + item.meta_score)
    d3.select("#modal_platform")
      .text("Platform:   " + item.platform)
    d3.select("#modal_developer")
      .text("Developer:  " + item.developer)
    $('#myModal').modal('show')
  }



  startButton();


  var simulation; 
  d3.select("#drop-down")
    .selectAll("button")
    .each(
      function(d,i){
        d3.select("#button_" + i).on("click", recompute)
      })
    

  function startButton(){

    let cxt = document.getElementById("canvas_2").getContext('2d')
    cxt.clearRect(0, 0, 200, 200);

    let gra = cxt.createLinearGradient(10,10,390,390)
    gra.addColorStop(0,'#ffa6a1')
    gra.addColorStop(0.6,'#eeaa44')
    gra.addColorStop(1,'#feca2f')

    cxt.shadowOffsetX = 0;
    cxt.shadowOffsetY = 0;
    cxt.shadowBlur = 0;

    cxt.fillStyle = gra
    cxt.strokeStyle = 'white'
    cxt.lineWidth = '1'
    cxt.beginPath()
    cxt.arc(100,100,100,0,2 * Math.PI)
    cxt.closePath()
    cxt.font = '30px sans-serif'
    cxt.textAlign = 'center'
    cxt.fill()
    cxt.strokeText('RECOMMEND',100,110)
  }


  function compute(){
    var max_n = 80
    var min_meta = 100
    var max_meta = 0
    var min_user = 100
    var max_user = 0
    let option = d3.select("#selected").text()
      
    data_ = data.filter(item => item.genre == option)
    data_ = Array.from(data_, d =>{
      if (d.meta_score > max_meta)
        max_meta = d.meta_score
      if (d.meta_score < min_meta)
        min_meta = d.meta_score
      if (d.user_score > max_user)
        max_user = d.user_score
      if (d.user_score < min_user)
        min_user = d.user_score
      return d
    })
    let l = (width/(data_.length>max_n?max_n:data_.length)) * 2.5
    data_ = Array.from({length: data_.length>max_n?max_n:data_.length}, (_, i) => ({r: l*((data_[i].meta_score - min_meta)/(max_meta - min_meta))**2 + l*((data_[i].user_score - min_user)/(max_user - min_user))**2, pic: data_[i].picture}));
    data_[0].r = 0
    nodes = data_.map(Object.create)
    simulation = d3.forceSimulation(nodes)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3))
      .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 2 / 3))
      .on("tick", ticked);
  }

  function recompute(){
    d3.select("#selected").text(d3.select(this).text())

    var max_n = 80
    var min_meta = 100
    var max_meta = 0
    var min_user = 100
    var max_user = 0
    let option = d3.select("#selected").text()
      
    data_ = data.filter(item => item.genre == option)
    data_ = Array.from(data_, d =>{
      if (d.meta_score > max_meta)
        max_meta = d.meta_score
      if (d.meta_score < min_meta)
        min_meta = d.meta_score
      if (d.user_score > max_user)
        max_user = d.user_score
      if (d.user_score < min_user)
        min_user = d.user_score
      return d
    })
    let l = (width/(data_.length>max_n?max_n:data_.length)) * 2.5
    data_ = Array.from({length: data_.length>max_n?max_n:data_.length}, (_, i) => ({r: l*((data_[i].meta_score - min_meta)/(max_meta - min_meta))**2 + l*((data_[i].user_score - min_user)/(max_user - min_user))**2, pic: data_[i].picture}));
    data_[0].r = 0
    nodes = data_.map(Object.create)
    simulation = d3.forceSimulation(nodes)
      .alphaTarget(0.3) // stay hot
      .velocityDecay(0.1) // low friction
      .force("x", d3.forceX().strength(0.01))
      .force("y", d3.forceY().strength(0.01))
      .force("collide", d3.forceCollide().radius(d => d.r + 1).iterations(3))
      .force("charge", d3.forceManyBody().strength((d, i) => i ? 0 : -width * 2 / 3))
      .on("tick", ticked);
  }

  function pointed(event) {
    const [x, y] = d3.pointer(event);
    nodes[0].fx = x - width / 2;
    nodes[0].fy = y - height / 2;
  }

  function ticked() {
    var radius = 100
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    for (const d of nodes) {
      var x = d.x - d.r;
      var y = d.y + d.r;
      if(d.x - d.r > radius || d.x + d.r < -radius || d.y - d.r > radius || d.y + d.r < -radius){
          context.beginPath();
          context.moveTo(d.x, d.y);
          context.arc(d.x, d.y, d.r, 0, 2 * Math.PI);
          var img = new Image();
          img.src = data_[d.index].pic;
          context.fillStyle = context.createPattern(img, 'repeat')
          context.fill();
      }else{

      }
      
      
    }
    context.restore();
  }

  return context.canvas;
}


function _data(d3){
  var points = d3.csv('/assets/modules/collision-detection/games.csv').then(function(data) {
      data = Array.from(data, d =>{
        d.platform = d.platform.replace("[","").replace("]","").replace("'","").replace("'","").split(",")[0]
        d.genre = d.genre.replace("[","").replace("]","").replace("'","").replace("'","").split(",")[0]
        d.meta_score = parseFloat(d.meta_score)
        d.user_score = parseFloat(d.user_score)
        return d})
      return data
    })
    return points
  }


function _filter(d3){
  d3.csv('/assets/modules/collision-detection/games.csv').then(function(data) {
    data = Array.from(data, d =>{
      d.platform = d.platform.replace("[","").replace("]","").replace("'","").replace("'","").split(",")[0]
      d.genre = d.genre.replace("[","").replace("]","").replace("'","").replace("'","").split(",")[0]
      d.meta_score = parseFloat(d.meta_score)
      d.user_score = parseFloat(d.user_score)
      return d})
    var genres = new Set(data.map(d=>d.genre))
    var choi_genre = d3.select("#drop-down")
    var t = 0
    console.log(genres)
    for (let i of genres){
      if (data.filter(item => item.genre == i).length > 30){
        choi_genre.append("button")
        .attr("type", "button")
        .attr("class","dropdown-item")
        .attr("id", "button_" + t)
        .text(i)
        t = t + 1
        
      }
    }
    d3.select("#selected")
        .text("Sports")
  })
}



function _height(width){return(
width
)}


function _d3(require){return(
require("d3@6")
)}

export default function collide__(runtime, observer) {
  const main = runtime.module();
  main.variable(observer("chart")).define("chart", ["DOM","width","height","data","d3","filter"], _chart);
  main.variable(observer("data")).define("data", ["d3"], _data);
  main.variable(observer("height")).define("height", ["width"], _height);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  main.variable(observer("filter")).define("filter", ["d3"], _filter);

  return main;
}
