import { useCallback, useEffect, useRef, useState } from "react";
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css';
import styles from './cesium.module.less'
import SPORT_DATA from './sportData'
import { calculatePathLengths } from "@/utils/distance";
import { pathLine } from "./path";
import positionImg from '@/assets/images/position.png' //改成svg
import runnerImg from '@/assets/images/runner.png'

import { Button, Col, Radio, RadioChangeEvent, Row, Spin, Upload } from "antd";
import { disableTimelineInteractions, enableTimelineInteractions } from "./util";
import CesiumVideo from "./cesiumVideo";

// 路线数据
const positions = SPORT_DATA.map(item => Cesium.Cartesian3.fromDegrees(item['longitude'], item['latitude']))
// const positions = pathLine.map(item => Cesium.Cartesian3.fromDegrees(item[0], item[1]))
let animationPositions: Cesium.Cartesian3[] = [];
const animationTime = 180; //动画时间：秒
//SampledPositionProperty 是时间序列的核心工具，用来 创建一个平滑的时间序列动画
// SampledPositionProperty，用于存储每个时间点对应的坐标（位置）的映射关系
// 插值后，Cesium 会根据时间序列均匀地计算动画帧，保证平滑和连续性。
let primitivesPositionProperty = new Cesium.SampledPositionProperty();
let entitiesPositionProperty = new Cesium.SampledPositionProperty();

const selected = {
  feature: null,
  originalColor: new Cesium.Color(),
};
const silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
silhouetteBlue.uniforms.length = 0.01;
silhouetteBlue.selected = [];
let osmBuildings: Cesium.Cesium3DTileset | null //用来保存OSM building
let selectedFeature: Cesium.Cesium3DTileFeature | null// 用来保存当前选中的特征

const MapCesium = () => {
  const cesiumRef = useRef<Cesium.Viewer | null>(null)
  const dataSourceRef = useRef<any>(null) //保持记录数据
  const [renderStyle, setRenderStyle] = useState(2);
  let firstTick = true

  let runnerBillboard: Cesium.Billboard | null //小人实例
  let billboardCollection: Cesium.BillboardCollection | null //小人实例集合
  let polylineCollection: Cesium.PolylineCollection | null = null;
  let dynamicPolyline: Cesium.Polyline | null
  const onGenerateEllipsoid = () => {
    const videoElement = document.getElementById('trailer') as HTMLVideoElement;
    const sphere = cesiumRef.current!.entities.add({
      position: Cesium.Cartesian3.fromDegrees(121.358186, 31.211318, 200),
      ellipsoid: {
        radii: new Cesium.Cartesian3(100, 100, 100),
        material: new Cesium.ImageMaterialProperty({ // 3D 球体
          image: videoElement, // 设置视频源
        }),
      },
    })
    cesiumRef.current!.trackedEntity = sphere; // 视角锁定在这个entity上
  }
  const onGenerateAirModel = () => {
    cesiumRef.current!.clock.shouldAnimate = true; // 启动时钟动画
    const position = Cesium.Cartesian3.fromDegrees(121.358186, 31.211318, 100);
    const hpRoll = new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(90), 0, 0)
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpRoll)
    const airEntity = cesiumRef.current!.entities.add({
      position: position,
      orientation: orientation,
      model: {
        uri: '/3DModels/Cesium_Air.glb', // 带有骨骼动画的小人模型
        minimumPixelSize: 128,
        maximumScale: 20000,
        runAnimations: true, // 启用模型动画
      },
    });
    cesiumRef.current!.trackedEntity = airEntity; // 视角锁定在这个entity上
  }

  const initPolylineCollection = () => {
    if (polylineCollection) {
      cesiumRef.current!.scene.primitives.remove(polylineCollection);
    }
    polylineCollection = new Cesium.PolylineCollection();
    cesiumRef.current!.scene.primitives.add(polylineCollection);
    dynamicPolyline = polylineCollection!.add({
      positions: animationPositions,
      width: 5,
      material: Cesium.Material.fromType('PolylineGlow', {
        glowPower: 0.3,
        color: Cesium.Color.RED,
      }),
    });
  }

  // 在初始化时创建 BillboardCollection 和 Billboard
  const initBillboard = async () => {
    billboardCollection = new Cesium.BillboardCollection();
    cesiumRef.current!.scene.primitives.add(billboardCollection);
    runnerBillboard = billboardCollection.add({
      position: Cesium.Cartesian3.fromDegrees(0, 0, -1000000), // 默认在地球内部或屏幕外
      image: runnerImg, // 图片路径
      width: 60, // 宽度
      height: 60, // 高度
    });
  }
  /**
 * 将 Cartesian 坐标转换为经纬度
 * @param position - Cesium.Cartesian3 对象
 * @param viewer - Cesium.Viewer 对象
 * @returns { lat: number, lng: number } 经纬度对象
 */
  const cartesianToDegrees = (position: Cesium.Cartesian3, viewer: Cesium.Viewer): { lat: number, lng: number } => {
    if (!position || !viewer) {
      console.error("Invalid position or viewer.");
      return { lat: 0, lng: 0 };
    }

    const ellipsoid = viewer.scene.globe.ellipsoid;
    const cartographic = ellipsoid.cartesianToCartographic(position);

    if (!cartographic) {
      console.error("Failed to convert Cartesian to Cartographic.");
      return { lat: 0, lng: 0 };
    }

    const lat = Cesium.Math.toDegrees(cartographic.latitude);
    const lng = Cesium.Math.toDegrees(cartographic.longitude);

    return { lat, lng };
  };

  const drawLines = useCallback((clock: any) => {
    if (firstTick) {
      //因为clock.onTick会比timeline晚调用，所以重置一下
      cesiumRef.current!.clock.shouldAnimate = true; // 启动时钟动画
      cesiumRef.current!.clock.currentTime = cesiumRef.current!.clock.startTime;
      firstTick = false;
    }
    const time = clock.currentTime;
    const position = primitivesPositionProperty.getValue(time);
    if (!position) {
      // cesiumRef.current!.zoomTo(dataSourceRef.current)
      cesiumRef.current!.clock.onTick.removeEventListener(drawLines);
      enableTimelineInteractions('.cesium-viewer-timelineContainer');
      return
    }
    // 更新 Billboard 的位置
    runnerBillboard!.position = position;
    // 画线
    animationPositions.push(position)

    if (animationPositions.length > 2) {
      dynamicPolyline!.positions = animationPositions;
    } else {
      console.warn("Animation positions do not have enough points to render a line.");
    }

    cesiumRef.current!.scene.requestRender(); // 强制更新渲染
    const { lat, lng } = cartesianToDegrees(position, cesiumRef.current!)
    onSetCameraView(lng, lat)
  }, [])
  const clearPathLine = async () => {
    cesiumRef.current!.scene.requestRenderMode = true; // 启用手动渲染模式

    //清除原有的entities
    cesiumRef.current!.entities.removeAll(); //清理所有实体
    animationPositions.length = 0; //// 清空路径数据
    entitiesPositionProperty = new Cesium.SampledPositionProperty(); // 重置位置属性

    //清除primitives和PolylineCollection
    cesiumRef.current!.clock.onTick.removeEventListener(drawLines); //停止动态路径更新
    primitivesPositionProperty = new Cesium.SampledPositionProperty(); // 重置位置属性
    if (polylineCollection) {
      cesiumRef.current!.scene.primitives.remove(polylineCollection);
      polylineCollection = null;
      dynamicPolyline = null
    }

    // 从 primitives 移除
    if (billboardCollection) {
      // 清空引用
      cesiumRef.current!.scene.primitives.remove(billboardCollection);
      billboardCollection = null;
      runnerBillboard = null;
    }


    cesiumRef.current!.scene.requestRender(); // 确保渲染更新
  }
  const initPathLine = async () => {
    //清除原有的entities和primitives
    await clearPathLine();
    if (renderStyle === 1) {
      initPathLineByPrimitives();
    } else if (renderStyle === 2) {
      initPathLineByEntites();
    } else {
      //do nothing
    }
  }
  // 方法一 entities + CallbackProperty
  const initPathLineByEntites = () => {
    //将 js 日期对象（Date）转换为 Cesium.JulianDate 格式。
    const startTime = Cesium.JulianDate.fromDate(new Date());
    //Cesium.JulianDate.addSeconds(起始时间，间隔时长，存储结果的目标对象)
    let stopTime = Cesium.JulianDate.addSeconds(startTime, animationTime, new Cesium.JulianDate())

    cesiumRef.current!.clock.startTime = startTime.clone();
    cesiumRef.current!.clock.currentTime = startTime.clone();
    cesiumRef.current!.clock.stopTime = stopTime.clone();
    //clockRange: 1.LOOP_STOP(循环) 2.UNBOUNDED(继续读秒) 3.CLAMPED(限制时间轴范围)
    cesiumRef.current!.clock.clockRange = Cesium.ClockRange.CLAMPED; // 限制时间轴范围
    // 时间速率，数字越大时间过的越快
    cesiumRef.current!.clock.multiplier = 1;
    // 时间轴
    cesiumRef.current!.timeline.zoomTo(startTime, stopTime); //设置事件轴开始点和结束点
    // cesiumRef.current!.timeline._makeTics = () => { }; // 禁用时间轴交互
    // cesiumRef.current!.timeline._makeTics = Cesium.Timeline.prototype._makeTics; // 恢复时间轴交互

    //获得总长度
    const pathLengths = calculatePathLengths(positions)
    const totalDistance = pathLengths[positions.length - 1]
    //获得前进速度
    const scale = totalDistance / animationTime

    //获得每一段时间
    const timeArr = pathLengths.map((length: number) => length / scale);

    //移动轨迹时,先禁止移动时间轴
    disableTimelineInteractions('.cesium-viewer-timelineContainer')
    const positionsLen = positions.length;
    for (let i = 0; i < positionsLen; i++) {
      let time = Cesium.JulianDate.addSeconds(startTime, timeArr[i], new Cesium.JulianDate)
      let position = positions[i]
      //添加位置，和时间对应:为每个时间点添加一个位置样本
      entitiesPositionProperty.addSample(time, position)
    }
    //确保stopTime有采样点,防止边界问题
    entitiesPositionProperty.addSample(stopTime, positions[positionsLen - 1]);
    // 添加跑步的小人
    // 添加一个实体(Entity), 小人通过billboard图像显示,路径通过CallbackProperty动态更新
    // CallbackProperty: 一个动态属性，值会随着时间动态变化。
    const runnerEntity = cesiumRef.current!.entities.add({
      //Cesium.CallbackProperty；这是 Cesium 中用于动态绑定值的机制，它会随着场景时间 (time) 的变化自动调用
      position: new Cesium.CallbackProperty((time) => {
        //positionProperty.getValue(time):获取对应时间的动态位置
        // 获取当前时间对应的动态位置
        const currentPosition = entitiesPositionProperty.getValue(time) as Cesium.Cartesian3;
        if (!currentPosition) return undefined; // 确保位置有效
        const { lng, lat } = cartesianToDegrees(currentPosition, cesiumRef.current!)
        return Cesium.Cartesian3.fromDegrees(lng, lat, 0);
      }, false) as Cesium.CallbackPositionProperty,
      billboard: {
        image: runnerImg, // 小人图片
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        width: 20,
        height: 20,
        disableDepthTestDistance: Number.POSITIVE_INFINITY, // 防止被遮挡
      },
    });
    const airModel = loaderAirModel();
    const airEntity = cesiumRef.current!.entities.add(airModel);

    cesiumRef.current!.trackedEntity = airEntity;
    const videoElement = document.getElementById('trailer') as HTMLVideoElement
    const ellipsoidEntity = cesiumRef.current!.entities.add({
      position: new Cesium.CallbackProperty((time) => {
        //positionProperty.getValue(time):获取对应时间的动态位置
        // 获取当前时间对应的动态位置
        const currentPosition = entitiesPositionProperty.getValue(time) as Cesium.Cartesian3;
        if (!currentPosition) return undefined; // 确保位置有效
        const { lng, lat } = cartesianToDegrees(currentPosition, cesiumRef.current!)
        return Cesium.Cartesian3.fromDegrees(lng, lat, 50);
      }, false) as Cesium.CallbackPositionProperty,
      ellipsoid: {
        radii: new Cesium.Cartesian3(10, 10, 10),
        material: new Cesium.ImageMaterialProperty({ // 3D 球体
          image: videoElement, // 设置视频源
        }),
      },
    })

    //动态添加路径动画
    const redLine = cesiumRef.current!.entities.add({
      polyline: {
        // This callback updates positions each frame.
        positions: new Cesium.CallbackProperty(function (time, result) {
          return animationPositions
        }, false),
        width: 5,
        // material: Cesium.Color.RED,
        clampToGround: true, // 将线绑定到地形表面,防止被地图遮挡
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 2, // 设置发光强度
          color: Cesium.Color.RED// 设置发光颜色
        })
      } as any,
    })
    // cesiumRef.current!.clock.onTick.addEventListener(()=>{})：
    // 为每一帧（tick）添加回调，用于动态更新路径
    let firstTick = true;

    cesiumRef.current!.clock.onTick.addEventListener(function onTick(clock: any) {
      const curTime = clock.currentTime;
      const position = entitiesPositionProperty.getValue(curTime) as Cesium.Cartesian3
      if (firstTick) {
        cesiumRef.current!.clock.shouldAnimate = true; // 启动时钟动画
        cesiumRef.current!.clock.currentTime = Cesium.JulianDate.clone(startTime);
        firstTick = false;
      }
      if (Cesium.JulianDate.equals(clock.stopTime, curTime)) {
        enableTimelineInteractions('.cesium-viewer-timelineContainer');
        cesiumRef.current!.clock.onTick.removeEventListener(onTick);
        return
      }
      //画线
      animationPositions.push(position)

      const { lng, lat } = cartesianToDegrees(position, cesiumRef.current!)
      //摄像机角度更新

    })
  }
  // 方法二 scene.primitives.add 重复调用
  const initPathLineByPrimitives = () => {
    initBillboard()
    initPolylineCollection();
    disableTimelineInteractions('.cesium-viewer-timelineContainer')
    // 添加一些位置样本，包括时间和位置信息
    const startTime = Cesium.JulianDate.fromDate(new Date());
    let stop = Cesium.JulianDate.addSeconds(startTime, animationTime, new Cesium.JulianDate());

    cesiumRef.current!.clock.startTime = startTime.clone();
    // 设置时钟当前时间
    cesiumRef.current!.clock.currentTime = startTime.clone();
    // 设置始终停止时间
    cesiumRef.current!.clock.stopTime = stop.clone();
    // 时间速率，数字越大时间过的越快
    cesiumRef.current!.clock.multiplier = 1;
    // 时间轴
    cesiumRef.current!.timeline.zoomTo(startTime, stop);
    cesiumRef.current!.clock.shouldAnimate = true;
    cesiumRef.current!.scene.globe.depthTestAgainstTerrain = true; //禁用深度测试,防止线条被遮挡

    const pathLengths = calculatePathLengths(positions)
    const totalDis = pathLengths[positions.length - 1]
    const scale = totalDis / animationTime

    const timeArr = pathLengths.map((length: number) => length / scale);
    for (let i = 0; i < positions.length; i++) {
      let time = Cesium.JulianDate.addSeconds(startTime, timeArr[i], new Cesium.JulianDate);
      let position = positions[i];
      // 添加位置，和时间对应
      primitivesPositionProperty.addSample(time, position);
    }

    cesiumRef.current!.clock.onTick.addEventListener(drawLines);
  }

  //加载地标信息
  const drawPoints = () => {
    // 加载GeoJSON数据
    Cesium.GeoJsonDataSource.load('/GeoJSON/run-record.geojson', {
      clampToGround: true
    }).then(function (dataSource) {
      //将加载的地标数据源添加到地图中。
      cesiumRef.current!.dataSources.add(dataSource);
      cesiumRef.current!.scene.requestRender(); // 强制渲染
      dataSourceRef.current = dataSource;

      //获取所有实体
      const entities = dataSource.entities.values;

      for (let i = 0; i < entities.length; i++) {
        const entity: Cesium.Entity = entities[i];

        //获取属性
        const name = entity.properties!.Name.getValue();
        //创建标签
        entity.label = new Cesium.LabelGraphics({
          text: name, // 显示名称
          font: new Cesium.ConstantProperty('20px sans-serif'),
          style: new Cesium.ConstantProperty(Cesium.LabelStyle.FILL),
          fillColor: new Cesium.ConstantProperty(Cesium.Color.WHITE),
          pixelOffset: new Cesium.CallbackProperty(() => new Cesium.Cartesian2(0, -75), false), //偏移量
          showBackground: new Cesium.ConstantProperty(true),
          backgroundColor: new Cesium.ConstantProperty(new Cesium.Color(0.5, 0.6, 1, 1.0)),
          disableDepthTestDistance: Number.POSITIVE_INFINITY, // 设置正无穷 (Number.POSITIVE_INFINITY)，标签将始终显示在前方,防止被地图遮挡
        });
        //创建地标图标，设置图片、尺寸
        entity.billboard = new Cesium.BillboardGraphics({
          image: positionImg,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          width: 60,
          height: 60,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        });
      }
    }).catch(function (error) {
      console.error(error);
    })
  }
  const initCesium = async (generateLines?: (() => void)) => {
    if (cesiumRef.current) return; // 避免重复初始化
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmZGI4NzUxMi0yOTEyLTQ0YTAtOTliNC1iMGIxNjQ3MmMyZDgiLCJpZCI6MjY0NjQ2LCJpYXQiOjE3MzUwNDYyMDN9.n-O-T_nwy6vFQchyzxipwLga7lTjmduDXsBzd8LLO4Y';
    // 设置相机的默认视图矩形
    // Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    //   75.0, // 左经度（西边界）
    //   0.0, // 下纬度（南边界）
    //   140.0, // 右经度（东边界）
    //   60.0 // 上纬度（北边界）
    // );

    // 设置相机的默认视图高度
    // Cesium.Camera.DEFAULT_VIEW_FACTOR = 0.5;
    // 初始化Cesium
    cesiumRef.current = new Cesium.Viewer('cesiumContainer', {
      baseLayerPicker: true, //展示风格选择器
      timeline: true, //时间线展示
      homeButton: false, //主页按钮：展示整个地球
      fullscreenButton: false,//全屏展示
      sceneModePicker: false, //场景展示选择器
      navigationInstructionsInitiallyVisible: false, //控制导航帮助说明的初始显示状态。
      navigationHelpButton: false, //帮助按钮
      animation: false, //控制时间线动画控件的显示。
      shouldAnimate: false, //控制 Viewer 是否自动播放时间动画。
      ///*在给cesium使用html2canvas插件加截图保存控件时，提示错误Blocked script execution in 'about:blank' because the document's frame is sandboxed and the 'allow-scripts' permission is not set.*/
      infoBox: false,
      creditContainer: document.createElement('div'),// 创建一个空的 div 隐藏版权信息
      terrain: Cesium.Terrain.fromWorldTerrain()
    })
  }
  const changeOsmBulidingsTilesetStyle = () => {
    osmBuildings!.style = new Cesium.Cesium3DTileStyle({
      defines: {
        distanceFromComplex:
          "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(144.96007, -37.82249))",
      },
      color: {
        conditions: [
          ["${distanceFromComplex} > 0.010", "color('#d65c5c')"],
          ["${distanceFromComplex} > 0.006", "color('#f58971')"],
          ["${distanceFromComplex} > 0.002", "color('#f5af71')"],
          ["${distanceFromComplex} > 0.0001", "color('#f5ec71')"],
          ["true", "color('#ffffff')"],
        ],
      },
    });
  }

  const addMouseHoverAction = () => {
    let originalColor: Cesium.Color; // 存储原始颜色
    cesiumRef.current!.scene.postProcessStages.add(
      Cesium.PostProcessStageLibrary.createSilhouetteStage([
        silhouetteBlue,
      ]),
    );
    cesiumRef.current!.screenSpaceEventHandler.setInputAction(function onMouseMove(movement: { endPosition: Cesium.Cartesian2; }) {
      silhouetteBlue.selected = [] //清空之前的选中
      const pickedFeature = cesiumRef.current!.scene.pick(movement.endPosition); //// 获取鼠标悬停位置的特征
      if (!Cesium.defined(pickedFeature)) {
        return;
      }

      if (pickedFeature !== selected.feature) {
        // 恢复之前建筑的颜色
        if (selected.feature && Cesium.defined(selected.feature)) {
          (selected.feature as Cesium.Cesium3DTileFeature).color = selected.originalColor; // 恢复颜色
          selected.feature = null;
        }

        silhouetteBlue.selected = [pickedFeature];
        selected.feature = pickedFeature;
        // 修改特定建筑的材质或颜色
        if (pickedFeature instanceof Cesium.Cesium3DTileFeature) {
          selected.originalColor = pickedFeature.color; // 存储原始颜色
          pickedFeature.color = Cesium.Color.RED;
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  };
  const onLoadOSM = async () => {
    // 加载OSM建筑
    await addWorldTerrainAsync(cesiumRef.current!);
    await addOsmBuildingsAsync(cesiumRef.current!);
    cesiumRef.current!.camera.lookAt(
      new Cesium.Cartesian3.fromDegrees(144.96007, -37.82249),
      new Cesium.Cartesian3(0.0, -1500.0, 1200.0)
    );

    addMouseHoverAction()
  }

  const addWorldTerrainAsync = async (viewer: Cesium.Viewer) => {
    try {
      const terrainProvider = await Cesium.createWorldTerrainAsync({ requestVertexNormals: true, requestWaterMask: true, });
      viewer.terrainProvider = terrainProvider;
    } catch (error) {
      console.log(`${error}`);
    }
  };
  const addOsmBuildingsAsync = async (viewer: Cesium.Viewer) => {
    try {
      //加载cesium默认建筑模型
      osmBuildings = await Cesium.createOsmBuildingsAsync();
      viewer.scene.primitives.add(osmBuildings);
    } catch (error) {
      console.log(`${error}`);
    }
  }
  const goDirection = () => {
    // flyTo 方法会自动平滑移动到目标位置，提供动画效果。
    // 如果需要直接跳到目标位置而没有动画，可以使用 camera.setView 方法。
    cesiumRef.current!.camera.flyTo({
      // 这是相机飞行的目标位置，使用 Cesium.Cartesian3.fromDegrees 方法将经纬度和高度转换为三维笛卡尔坐标。

      // 114.31205: 经度（单位：度）。
      // 30.5341: 纬度（单位：度）。
      // 900: 高度（单位：米），相对于地球表面的高度。
      // 目标位置是 （121.4737, 31.2304） 的地球坐标点，位于距离地面 1000 米的高度。
      // 'destination': Cesium.Cartesian3.fromDegrees(SPORT_DATA[0]['longitude'], SPORT_DATA[0]['latitude'], 2000),
      destination: Cesium.Cartesian3.fromDegrees(SPORT_DATA[0]['longitude'], SPORT_DATA[0]['latitude'], 2000), // 高度为 1000 米
      // destination: Cesium.Cartesian3.fromDegrees(pathLine[0][0], pathLine[0][1], pathLine[0][2] + 2000), // 高度为 1000 米
      orientation: {
        heading: Cesium.Math.toRadians(0), //表示相机的水平旋转角度（朝向），以弧度为单位。0.0 表示正北方向。90.0 度（东）180.0 度（南）270.0 度（西）
        pitch: Cesium.Math.toRadians(-90.0), //表示相机的俯仰角（垂直方向），以弧度为单位;负值表示向下看（俯视）;正值表示向上看（仰视）。0.0 表示水平看;-90.0表示正向下
      },
      duration: 6.0, // 动画时间，单位秒
      complete: function () {
        console.log('飞行完成')
      },
      cancel: function () {
        console.log('飞行取消')
      },
      easingFunction: Cesium.EasingFunction.QUADRATIC_OUT //缓动函数，控制飞行速度
    })
  }
  const onChangeRenderStyle = (e: RadioChangeEvent) => {
    setRenderStyle(e.target.value);
  }
  const onSetCameraView = (lng: number, lat: number, height: number = 1000) => {
    if (!cesiumRef.current) {
      return
    }
    const orientation = {
      heading: Cesium.Math.toRadians(0), // 方位角，以正北为0度，顺时针旋转
      pitch: Cesium.Math.toRadians(-90), // 俯仰角，向下为正
      roll: 0.0 // 翻滚角
    }
    cesiumRef.current!.scene.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(lng, lat, height),
      orientation
    })
  }
  const onClearCesium = () => {
    destroyViewer()
    initCesium()
  }
  const destroyViewer = () => {
    if (cesiumRef.current) {
      cesiumRef.current.destroy(); // 销毁整个 Viewer 实例
      cesiumRef.current = null;   // 释放引用
    }
  }
  const loaderAirModel = () => {
    const airModel = {
      //availability:定义了该实体的时间可用性，即模型在那些时间内可见
      // availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({ start: start, stop: stop })]),
      // position: entitiesPositionProperty,
      // position: new Cesium.CallbackProperty(function(time) {
      //   // 假设 entitiesPositionProperty 是经纬度数据，缺少高度
      //   const curPosition = entitiesPositionProperty.getValue(time);  // 获取经纬度（longitude, latitude）
      //   return new Cesium.Cartesian3(curPosition[0], curPosition[1], 200);  // 使用默认高度
      // }, false),
      position: new Cesium.CallbackProperty((time) => {
        //positionProperty.getValue(time):获取对应时间的动态位置
        // 获取当前时间对应的动态位置
        const currentPosition = entitiesPositionProperty.getValue(time);
        if (!currentPosition) return undefined; // 确保位置有效
        const { lng, lat } = cartesianToDegrees(currentPosition, cesiumRef.current!)
        return Cesium.Cartesian3.fromDegrees(lng, lat, 20);
      }, false) as Cesium.CallbackPositionProperty,
      model: {
        uri: '/3DModels/Cesium_Air.glb', // 带有骨骼动画的小人模型
        minimumPixelSize: 128, //设置模型的最小像素大小，即模型在屏幕上显示时的最小尺寸（以像素为单位
        maximumScale: 20000,
        runAnimations: true, // 启用模型动画
      },
      // Automatically compute the orientation from the position.
      // orientation:定义实体的朝向（旋转）
      // VelocityOrientationProperty是一个计算方向的属性，它通过计算实体位置属性的速度来自动生成实体的朝向
      // 如果 positionProperty 是动态的，VelocityOrientationProperty 会基于位置的速度计算出一个合适的朝向（例如，如果飞行器正在飞行，模型会朝向飞行的方向）。
      orientation: new Cesium.VelocityOrientationProperty(entitiesPositionProperty),
      // PathGraphics 是用于绘制实体路径的属性：设置了 3 像素
      path: new Cesium.PathGraphics({ width: 3 })
    }
    return airModel
  }
  useEffect(() => {
    initCesium();
    return () => {
      destroyViewer()
    }
  }, [])
  return (
    <div className={styles['cesium-page']}>
      <div className={styles['cesium-tools']}>
        <Row align="middle" gutter={8} style={{ marginTop: 6, marginBottom: 6 }}>
          <Col>
            <Radio.Group onChange={onChangeRenderStyle} value={renderStyle} style={{ 'display': 'none' }}>
              <Radio value={1}>Primitives</Radio>
              <Radio value={2}>Entities</Radio>
            </Radio.Group>
            <Button onClick={initPathLine} >
              生成运动轨迹
            </Button>
          </Col>
          <Col>
            <Button onClick={drawPoints}>生成标记地点</Button>
          </Col>
          <Col>
            <Button onClick={onGenerateEllipsoid}>展示球形视频</Button>
          </Col>
          <Col>
            <Button onClick={onGenerateAirModel}>展示Airplane模型</Button>
          </Col>
          <Col>
            <Button onClick={onLoadOSM}>加载OSM建筑</Button>
          </Col>
          <Col>
            <Button onClick={changeOsmBulidingsTilesetStyle}>修改颜色</Button>
          </Col>

          <Col>
            <Button onClick={goDirection}>跳转位置</Button>
          </Col>

          <Col>
            <Button onClick={onClearCesium}>清空</Button>
          </Col>
        </Row>
      </div>
      <div className={styles['cesium-container']}>
        <div id="cesiumContainer" className={styles['cesium-canvas']}></div>
        <video id="trailer" className={styles['cesium-video']} muted={true} autoPlay={true} loop={true} crossOrigin="" controls={true}>
          <source src="https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.webm" type="video/webm" />
          <source src="https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mp4" type="video/mp4" />
          <source src="https://cesium.com/public/SandcastleSampleData/big-buck-bunny_trailer.mov" type="video/quicktime" />
          Your browser does not support the <code>video</code> element.
        </video>
      </div>
    </div>
  )
}
export default MapCesium
