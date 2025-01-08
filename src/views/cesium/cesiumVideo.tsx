import { useEffect, useRef } from "react";
import { Viewer } from 'cesium';
import * as Cesium from 'cesium'

const CesiumVideo = ({ viewer, videoUrl, position }: any) => {
  console.log('11111111111', viewer)
  useEffect(() => {
    console.log(viewer, '22222222222222')
    if (viewer) {
      const overlayDiv = document.createElement('div')
      overlayDiv.style.width = '320px'
      overlayDiv.style.height = '180px';
      overlayDiv.style.position = 'absoulte';
      overlayDiv.style.left = '0';
      overlayDiv.style.top = '0';
      overlayDiv.style.background = 'black';
      overlayDiv.style.border = '1px solid white';
      overlayDiv.style.zIndex = '1000';
      overlayDiv.style.pointerEvents = 'none';
      viewer.container.appendChild(overlayDiv);
      // Add video element
      const videoElement = document.createElement('video');
      videoElement.src = videoUrl;
      videoElement.autoplay = true;
      videoElement.muted = true;
      videoElement.loop = false;
      overlayDiv.appendChild(videoElement);

      // update position when track moves
      const updatePosition = () => {
        const screenPosition = Cesium.SceneTransforms.worldToWindowCoordinates(
          viewer.scene,
          position
        );
        if (screenPosition) {
          overlayDiv.style.left = `${screenPosition.x}px`;
          overlayDiv.style.top = `${screenPosition.y}px`;
        }
        viewer.scene.preRender.addEventListener(updatePosition);
        const removeOverlay = () => {
          overlayDiv.remove();
          viewer.scene.preRender.removeEventListener(updatePosition);
        };
        return () => removeOverlay();
      }
    }
  }, [viewer, position, videoUrl])
  return null
}

export default CesiumVideo;
