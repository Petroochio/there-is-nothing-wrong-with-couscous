import * as THREE from 'three';

const EYE_SIZE = 20;

// Sphere stuff
const genSphereCords = (theta1, theta2) =>
  ([
    EYE_SIZE * Math.sin( theta2 * Math.PI ) * Math.cos( theta1 * Math.PI * 2 ),
    EYE_SIZE * Math.sin( theta2 * Math.PI ) * Math.sin( theta1 * Math.PI * 2 ),
    EYE_SIZE * Math.cos( theta2 * Math.PI ),
  ]);

export default function ( theta, zeta ) {
  const [ x, y, z ] = genSphereCords( theta, zeta );
  const r = z > 0 ? z / EYE_SIZE : 0;
  const g = z > 0 ? z / EYE_SIZE : 0;
  const b = z > 0 ? 1 : ( EYE_SIZE + z ) / EYE_SIZE;
  const color = z < EYE_SIZE ? new THREE.Color( r, g, b ) : 0xff0000;
  const rad = z < EYE_SIZE ? 1 : 2.5;

  const mat = new THREE.MeshLambertMaterial( { color, opacity: 0.7, transparent: true } );
  const geo = new THREE.SphereGeometry( rad, 10, 10 );
  const sphere = new THREE.Mesh( geo, mat );
  sphere.position.set( x, y, z );


  return sphere;
};
