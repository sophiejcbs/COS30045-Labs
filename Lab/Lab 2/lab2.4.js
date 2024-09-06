// Define the width and height for the SVG canvas
var w = 500; // Width of the SVG
var h = 125; // Height of the SVG

// Create the SVG canvas
var svg1 = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// Load CSV data and create the bar chart
d3.csv("Lab.2.4.csv").then(function(data) {
    console.log(data);
    wombatSightings = data;

    // Define the color scale
    var colorScale = d3.scaleLinear()
        .domain([0, d3.max(wombatSightings, function(d) { return +d.wombats; })]) // Domain based on data
        .range(["#e0f2f1", "#004d00"]); // Range from light green to dark green

    barChart(wombatSightings, colorScale);
}).catch(function(error){
    console.error("Error loading the CSV file:", error);
});

function barChart(wombatSightings, colorScale) {
    // Create bars
    svg1.selectAll("rect")
        .data(wombatSightings)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return i * (w / wombatSightings.length);
        })
        .attr("y", function(d) {
            return h - (d.wombats * 4); // Adjust y position to grow bars upwards
        })
        .attr("width", w / wombatSightings.length - 2) // Calculate width based on the number of bars
        .attr("height", function(d) {
            return d.wombats * 4; // Set height based on data
        })
        .attr("fill", function(d) {
            return colorScale(d.wombats); // Use the color scale to set the bar color
        });

    // Add text labels
    svg1.selectAll("text")
        .data(wombatSightings)
        .enter()
        .append("text")
        .text(function(d) {
            return d.wombats; // Display the data value
        })
        .attr("x", function(d, i) {
            return i * (w / wombatSightings.length) + (w / wombatSightings.length - 2) / 2; // Center text horizontally
        })
        .attr("y", function(d) {
            return h - (d.wombats * 4) + 15; // Position text slightly above the top of the bar
        })
        .attr("text-anchor", "middle") // Center text horizontally
        .attr("font-size", "12px") // Font size for the text
        .attr("fill", "white"); // Text color
}
