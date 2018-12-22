import './js/weapp-adapter'

var i, x, y, xx, yy;
//保存上一个点
var ppx, ppy;
//保存当前点
var cpx, cpy;
//已绘点集合
var point_hash = {};
//绘制点集合
var draw_array = [];
//连接范围半径
var radius = 30;
//线的颜色
var line_color = 'black';

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
canvas.height = screenHeight * window.devicePixelRatio*3;
canvas.width = screenWidth * window.devicePixelRatio*3;

let ctx = canvas.getContext('2d')
ctx.scale(window.devicePixelRatio*3, window.devicePixelRatio*3);

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "#000000";

wx.onTouchStart(function (e) {
  // console.log(e.touches)
  draw_array = [];    //清空可绘点
  //画点
  cpx = e.touches[0].pageX;
  cpy = e.touches[0].pageY;
  drawpoint(cpx, cpy);
  //画线
  ppx = cpx;
  ppy = cpy;
  drawline(ppx, ppy, cpx, cpy);
})

//画线
wx.onTouchMove(function (e) {
  draw_array = [];    //清空可绘点
  cpx = e.touches[0].pageX;
  cpy = e.touches[0].pageY;
  point_hash[cpx + ',' + cpy] = true;
  drawline(ppx, ppy, cpx, cpy);
  ppx = cpx;
  ppy = cpy;
})

//================================
//function define
//画点
var drawpoint = function (x, y) {
  ctx.fillStyle = line_color;
  ctx.fillRect(x, y, 1, 1);
};

//画线（点是不连续的)
var drawline = function (ppx, ppy, cpx, cpy) {
  ctx.beginPath();
  ctx.moveTo(ppx, ppy);
  ctx.lineTo(cpx, cpy);
  ctx.stroke();

  //遍历已绘的点，将可取点存入array
  for (x = cpx - radius; x < cpx + radius; x++) {
    for (y = cpy - radius; y < cpy + radius; y++) {
      if (point_hash[x + ',' + y] == true) {
        draw_array.push([x, y]);
      }
    }
  }
  // 取随机点
  draw_array = getRand(draw_array, 8);
  // 连接圆附近的随机点
  for (i = 0; i < draw_array.length; i++) {
    xx = draw_array[i][0];
    yy = draw_array[i][1];
    ctx.moveTo(xx, yy);
    ctx.lineTo(cpx, cpy);
    ctx.lineWidth = 0.5;
    // ctx.setStrokeStyle('yellow')
    ctx.stroke();
  }

};
//产生随机连接点
var getRand = function (arr, len) {
  arr.sort(function () {
    return Math.random() - 0.5;
  });
  return arr.slice(0, len);
};


