//
//  CSE470 HW4
//  Josh Barnes
//

//CSE470 cube function sets up properties that are then transformed for each body part
// cube normals is used for lighting
function cube() {

var data = {};


var cubeVertices = [

    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var cubeFaceNormals = [
  [ 0, 0, 1],
  [ 1, 0, 0],
  [ 0, -1, 0],
  [ 0, 1, 0],
  [ 0, 0, -1],
  [ -1 , 0, 0]
];

var cubeIndices = [

 [ 1, 0, 3, 2],
 [ 2, 3, 7, 6],
 [ 3, 0, 4, 7],
 [ 6, 5, 1, 2],
 [ 4, 5, 6, 7],
 [ 5, 4, 0, 1]
];

var cubeVertexColors = [

    [ 1.0, 0.0, 0.0, 1.0 ],  // red
    [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
    [ 0.0, 1.0, 0.0, 1.0 ],  // green
    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
    [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
    [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
    [ 1.0, 1.0, 1.0, 1.0 ],   // white
    [ 0.0, 0.0, 0.0, 1.0 ]  // black
];

var cubeElements = [
    1, 0, 3,
    3, 2, 1,

    2, 3, 7,
    7, 6, 2,

    3, 0, 4,
    4, 7, 3,

    6, 5, 1,
    1, 2, 6,

    4, 5, 6,
    6, 7, 4,

    5, 4, 0,
    0, 1, 5
];

var cubeTexElements = [
    1, 0, 3,
    3, 2, 1,

    1, 0, 3,
    3, 2, 1,

    0, 1, 2,
    2, 3, 0,

    2, 1, 0,
    0, 3, 2,

    3, 2, 1,
    1, 0, 3,

    2, 3, 0,
    0, 1, 2
];

var cubeNormalElements = [
  0, 0, 0,
  0, 0, 0,
  1, 1, 1,
  1, 1, 1,
  2, 2, 2,
  2, 2, 2,
  3, 3, 3,
  3, 3, 3,
  4, 4, 4,
  4, 4, 4,
  5, 5, 5,
  5, 5, 5

];

var faceTexCoord = [
    [ 0, 0],
    [ 0, 1],
    [ 1, 1],
    [ 1, 0]
];

var cubeTriangleVertices = [];
var cubeTriangleVertexColors = [];
var cubeTriangleFaceColors = [];
var cubeTextureCoordinates = [];
var cubeTriangleNormals = [];

for ( var i = 0; i < cubeElements.length; i++ ) {
    cubeTriangleVertices.push( cubeVertices[cubeElements[i]] );
    cubeTriangleVertexColors.push( cubeVertexColors[cubeElements[i]] );
    cubeTextureCoordinates.push( faceTexCoord[cubeTexElements[i]]);
    cubeTriangleNormals.push(cubeFaceNormals[cubeNormalElements[i]]);
}

for ( var i = 0; i < cubeElements.length; i++ ) {
    cubeTriangleFaceColors[i] = cubeVertexColors[1+Math.floor((i/6))];
}

function translate(x, y, z){

   for(i=0; i<cubeVertices.length; i++) {
     cubeVertices[i][0] += x;
     cubeVertices[i][1] += y;
     cubeVertices[i][2] += z;
   };

}

function scale(sx, sy, sz){

    for(i=0; i<cubeVertices.length; i++) {
        cubeVertices[i][0] *= sx;
        cubeVertices[i][1] *= sy;
        cubeVertices[i][2] *= sz;
    };
    for(i=0; i<cubeFaceNormals.length; i++) {
        cubeFaceNormals[i][0] /= sx;
        cubeFaceNormals[i][1] /= sy;
        cubeFaceNormals[i][2] /= sz;
    };
}

function radians( degrees ) {
    return degrees * Math.PI / 180.0;
}

function rotate( angle, axis) {

    var d = Math.sqrt(axis[0]*axis[0] + axis[1]*axis[1] + axis[2]*axis[2]);

    var x = axis[0]/d;
    var y = axis[1]/d;
    var z = axis[2]/d;

    var c = Math.cos( radians(angle) );
    var omc = 1.0 - c;
    var s = Math.sin( radians(angle) );

    var mat = [
        [ x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s ],
        [ x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s ],
        [ x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c ]
    ];

    for(i=0; i<cubeVertices.length; i++) {
          var t = [0, 0, 0];
          for( var j =0; j<3; j++)
           for( var k =0 ; k<3; k++)
              t[j] += mat[j][k]*cubeVertices[i][k];
           for( var j =0; j<3; j++) cubeVertices[i][j] = t[j];
    };


    for(i=0; i<cubeFaceNormals.length; i++) {
          var t = [0, 0, 0];
          for( var j =0; j<3; j++)
           for( var k =0 ; k<3; k++)
              t[j] += mat[j][k]*cubeFaceNormals[i][k];
           for( var j =0; j<3; j++) cubeFaceNormals[i][j] = t[j];
    };

}


data.Indices = cubeIndices;
data.VertexColors = cubeVertexColors;
data.Vertices = cubeVertices;
data.Elements = cubeElements;
data.FaceNormals = cubeFaceNormals;
data.TextureCoordinates = cubeTextureCoordinates;
data.TriangleVertices = cubeTriangleVertices;
data.TriangleVertexColors = cubeTriangleVertexColors;
data.TriangleFaceColors = cubeTriangleFaceColors;
data.TriangleNormals = cubeTriangleNormals;
data.translate = translate;
data.scale = scale;
data.rotate = rotate;

return data;

}

//CSE470 set material properties
function goldMaterial() {
  var data  = {};
  data.materialAmbient = vec4( 0.0, 0.9, 1.0, 1.0 );
  data.materialDiffuse = vec4( 0.0, 0.8, 0.9, 1.0);
  data.materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
  data.materialShininess = 100.0;
  return data;
}

//CSE470 set light properties
function light0() {
  var data = {};
  data.lightPosition = [0.0, 0.0, 10.0, 0.0 ];;
  data.lightAmbient = [0.2, 0.2, 0.2, 1.0 ];
  data.lightDiffuse = [ 1.0, 1.0, 1.0, 1.0 ];
  data.lightSpecular = [1.0, 1.0, 1.0, 1.0 ];
  data.lightShineness = 10;
  return data;
}
