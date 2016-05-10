OpenLayers2 Geometry with node.js
=========

A small library providing OpenLayers2 Geometry functions to node.js applications. I needed to have simple way of checking if cordinates are inside polygon and some basic projections, so I twekead the OpenLayers2 code a bit in order it to work without browser. If you wish to extend this to have more OL classes, please make a pull request.

## Installation

  npm install openlayers-geometry --save

## Usage
Require it first:

  var OpenLayers = require('openlayers-geometry').OpenLayers;

Then use as you would on frontend:

  var olpoint = new OpenLayers.Geometry.Point(layerCoords[0], layerCoords[1]);

## Release History

* 1.0.0 Initial release
