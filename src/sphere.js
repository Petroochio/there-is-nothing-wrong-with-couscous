import * as THREE from 'three';

const EYE_SIZE = 15;

// Sphere stuff
const genSphereCords = theta =>
  ([
    EYE_SIZE * Math.sin( theta * Math.PI ) * Math.cos( theta * Math.PI * 2 ),
    EYE_SIZE * Math.sin( theta * Math.PI ) * Math.sin( theta * Math.PI * 2 ),
    EYE_SIZE * Math.cos( theta * Math.PI ),
  ]);

export default function ( theta ) {
  const geo = new THREE.SphereGeometry( 0.5, 15, 15 );
  const tempMat = new THREE.MeshLambertMaterial( { color: 0xf0f0f0 } );
  const sphere = new THREE.Mesh( geo, tempMat );
  sphere.position.set( ...genSphereCords( theta ) );

  return sphere;
};
