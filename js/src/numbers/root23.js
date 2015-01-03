
var root2   = new AdjoinRoot(rats, rats.fromInt(2));
root2.sqrt2 = root2.sqrtN;

var root23   = new AdjoinRoot(root2, root2.fromInt(3));

root23.sqrt2 = root23.fromFieldElems(root2.sqrt2);
root23.sqrt3 = root23.sqrtN;
root23.sqrt6 = root23.fromFieldElems(root2.zero, root2.sqrt2);

root23.two   = root23.fromInt(2);
root23.half  = root23.inv(root23.two);

root23.sin45 = root23.div(root23.sqrt2, root23.two);
root23.cos45 = root23.sin45;

/* 30-60-90 triangle has proportions 1 : 2 : √3
 *   2  ____/|         1  ____/|   
 *  ___/     | 1      ___/     | 1/2
 * /---------|       /---------|   
 *     √3                √3/2        
 */

root23.cos30 = root23.div(root23.sqrt3, root23.two);
root23.sin30 = root23.div(root23.one,   root23.two);

root23.sin60 = root23.cos30;
root23.cos60 = root23.sin30;

/* To find sin and cos of 15, rotate (cos 60, sin 60) by -45 degrees:
 * ┎        ┒   ┎                     ┒   ┎        ┒
 * ┃ cos 15 ┃   ┃  (cos 45)  (sin 45) ┃   ┃ cos 60 ┃
 * ┃        ┃ = ┃                     ┃ * ┃        ┃
 * ┃ sin 15 ┃   ┃ -(sin 45)  (cos 45) ┃   ┃ sin 60 ┃
 * ┖        ┚   ┖                     ┚   ┖        ┚
 */

root23.cos15 = root23.plus (root23.times(root23.cos45, root23.cos60),
			    root23.times(root23.sin45, root23.sin60));
root23.sin15 = root23.plus (root23.neg(root23.times(root23.sin45, root23.cos60)),
			    root23.times(root23.cos45, root23.sin60));


/* unit tests */

root23.checkCSIdent = function (n, c,s) {
  return this.equals(this.plus(this.times(c,c),
			       this.times(s,s)),
		     this.one);
};
root23.checkCSIdent.tests = [
  [15, root23.sin15, root23.cos15],
  [30, root23.sin30, root23.cos30],
  [45, root23.sin45, root23.cos45],
  [60, root23.sin60, root23.cos60],
];

function cosDeg (x) { return Math.cos(x * Math.PI / 180); }
function sinDeg (x) { return Math.sin(x * Math.PI / 180); }

root23.checkFloatApprox = function (c, func, n) {
  return Math.abs(root23.toNumber(c) - func.call(null, n)) < 0.000001;
};
root23.checkFloatApprox.tests = [
  [root23.sqrt2, Math.sqrt, 2],
  [root23.sqrt3, Math.sqrt, 3],
  [root23.sqrt6, Math.sqrt, 6],
  [root23.sin15, sinDeg, 15],
  [root23.cos15, cosDeg, 15],
  [root23.sin30, sinDeg, 30],
  [root23.cos30, cosDeg, 30],
  [root23.sin45, sinDeg, 45],
  [root23.cos45, cosDeg, 45],
  [root23.sin60, sinDeg, 60],
  [root23.cos60, cosDeg, 60],
];

/* special case printing */

root23.toString = function (a) {
  return a.i.i.num.toString() + "/"   + a.i.i.den.toString() + " + " +
	 a.i.j.num.toString() + "√2/" + a.i.j.den.toString() + " + " +
	 a.j.i.num.toString() + "√3/" + a.j.i.den.toString() + " + " +
	 a.j.j.num.toString() + "√6/" + a.j.j.den.toString();
};

Object.freeze(root23);

