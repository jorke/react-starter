import React, { useState, useEffect, useRef } from 'react'
import MapGL, { NavigationControl, GeolocateControl, Source, Layer } from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import { Auth } from 'aws-amplify'
import { createRequestTransformer } from '../util'
import 'maplibre-gl/dist/maplibre-gl.css'
import './index.css'

const region = process.env.AWS_REGION || 'ap-southeast-2'
const identityPoolId = process.env.COGNITO_IDENTITY_POOL || ''
const defaultMapStyle = process.env.DEFAULT_MAPSTYLE || 'esri_sat_public'

Auth.configure({
    Auth: {
      identityPoolId,
      region,
    }})

export default props => {
    const [credentials, setCredentials] = useState()
    const [transformRequest, setTransformRequest] = useState()
    const [mapStyle, setMapStyle] = useState(defaultMapStyle)
    
    const [viewport, setViewport] = useState({
      latitude: -33.856499,
      longitude: 151.215026,
      zoom: 8,
    })


    const mapRef = useRef()

    useEffect(() => {
        const getCredentials = async () => {
            const creds = await Auth.currentUserCredentials()
            setCredentials(creds)
        }
        getCredentials()
    }, [])

    useEffect(() => {
        const makeRequestTransformer = async () => {
          if (credentials != null) {
            const tr = await createRequestTransformer({
              credentials,
              region,
            })
    
            setTransformRequest(() => tr)
          }
        }
        makeRequestTransformer()
      }, [credentials])

    return transformRequest ? 
      <MapGL 
        initialViewState={viewport}
        ref={mapRef}
        mapLib={maplibregl}
        transformRequest={transformRequest}
        width='100vw'
        height='100vh'
        mapStyle={mapStyle}
        attributionControl={false}
        onViewportChange={v => setViewport(v)}

      >
       
        <NavigationControl style={{right:10, bottom: 20 }} showCompass={false} />
        <GeolocateControl
          style={{ right: 10, bottom: 85 }}
          positionOptions={{enableHighAccuracy: true}}
          trackUserLocation
          auto={false}
        />
      </MapGL>
      : 'loading...'
}

