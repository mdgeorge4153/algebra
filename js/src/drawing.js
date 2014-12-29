
function GeomContext(field, vector, ctx) {

  this.drawPoint = function (p) {
    var x = field.toNumber(p.x);
    var y = field.toNumber(p.y);

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2*Math.PI);
    ctx.fillPath();

    ctx.fillText(vector.toString(p), x + 2, y - 2);
  };

  this.drawSegment = function(p1, p2) {
    this.drawPoint(p1);
    this.drawPoint(p2);

    ctx.beginPath();
    ctx.moveTo(field.toNumber(p1.x), field.toNumber(p1.y));
    ctx.lineTo(field.toNumber(p2.x), field.toNumber(p2.y));
    ctx.stroke();
  };

  this.drawOrigin = function () {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "blue";
    ctx.arc(0,0,5,0,2*Math.PI);
    ctx.moveTo(0,10);
    ctx.lineTo(0,-10);
    ctx.moveTo(10, 0);
    ctx.lineTo(-10, 0);
    ctx.stroke();
    ctx.restore();
  }
};

