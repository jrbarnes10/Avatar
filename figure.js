//
//  CSE470 HW4
//  Josh Barnes
//

var canvas;
var gl;
var program;

var projectionMatrix;
var modelViewMatrix;
var ambientColor, diffuseColor, specularColor;

//CSE470 flag for starting and stopping animation
var toggleAnimate = false;

var instanceMatrix;
var modelViewMatrixLoc;

//CSE470 variables for phong illumination model
var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

//CSE470 material properties
var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialShininess = 100.0;

//CSE470 IDs for each body part
var torsoId = 0;
var headId  = 1;
var head1Id = 1;
var head2Id = 10;
var leftUpperAntennaId = 2;
var leftLowerAntennaId = 3;
var rightUpperAntennaId = 4;
var rightLowerAntennaId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;

//CSE470 set properties of each body part
var torsoHeight = 2.5;
var torsoWidth = 2.0;
var upperAntennaHeight = 0.25;
var lowerAntennaHeight = 0.25;
var upperAntennaWidth  = 0.1;
var lowerAntennaWidth  = 0.1;
var upperLegWidth  = 0.1;
var lowerLegWidth  = 0.1;
var lowerLegHeight = 0.75;
var upperLegHeight = 0.75;
var headHeight = 1.0;
var headWidth = 1.0;

var numNodes = 10;
var numAngles = 11;
var angle = 0;

var theta = [0, 0, 0, 0, 0, 0, 180, 0, 180, 0, 0];

var numVertices = 24;

var stack = [];

var figure = [];

//CSE470 initialize nodes
for( var i=0; i<numNodes; i++) figure[i] = createNode(null, null, null, null);

var vBuffer;
var modelViewLoc;

var points = [];
var normals = [];
var colors = [];
var texCoord = [];

var nCube;

//-------------------------------------------

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

//--------------------------------------------

//CSE470 create new node for hierarchical tree
function createNode(transform, render, sibling, child){
    var node = {
    transform: transform,
    render: render,
    sibling: sibling,
    child: child,
    }
    return node;
}

//CSE470 initialize nodes
// Switch between nodes
function initNodes(Id) {

    var m = mat4();

    switch(Id) {

    case torsoId:

    m = translate(0.0,5.75,0.0);
    m = mult(m,rotate(theta[torsoId], 0, 1, 0 ));
    figure[torsoId] = createNode( m, torso, null, headId );
    break;

    case headId:
    case head1Id:
    case head2Id:


	//DCH Comment: I think there is an error in the head
	// I have commented out the code that is not needed. We want the head to rotate about a point in base, not center

    //m = translate(0.0, torsoHeight+0.5*headHeight, 0.0);
	m = translate(0.0, torsoHeight, 0.0);
	m = mult(m, rotate(theta[head1Id], 1, 0, 0))
	m = mult(m, rotate(theta[head2Id], 0, 1, 0));
    //m = mult(m, translate(0.0, -0.5*headHeight, 0.0));
    figure[headId] = createNode( m, head, leftUpperAntennaId, null);
    break;


    case leftUpperAntennaId:

    //m = translate(-(torsoWidth+upperAntennaWidth), 0.9*torsoHeight, 0.0);
    m = translate(-(torsoWidth+upperAntennaWidth + 1.0), 0.9*torsoHeight + 1.25, 0.0);
	  m = mult(m, rotate(theta[leftUpperAntennaId], 1, 0, 0));
    figure[leftUpperAntennaId] = createNode( m, leftUpperArm, rightUpperAntennaId, leftLowerAntennaId );
    break;

    case rightUpperAntennaId:

    //m = translate(torsoWidth+upperAntennaWidth, 0.9*torsoHeight, 0.0);
    m = translate(torsoWidth+upperAntennaWidth + 1.0, 0.9*torsoHeight+ 1.25, 0.0);
	  m = mult(m, rotate(theta[rightUpperAntennaId], 1, 0, 0));
    figure[rightUpperAntennaId] = createNode( m, rightUpperAntenna, leftUpperLegId, rightLowerAntennaId );
    break;

    case leftUpperLegId:

    m = translate(-(torsoWidth+upperLegWidth), 0.1*upperLegHeight, 0.0);
	  m = mult(m , rotate(theta[leftUpperLegId], 1, 0, 0));
    figure[leftUpperLegId] = createNode( m, leftUpperLeg, rightUpperLegId, leftLowerLegId );
    break;

    case rightUpperLegId:

    m = translate(torsoWidth+upperLegWidth, 0.1*upperLegHeight, 0.0);
  	m = mult(m, rotate(theta[rightUpperLegId], 1, 0, 0));
    figure[rightUpperLegId] = createNode( m, rightUpperLeg, null, rightLowerLegId );
    break;

    case leftLowerAntennaId:

    m = translate(0.0, upperAntennaHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerAntennaId], 1, 0, 0));
    figure[leftLowerAntennaId] = createNode( m, leftLowerAntenna, null, null );
    break;

    case rightLowerAntennaId:

    m = translate(0.0, upperAntennaHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerAntennaId], 1, 0, 0));
    figure[rightLowerAntennaId] = createNode( m, rightLowerArm, null, null );
    break;

    case leftLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[leftLowerLegId], 1, 0, 0));
    figure[leftLowerLegId] = createNode( m, leftLowerLeg, null, null );
    break;

    case rightLowerLegId:

    m = translate(0.0, upperLegHeight, 0.0);
    m = mult(m, rotate(theta[rightLowerLegId], 1, 0, 0));
    figure[rightLowerLegId] = createNode( m, rightLowerLeg, null, null );
    break;

    }
}

//CSE470 traverse through tree
function traverse(Id) {

   if(Id == null) return;
   stack.push(modelViewMatrix);
   modelViewMatrix = mult(modelViewMatrix, figure[Id].transform);
   figure[Id].render();
   if(figure[Id].child != null) traverse(figure[Id].child);
    modelViewMatrix = stack.pop();
   if(figure[Id].sibling != null) traverse(figure[Id].sibling);
}

//CSE470 set location of torso
function torso() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5*torsoHeight, 0.0) );
    instanceMatrix = mult(instanceMatrix, scale4( torsoWidth, torsoHeight, torsoWidth));
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//CSE470 place head in correct spot
function head() {

    instanceMatrix = mult(modelViewMatrix, translate(0.0, 0.5 * headHeight, 0.0 ));
	  instanceMatrix = mult(instanceMatrix, scale4(headWidth, headHeight, headWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//CSE470 place left upper arm in correct spot
function leftUpperArm() {

    instanceMatrix = mult(modelViewMatrix, translate(2.7, 0.5 * upperAntennaHeight, 0.0) );
	  instanceMatrix = mult(instanceMatrix, scale4(upperAntennaWidth, upperAntennaHeight, upperAntennaWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//CSE470 place left antenna in correct spot
function leftLowerAntenna() {

    instanceMatrix = mult(modelViewMatrix, translate(2.7, 0.5 * lowerAntennaHeight, 0.0) );
  	instanceMatrix = mult(instanceMatrix, scale4(lowerAntennaWidth, lowerAntennaHeight, lowerAntennaWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//CSE470 place right antenna in correct spot
function rightUpperAntenna() {

    instanceMatrix = mult(modelViewMatrix, translate(-2.7, 0.5 * upperAntennaHeight, 0.0) );
	  instanceMatrix = mult(instanceMatrix, scale4(upperAntennaWidth, upperAntennaHeight, upperAntennaWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//CSE470 place right lower arm in correct spot
function rightLowerArm() {

    instanceMatrix = mult(modelViewMatrix, translate(-2.7, 0.5 * lowerAntennaHeight, 0.0) );
	  instanceMatrix = mult(instanceMatrix, scale4(lowerAntennaWidth, lowerAntennaHeight, lowerAntennaWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//CSE470 place left upper leg in correct spot
function  leftUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(2.7, 0.5 * upperLegHeight, 0.0) );
	  instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//CSE470 place left lower leg in correct spot
function leftLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate( 2.7, 0.5 * lowerLegHeight, 0.0) );
	  instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//CSE470 place right upper leg in correct spot
function rightUpperLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(-2.7, 0.5 * upperLegHeight, 0.0) );
	  instanceMatrix = mult(instanceMatrix, scale4(upperLegWidth, upperLegHeight, upperLegWidth) );
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

//CSE470 place right lower leg in correct spot
function rightLowerLeg() {

    instanceMatrix = mult(modelViewMatrix, translate(-2.7, 0.5 * lowerLegHeight, 0.0) );
	  instanceMatrix = mult(instanceMatrix, scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth) )
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(instanceMatrix));
    for(var i =0; i<6; i++) gl.drawArrays(gl.TRIANGLE_FAN, 4*i, 4);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader");

    gl.useProgram( program);

    instanceMatrix = mat4();

    projectionMatrix = ortho(-10.0,10.0,-10.0, 10.0,-10.0,10.0);
    modelViewMatrix = mat4();


    gl.uniformMatrix4fv(gl.getUniformLocation( program, "modelViewMatrix"), false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( gl.getUniformLocation( program, "projectionMatrix"), false, flatten(projectionMatrix) );

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix")

    var avatar = cube();

    var myMaterial = goldMaterial();
    var myLight = light0();

    points = avatar.TriangleVertices;
    normals = avatar.TriangleNormals;

    nCube = avatar.TriangleVertices.length;

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    //CSE470 set light properties
    var ambientProduct = mult(myLight.lightAmbient, myMaterial.materialAmbient);
    var diffuseProduct = mult(myLight.lightDiffuse, myMaterial.materialDiffuse);
    var specularProduct = mult(myLight.lightSpecular, myMaterial.materialSpecular);

    //CSE470 send light materials to GPU
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(myLight.lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),materialShininess);

       theta[torsoId ] = 90;
       initNodes(torsoId);

    //CSE470 create button logic for toggling animation
    document.getElementById( "animateAvatar" ).onclick = function () {
      toggleAnimate = !toggleAnimate;
    }

    //CSE470 initialize nodes
    for(i=0; i<numNodes; i++) initNodes(i);

    render();
}

//CSE470 speed variables for movement
var leftAntennaSpeed = 3.0;
var rightAntennaSpeed = -3.0;
var leftLegSpeed = 3.0;
var rightLegSpeed = -3.0;

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        //CSE470 if animate button is on, call function to move avatar
        if(toggleAnimate)
        {
          animateAvatar();
        }

        //CSE470 traverse through hierarchical tree
        traverse(torsoId);
        requestAnimFrame(render);

}
