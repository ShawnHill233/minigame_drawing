import './js/weapp-adapter'

//保存上一个点
var ppx, ppy;
//保存当前点
var cpx, cpy;
//已绘点集合
var point_array = [];
//绘制点集合
var draw_array = [];
//连接范围半径
var radius = 50;
//线的颜色
var line_color = 'black';

const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
canvas.height = screenHeight * window.devicePixelRatio;
canvas.width = screenWidth * window.devicePixelRatio;

let ctx = canvas.getContext('2d')
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.strokeStyle = "#000000";

wx.onTouchStart(function (e) {
  draw_array = [];    //清空可绘点
})

wx.onTouchStart(function (e) {
  console.log(e.touches)
  //画点
  var cpx = e.touches[0].pageX;
  var cpy = e.touches[0].pageY;
  drawpoint(cpx, cpy);
  //画线
  var ppx = cpx;
  var ppy = cpy;
  drawline(ppx, ppy, cpx, cpy);

  //画线
  wx.onTouchMove(function (e) {
    // console.log(e.touches)
    var cpx = e.touches[0].pageX;
    var cpy = e.touches[0].pageY;
    point_array.push([cpx, cpy]);
    drawline(ppx, ppy, cpx, cpy);
    ppx = cpx;
    ppy = cpy;
  })
})


//================================
//function define
//画点
var drawpoint = function (x, y) {
  ctx.fillStyle = line_color;
  ctx.fillRect(x, y, 1, 1);
};

//画线（点是不连续的)
var drawline = function (x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  //遍历已绘的点，将可取点存入array
  for (var i = 0; i < point_array.length; i++) {
    var x = point_array[i][0];
    var y = point_array[i][1];
    if (x < x2 + radius && x > x2 - radius) {
      if (y < y2 + radius && y > y2 - radius) {
        if ((x - x2) * (x - x2) + (y - y2) * (y - y2) < radius * radius) {
          draw_array.push([x, y]);
        }
      }
    }
  }
  // 取随机点
  draw_array = getRand(draw_array, 8);
  // 连接圆附近的随机点
  for (i = 0; i < draw_array.length; i++) {
    var xx = draw_array[i][0];
    var yy = draw_array[i][1];
    ctx.moveTo(xx, yy);
    ctx.lineTo(x2, y2);
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


