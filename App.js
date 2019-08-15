/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component, Fragment } from "react";
import Main from "./screen/main";
import {
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground
} from "react-native";
import Colors from "./res/color";

import MapView, {
  Circle,
  Polyline,
  Heatmap,
  Overlay,
  PROVIDER_GOOGLE,
  Polygon
} from "react-native-maps";

import ViewShot from "react-native-view-shot";
import { GeojsonMap } from "./screen/GeojsonMap";

console.disableYellowBox = true;
const { width, height } = Dimensions.get("window");

const OVERLAY_TOP_LEFT_COORDINATE = [35.68184060244454, 139.76531982421875];
const OVERLAY_BOTTOM_RIGHT_COORDINATE = [35.679609609368576, 139.76806640625];

let mmpoint = {
  latitude: OVERLAY_TOP_LEFT_COORDINATE[0],
  longitude: OVERLAY_TOP_LEFT_COORDINATE[1]
};

let mmark = {
  id: "thanhftes",
  coordinate: mmpoint,
  title: "checkkd",
  description: "get poin"
};

const mMap_Type = {
  standard: "standard",
  satellite: "satellite",
  hybrid: "hybrid",
  terrain: "terrain" //Android only
};
function log(eventName, e) {
  console.log(eventName, e.nativeEvent);
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      provider: PROVIDER_GOOGLE,
      showMap: true,
      coordArr: [],
      coorMids: [],
      region: {
        latitude: mmpoint.latitude,
        longitude: mmpoint.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121
      },
      camera: {
        center: mmpoint,
        pitch: 20,
        heading: 50,
        // Only on iOS MapKit, in meters. The property is ignored by Google Maps.
        altitude: 10,

        // Only when using Google Maps.
        zoom: 25
      },
      bounds: [
        [mmpoint.latitude + 0.015, mmpoint.longitude - 0.0121],
        [mmpoint.latitude - 0.015, mmpoint.longitude + 0.0121]
      ]
    };
  }

  mapView = null;
  onMarkerPress() {}

  onPressTouchable = () => {
    this.setState({
      showMap: !this.state.showMap
    });
    // this.refs.viewShot.capture().then(uri => {
    //   this.setState({
    //     uriImage: uri,
    //     showMap: !this.state.showMap
    //   });
    // });
  };

  componentDidMount() {}

  onRegionNewEnd = reg => {
    this.setState({
      region: reg,

      bounds: [
        [
          reg.latitude + reg.latitudeDelta * 2,
          reg.longitude - reg.longitudeDelta * 2
        ],
        [
          reg.latitude - reg.latitudeDelta * 2,
          reg.longitude + reg.longitudeDelta * 2
        ]
      ]
    });
  };

  OverlayWhite = () => {
    if (this.state.showMap) return;
    return (
      <Overlay
        image={require("./res/img/blank.png")}
        bounds={this.state.bounds}
      />
    );
  };

  addMarker = pressPoint => {
    let mr = this.state.coordArr.concat(pressPoint.nativeEvent.coordinate);
    let mm2 = [];
    //#region midPoints
    for (let i = 0; i < mr.length - 1; i++) {
      mm2.push({
        latitude: (mr[i].latitude + mr[i + 1].latitude) / 2,
        longitude: (mr[i].longitude + mr[i + 1].longitude) / 2
      });
    }
    //#region midPoint: end of poly
    if (mr.length % 2 === 0) {
      mm2.push({
        latitude: (mr[0].latitude + mr[mr.length - 1].latitude) / 2,
        longitude: (mr[0].longitude + mr[mr.length - 1].longitude) / 2
      });
    }
    //#region update state for rerender
    this.setState({
      coordArr: this.state.coordArr.concat(pressPoint.nativeEvent.coordinate),
      coorMids: this.state.coorMids.concat(mm2)
    });
  };

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />

        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text>thanh map</Text>
          </View>
          <ViewShot
            style={styles.map}
            ref="viewShot"
            options={{ format: "jpg", quality: 0.9 }}
          >
            <MapView
              zoomEnabled={false}
              ref="map"
              moveOnMarkerPress={false}
              mapType={mMap_Type.satellite}
              camera={this.state.camera}
              provider={this.state.provider}
              style={styles.map}
              region={this.state.region}
              onRegionChangeComplete={this.onRegionNewEnd}
              showsUserLocation={true}
              showsIndoors={true}
              zoomControlEnabled={true}
              onPress={this.addMarker}
            >
              {this.OverlayWhite()}
              {this.state.coordArr.map((val, index) => (
                <MapView.Marker
                  image={require("./res/img/battery.png")}
                  key={index}
                  draggable={true}
                  pinColor="red"
                  coordinate={val}
                />
              ))}
              {this.state.coordArr.length > 1 ? (
                <Polygon
                  coordinates={this.state.coordArr}
                  strokeColor="#f50"
                  strokeWidth={3}
                />
              ) : null}

              {this.state.coorMids.map((val, index) => (
                <MapView.Marker
                  key={index}
                  draggable={true}
                  pinColor="red"
                  coordinate={val}
                />
              ))}
            </MapView>
          </ViewShot>
          <View style={styles.footer}>
            <TouchableOpacity onPress={this.onPressTouchable}>
              <Image
                capInsets={{
                  top: 20,
                  left: 20,
                  bottom: 20,
                  right: 20
                }}
                sca
                style={styles.button}
                source={require("./res/img/avatar.png")}
              />
            </TouchableOpacity>
            <Text style={{ flex: 1, justifyContent: "flex-end" }}>
              {this.state.uriImage}
            </Text>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}
const styles = StyleSheet.create({
  engine: {
    position: "absolute",
    right: 0
  },
  scrollView: {
    backgroundColor: Colors.primary
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start"
  },
  map: {
    width: "100%",
    height: "100%",
    flex: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "flex-start"
  },
  footer: {
    flex: 1,
    flexDirection: "row"
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: "flex-start",
    alignContent: "stretch"
  }
});

export default App;
