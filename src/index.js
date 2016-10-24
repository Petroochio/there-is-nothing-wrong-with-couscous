import R from 'ramda';
import most from 'most';
import CrackedPepper from './lib/cracked-pepper';
import * as THREE from 'three';

import newSphere from './sphere';

let SPHERE_STATE = 'EYE'; // EYE
let switchTime = 0;
let moveInterval = 2000;

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
  if ( Date.now() - switchTime <= moveInterval ) {
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
  camera.position.z = 30;

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
  lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
  lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

  lights[ 0 ].position.set( 0, 200, 0 );
  lights[ 1 ].position.set( 100, 200, 100 );
  lights[ 2 ].position.set( - 100, - 200, - 100 );

  scene.add( lights[ 0 ] );
  scene.add( lights[ 1 ] );
  scene.add( lights[ 2 ] );

  const eyeSpheres = R.flatten(genSpheres( 25, 25 ));
  eyeSpheres
    .forEach( sphere => scene.add( sphere ) );

  swapEyeState();

  var render = function () {

  	requestAnimationFrame( render );

    eyeSpheres.forEach( updateSphere );

    if ( SPHERE_STATE === 'DISPERSE' ) {
      scene.rotation.x += 0.004;
    	scene.rotation.y += 0.004;
    }

  	effect.render( scene );

  };

  window.addEventListener( 'resize', function () {

  	camera.aspect = window.innerWidth / window.innerHeight;
  	camera.updateProjectionMatrix();

  	renderer.setSize( window.innerWidth, window.innerHeight );

  }, false );

  render();

  document.querySelector('canvas').addEventListener( 'click', swapEyeState);
}
