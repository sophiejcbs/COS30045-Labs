var w = 500; // Width of the chart
var h = 300; // Height of the chart
var padding = 50; // Padding for axes

// Initial dataset
var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];
var maxValue = 30; // Define the maximum value for random dataset
var numValues = dataset.length; // Keep the same length as the initial dataset

// Create scales
var xScale = d3.scaleBand()
    .domain(d3.range(numValues)) // Set the domain based on the number of values
    .rangeRound([padding, w - padding])
    .paddingInner(0.1);  // Reduced padding to make bars fit better

var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .rangeRound([h - padding, padding]);

// Create SVG element
var svg1 = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

// Draw the initial bars
svg1.selectAll("rect")
    .data(dataset)
    .join("rect")
    .attr("x", function(d, i) {
        return xScale(i);
    })
    .attr("y", function(d) {
        return yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
        return h - padding - yScale(d); // Adjust height to not overlap with x-axis
    })
    .attr("fill", "slategrey");

// Create the x-axis
var xAxis = d3.axisBottom(xScale)
    .tickFormat(function(d) { return d + 1; }); // Custom tick format

// Create the y-axis
var yAxis = d3.axisLeft(yScale);

// Append the x-axis to the SVG
svg1.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

// Append the y-axis to the SVG
svg1.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

// Add x-axis label
svg1.append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "middle")
    .attr("x", w / 2)
    .attr("y", h - 10);

// Add y-axis label
svg1.append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", 20)
    .attr("x", -h / 2);

// Default easing function
var easingFunction = d3.easeCubicInOut;

// Function to generate new random dataset
function updateData() {
    for (var i = 0; i < numValues; i++) {
        dataset[i] = Math.floor(Math.random() * maxValue);
    }
    yScale.domain([0, d3.max(dataset)]); // Update y-axis domain
}

// Function to update chart with staggered animation
function updateWithAnimation() {
    updateData();

    svg1.selectAll("rect")
        .data(dataset)
        .transition()
        .delay(function(d, i) { return i * 100; }) // Delay each bar by 100ms * index
        .duration(800)
        .ease(easingFunction) // Use the selected easing function
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("height", function(d) {
            return h - padding - yScale(d);
        });

    svg1.select(".y-axis").transition().duration(800).call(yAxis); // Update y-axis with transition
}

// Handle update button click to trigger default animation (rolling across)
d3.select("#updateBtn").on("click", updateWithAnimation);

// Handle Transition 1 button click (easeCircleOut)
d3.select("#trans1Btn").on("click", function() {
    easingFunction = d3.easeCircleOut;
});

// Handle Transition 2 button click (easeElasticOut)
d3.select("#trans2Btn").on("click", function() {
    easingFunction = d3.easeElasticOut;
});