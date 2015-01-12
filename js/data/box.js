define([],
/*
**  0--3--5--7--9
**  |           |
**  1     o     A
**  |           |
**  2--4--6--8--B
*/
[/*0*/ {"pos": {"x": -2, "y": -1}, "isolated":0, "edges": []},
 /*1*/ {"pos": {"x": -2, "y":  0}, "isolated":0, "edges": [
         {"dst":0, "leftIn": false, "rightIn": true}
       ]},
 /*2*/ {"pos": {"x": -2, "y":  1}, "isolated":0, "edges": [
         {"dst":1, "leftIn": false, "rightIn": true}
       ]},
 /*3*/ {"pos": {"x": -1, "y": -1}, "isolated":0, "edges": [
         {"dst":0, "leftIn": true, "rightIn": false}
       ]},
 /*4*/ {"pos": {"x": -1, "y":  1}, "isolated":0, "edges": [
          {"dst":2, "leftIn": false, "rightIn": true}
       ]},
 /*5*/ {"pos": {"x":  0, "y": -1}, "isolated":0, "edges": [
          {"dst":3, "leftIn": true, "rightIn": false}
       ]},
 /*6*/ {"pos": {"x":  0, "y":  1}, "isolated":0, "edges": [
          {"dst":4, "leftIn": false, "rightIn": true}
       ]},
 /*7*/ {"pos": {"x":  1, "y": -1}, "isolated":0, "edges": [
          {"dst":5, "leftIn": true, "rightIn": false}
       ]},
 /*8*/ {"pos": {"x":  1, "y":  1}, "isolated":0, "edges": [
          {"dst":6, "leftIn": false, "rightIn": true}
       ]},
 /*9*/ {"pos": {"x":  2, "y": -1}, "isolated":0, "edges": [
          {"dst": 7, "leftIn": true, "rightIn": false}
       ]},
 /*A*/ {"pos": {"x":  2, "y":  0}, "isolated":0, "edges": [
         {"dst":9, "leftIn": true, "rightIn": false}
       ]},
 /*B*/ {"pos": {"x":  2, "y":  1}, "isolated":0, "edges": [
         {"dst":10, "leftIn": true, "rightIn": false},
         {"dst":8,  "leftIn": false, "rightIn": true}
       ]}
]
);
