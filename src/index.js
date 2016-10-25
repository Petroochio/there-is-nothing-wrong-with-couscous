import R from 'ramda';
import * as most from 'most';
import CrackedPepper from './lib/cracked-pepper';
import * as THREE from 'three';

import newSphere from './sphere';


let SPHERE_STATE = 'EYE'; // EYE
let switchTime = 0;
let moveInterval = 2000;
let eyeLook = { x: 0, y: 0.25 };

const swapEyeState = () => {
  SPHERE_STATE = SPHERE_STATE === 'EYE' ? 'DISPERSE' : 'EYE';
  switchTime = Date.now();
}

const genSphereRow = ( theta, numZ ) =>
  R.unfold(
    n => n > numZ ? false : [ newSphere( theta, n / numZ ), n + 1 ],
    0
  );

const genSpheres = ( numY, numZ ) =>
  R.unfold(
    n => n > numY ? false : [ genSphereRow( n / numY, numZ ), n + 1 ],
    0
  );

const helpVec = new THREE.Vector3();
const updateSphere = sphere => {
  const minus = SPHERE_STATE === 'EYE' ? 1430 : 0;
  if ( Date.now() - switchTime <= moveInterval - minus ) {
    const { x, y, z } = sphere.position;
    const targetPos = SPHERE_STATE === 'EYE' ? sphere.eyePos : sphere.randPos;

//    sphere.material.color = new THREE.color

    sphere.position.set(
      ( ( targetPos.x - x ) * ( Date.now() - switchTime ) / moveInterval ) + x,
      ( ( targetPos.y - y ) * ( Date.now() - switchTime ) / moveInterval ) + y,
      ( ( targetPos.z - z ) * ( Date.now() - switchTime ) / moveInterval ) + z,
    );
  }
};

window.onload = () => {
  // Camera Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );

  const renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 1 );
  document.body.appendChild( renderer.domElement );
  const effect = new CrackedPepper(renderer);

  effect.setSize(window.innerWidth, window.innerHeight)
  effect.viewDistance = 100;

  var ambientLight = new THREE.AmbientLight( 0x000000 );
  scene.add( ambientLight );

  var lights = [];
  lights[ 0 ] = new THREE.AmbientLight( 0xffffff);

  scene.add( lights[ 0 ] );

  const eyeObj = new THREE.Object3D();
  const eyeSpheres = R.flatten(genSpheres( 25, 25 ));
  eyeSpheres.forEach( sphere => eyeObj.add( sphere ) );
  scene.add( eyeObj );

  let xRot = 0;
  let yRot = 0;

  swapEyeState();

  var render = function () {

  	requestAnimationFrame( render );

    eyeSpheres.forEach( updateSphere );

    if ( SPHERE_STATE === 'DISPERSE' ) {
      xRot += 0.004;
    	yRot += 0.004;
    } else {
      xRot = eyeLook.y;
      yRot = eyeLook.x;
    }

    eyeObj.rotation.x = xRot;
    scene.rotation.y = yRot;

  	effect.render( scene );

  };

  window.addEventListener( 'resize', function () {

  	camera.aspect = window.innerWidth / window.innerHeight;
  	camera.updateProjectionMatrix();

  	renderer.setSize( window.innerWidth, window.innerHeight );

  }, false );

  render();

  document.querySelector('canvas').addEventListener( 'click', swapEyeState);
  document.querySelector('canvas').addEventListener( 'mousemove', ({ movementX, movementY }) => {
    if ( SPHERE_STATE === 'EYE' ) {
      xRot +=  movementX / window.innerWidth * 4;
      yRot -=  movementY / window.innerHeight * 4;
    }
  });

  // Fake some api shit
  const api$ = most.periodic(10, 0.2)
    .scan( ( sum, x ) => sum + x, -200 )
    .forEach( x => {
        eyeLook.x = Math.acos( 10 / Math.sqrt( 100 + Math.abs(x) ) ) * (x > 0 ? 1 : -1);
    });

  // end some fake shit
}
