//
//  CSE470 HW4
//  Josh Barnes
//

//CSE470 rotating and translating body parts for when toggle animate is set to on
var animateAvatar = function(){

  //CSE470 make sure antennas don't spin all the way around
  // antennas should go back and forth between -70 and 70 degree
  // ------------------------------------------
  if(theta[leftUpperAntennaId] >= 70 || theta[leftUpperAntennaId] <= -70)
  {
    leftAntennaSpeed *= -1.0;
  }
  theta[leftUpperAntennaId] += leftAntennaSpeed;
  initNodes(leftUpperAntennaId);

  if(theta[rightUpperAntennaId] >= 70 || theta[rightUpperAntennaId] <= -70)
  {
    rightAntennaSpeed *= -1.0;
  }
  theta[rightUpperAntennaId] += rightAntennaSpeed;
  initNodes(rightUpperAntennaId);
  // -------------------------------------------


  //CSE470 set left/right lower legs to simulate partial bending leg while walking
  // -------------------------------------------
  theta[leftLowerLegId] = 35.0;
  initNodes(leftLowerLegId);

  theta[rightLowerLegId] = 35.0;
  initNodes(rightLowerLegId);
  // -------------------------------------------


//CSE470 Simulate walking movement
//Legs go from -260 -> 200 degrees
// ---------------------------------------------
if(theta[rightUpperLegId] >= 200 || theta[rightUpperLegId] <= 150)
{
  rightLegSpeed *= -1.0;
}

theta[rightUpperLegId] += rightLegSpeed;
initNodes(rightUpperLegId);

  if(theta[leftUpperLegId] >= 200 || theta[leftUpperLegId] <= 150)
  {
    leftLegSpeed *= -1.0;
  }

  theta[leftUpperLegId] += leftLegSpeed;
  initNodes(leftUpperLegId);
 // ----------------------------------------------


 //CSE470 rotation to allow avatar to walk around the earth
  theta[torsoId] -= 0.5;
  modelViewMatrix = rotate(theta[torsoId], [0.0,0.0,1.0]);
}
