import R from 'ramda';
import most from 'most';
import CrackedPepper from './lib/cracked-pepper';
import * as THREE from 'three';

window.onload = () => {

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 50 );
  camera.position.z = 30;

  var renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( 0x000000, 1 );
  document.body.appendChild( renderer.domElement );

  const effect = new CrackedPepper(renderer);
  // effect.setFromCamera( camera );
  effect.setSize(window.innerWidth, window.innerHeight)
  effect.viewDistance = 50;

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

  var geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
  var mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({color: 0xf0f0f0}) );

  scene.add( mesh );

  var render = function () {

  	requestAnimationFrame( render );

  	var time = Date.now() * 0.001;

  	mesh.rotation.x += 0.005;
  	mesh.rotation.y += 0.005;

  	effect.render( scene );

  };

  window.addEventListener( 'resize', function () {

  	camera.aspect = window.innerWidth / window.innerHeight;
  	camera.updateProjectionMatrix();

  	renderer.setSize( window.innerWidth, window.innerHeight );

  }, false );

  render();
}
