<template>
  <div>
    <div id="allmap" style="width:100%; height:700px;"></div>
  </div>
</template>

<script>
// 引入百度地图
// import BMap from 'BMap';
export default {
  mounted() {
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(104.075796, 30.659684);
    map.centerAndZoom(point, 14);
    map.addControl(new BMap.MapTypeControl());
    map.enableScrollWheelZoom(true);
    map.enableDoubleClickZoom(true);
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    //   添加控件
    map.addControl(new BMap.NavigationControl());
    map.addControl(new BMap.ScaleControl());
    map.addControl(new BMap.OverviewMapControl());
    map.addControl(new BMap.MapTypeControl());
  }
};
</script>

<style>
</style>
