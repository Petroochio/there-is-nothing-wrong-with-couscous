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
  let r = z > EYE_SIZE - 6 && z < EYE_SIZE - 1 ? 0 : z / EYE_SIZE + 0.6;
  let g = z > EYE_SIZE - 6 && z < EYE_SIZE - 1 ? 0 : z / EYE_SIZE + 0.6;
  let b = z > EYE_SIZE - 6 && z < EYE_SIZE - 1 ? 0 : z / EYE_SIZE + 0.6;

  const color = z < EYE_SIZE - 1 ? new THREE.Color( r, g, b ) : 0xff0000;

  const rad = z < EYE_SIZE ? 0.5 : 1;

  const mat = new THREE.MeshLambertMaterial( { color, transparent: true } );
  const geo = new THREE.SphereGeometry( rad, 10, 10 );
  const sphere = new THREE.Mesh( geo, mat );
  sphere.position.set( x, y, z );
  sphere.eyePos = { x, y, z };
  sphere.randPos = {
    x: Math.random() * 60 - 30,
    y: Math.random() * 60 - 30,
    z: Math.random() * 60 - 30,
  };

  sphere.color = { r, g, b };
  sphere.currentColor = { r, g, b };

  return sphere;
};
