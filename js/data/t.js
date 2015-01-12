define([],
/*
**  0--2--6--8--C
**  |           |
**  1--3  o  9--D
**     |     |
**     4     A
**     |     |
**     5--7--B
*/
[/*0*/ {"pos": {"x": -2, "y": -1}, "isolated":0, "edges": []},
 /*1*/ {"pos": {"x": -2, "y":  0}, "isolated":0, "edges": [
         {"dst":0, "leftIn": false, "rightIn": true}
       ]},
 /*2*/ {"pos": {"x": -1, "y": -1}, "isolated":0, "edges": [
         {"dst":0, "leftIn": true, "rightIn": false}
       ]},
 /*3*/ {"pos": {"x": -1, "y":  0}, "isolated":0, "edges": [
         {"dst":1, "leftIn": false, "rightIn": true}
       ]},
 /*4*/ {"pos": {"x": -1, "y":  1}, "isolated":0, "edges": [
          {"dst":3, "leftIn": false, "rightIn": true}
       ]},
 /*5*/ {"pos": {"x": -1, "y":  2}, "isolated":0, "edges": [
          {"dst":4, "leftIn": false, "rightIn": true}
       ]},
 /*6*/ {"pos": {"x":  0, "y": -1}, "isolated":0, "edges": [
          {"dst":2, "leftIn": true, "rightIn": false}
       ]},
 /*7*/ {"pos": {"x":  0, "y":  2}, "isolated":0, "edges": [
          {"dst":5, "leftIn": false, "rightIn": true}
       ]},
 /*8*/ {"pos": {"x":  1, "y": -1}, "isolated":0, "edges": [
          {"dst":6, "leftIn": true, "rightIn": false}
       ]},
 /*9*/ {"pos": {"x":  1, "y":  0}, "isolated":0, "edges": []},
 /*A*/ {"pos": {"x":  1, "y":  1}, "isolated":0, "edges": [
         {"dst":9, "leftIn": true, "rightIn": false}
       ]},
 /*B*/ {"pos": {"x":  1, "y":  2}, "isolated":0, "edges": [
         {"dst":10, "leftIn": true, "rightIn": false},
         {"dst":7,  "leftIn": false, "rightIn": true}
       ]},
 /*C*/ {"pos": {"x":  2, "y": -1}, "isolated":0, "edges": [
         {"dst":8,  "leftIn": true, "rightIn": false}
       ]},
 /*D*/ {"pos": {"x":  2, "y":  0}, "isolated":0, "edges": [
         {"dst":12, "leftIn": true, "rightIn": false},
         {"dst":9,  "leftIn": false, "rightIn": true}
       ]}
]
);
