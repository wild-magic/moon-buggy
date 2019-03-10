import { System, Component } from 'wild-magic';
import World from './World';
import { RENDER_MESH, RENDER_DEBUG } from '../../components';
import * as THREE from 'three';
import renderType from './types/renderType';

const renderSystem = (canvas: HTMLCanvasElement) =>
  new System<{ world: World }>({
    name: 'renderSystem',
    componentTypes: [RENDER_MESH, RENDER_DEBUG],
    onInit: () => {
      console.log('hello world');
      return {
        world: new World(canvas),
      };
    },
    // should it show only the components concerned, or the entire entity?
    onEntityAdded: (entity: any, { world }: any) => {
      const renderMeshData = entity.components.filter(
        (component: any) => component.name === RENDER_MESH
      )[0];

      const object = renderType(renderMeshData.data.mesh);
      const { x, y, z } = renderMeshData.data.position.data;
      object.position.set(x, y, z);
      object.name = entity.uuid;

      const renderDebugData = entity.components.filter(
        (component: any) => component.name === RENDER_DEBUG
      )[0];

      if (renderDebugData) {
        const axesHelper = new THREE.AxesHelper(5);
        object.add(axesHelper);
      }

      world.scene.add(object);
    },
    onUpdate: (delta: number, entities, entityActions, { world }: any) => {
      // @ts-ignore
      entities.forEach((entity: any) => {
        const renderMeshData = entity.components.filter(
          (component: any) => component.name === RENDER_MESH
        )[0];
        const { x: rx, y: ry, z: rz } = renderMeshData.data.rotation.data;
        const { x: px, y: py, z: pz } = renderMeshData.data.position.data;
        const worldObj = world.scene.getObjectByName(entity.uuid);
        if (!worldObj) {
          // Something went wrong here, probably.
          return;
        }
        worldObj.rotation.set(rx, ry, rz);
        worldObj.position.set(px, py, pz);
      });

      world.update();
    },
  });

export default renderSystem;
