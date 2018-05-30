# arcgis-js-motion-module

<h3>Working Concept: 3 Days in Paris</h3>
<a href="https://nick-romano.github.io/arcgis-js-motion-module/">https://nick-romano.github.io/arcgis-js-motion-module/</a>

<h3>Justification</h3>
In Bertin’s Semiology of Graphics, he includes a section that he titles “GEO O: The representation of movement on the plane,” where he lists and provides a number of cartographic concepts related to achieving motion within a graphic. He introduces the principle types of movement: continuous motion, generation of points, lines or areas, variable speeds, and systems of relations (Bertin and Berg 2010). With just these types, a cartographer can visualize information from many different disciplines, for example - the movement of a person over time, the origin locations of individuals within a certain group, the migration of people over time, the flow and speed of traffic, the flow of weather and currents – the list goes on. Yet, there are very limited tools within popular mapping APIs to create these types of graphic representations. 

<h3> Description </h3>

- This is a module intended to be loaded into the ArcGIS for JavaScript API that allows user to create lovely animations of complex vector data, including time and velocity data.
- Can be loaded in with a simple require statement
- Similar lifecycle, properties, and methods, to those within esri JavaScript Classes
- Can accept geojson inputs and soon generic esri API graphics layer inputs
- Vectors are assigned velocities, and the speed of the animation on that line segment is based on the velocity
- Because it's handled through canvas, it can support a decent amount of concurrent instances

<h3> Technical Specifications </h3>

- Animations are handled in a single canvas overlayed adjacent/over the esri map canvas

<h3>Implementation</h3>

<h5>Data Requirements</h5>

<h5>Properties</h5>

| Property                | Type    | Required | Default    | Description                                                                          | 
|-------------------------|---------|----------|------------|--------------------------------------------------------------------------------------| 
| Source                  | Object  | Yes      | No default | This is the source for the data, currently only accepting geojson.                   | 
| SourceType              | String  | No       | GEOJSON    | Specified by user to tell the module how to read the source parameter.               | 
| View                    | Object  | Yes      | No Default | Current Map View object you need to insert the layer into                            | 
| Speed                   | Int     | Yes      | 0          | Specifies speed of transition                                                        | 
| Color                   | Object  | Yes      | No default | Will accept a dojo.color object to set color.                                        | 
| shadowBlur              | boolean | No       | FALSE      | adds shadow to line features, just cartographic preference                           | 
| labelField              | String  | No       | No default | Specify a label field to label start vertexes of each line segment, not required     | 
| catField (Experimental) | String  | No       | No default | Experimental. Sets colors based on specified field, basically a categorical renderer | 



- Coming soon.

<h3>Inspiration</h3>

- Animated Environment Layer : https://github.com/nickcam/AnimatedEnvironmentLayer
- Geotour : https://github.com/Esri/geotour-js
- Canvas-Flowmap-Layer : https://github.com/sarahbellum/Canvas-Flowmap-Layer

<h3> Outside Libraries</h3>

- ESRI JavaScript API
- Simplify.js https://github.com/mourner/simplify-js
