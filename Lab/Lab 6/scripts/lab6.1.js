var w = 500; // Width of the chart
var h = 300; // Height of the chart
var padding = 50; // Padding for axes

// Initial dataset
var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];
var maxValue = 30; // Define the maximum value for random dataset

// Create scales
var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length)) // Set the domain based on the number of values
    .rangeRound([padding, w - padding])
    .paddingInner(0.1);  // Padding between the bars

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
    .attr("fill", "slategrey")
    // Add mouseover and mouseout event handlers
    .on("mouseover", function(event, d) {
        // Get x and y positions of the current bar
        var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2; // Center the text above the bar
        var yPosition = parseFloat(d3.select(this).attr("y")) + 15; // Position slightly inside the bar

        // Change the bar color
        d3.select(this)
            .transition() // Smooth transition on hover
            .duration(200)
            .attr("fill", "orange"); // Change color on hover

        // Append the text to display the value
        svg1.append("text")
            .attr("id", "tooltip")
            .attr("x", xPosition) // Center above the bar
            .attr("y", yPosition) // Position inside the bar
            .attr("text-anchor", "middle") // Center the text
            .attr("fill", "black") // Set the text color
            .style("font-size", "12px") // Set font size
            .style("font-weight", "bold") // Make the text bold
            .text(d); // Display the value
    })
    .on("mouseout", function(event, d) {
        // Return the color back to grey
        d3.select(this)
            .transition() // Smooth transition when mouse leaves
            .duration(200)
            .attr("fill", "slategrey"); // Revert to original color

        // Remove the tooltip text
        svg1.select("#tooltip").remove();
    });

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
    var newNum = Math.floor(Math.random() * maxValue);
    dataset.push(newNum); // Add a new random value to the dataset
}

// Function to update chart with staggered animation and consistent bar padding
function updateWithAnimation() {
    updateData(); // Add new data

    // Update xScale domain to include the new data length
    xScale.domain(d3.range(dataset.length));

    // Update yScale domain if needed
    yScale.domain([0, d3.max(dataset)]);

    // Bind the new dataset to rectangles
    var bars = svg1.selectAll("rect")
        .data(dataset);

    // Handle the update transition for existing bars
    bars.transition()
        .delay(function(d, i) { return i * 100; }) // Delay each bar by 100ms * index
        .duration(800)
        .ease(easingFunction) // Use the selected easing function
        .attr("x", function(d, i) {
            return xScale(i); // Update x position for all bars
        })
        .attr("y", function(d) {
            return yScale(d); // Update y position for all bars
        })
        .attr("width", xScale.bandwidth()) // Update width according to new xScale
        .attr("height", function(d) {
            return h - padding - yScale(d); // Update height based on yScale
        });

    // Enter new bars for the added data
    bars.enter()
        .append("rect")
        .attr("x", w) // Start off to the right of the chart
        .attr("y", h - padding) // Start from the bottom (off the chart)
        .attr("width", xScale.bandwidth())
        .attr("height", 0) // Start with zero height
        .attr("fill", "slategrey")
        .on("mouseover", function(event, d) {
            var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2;
            var yPosition = parseFloat(d3.select(this).attr("y")) + 15; // Position slightly inside the bar

            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "orange");

            svg1.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .style("font-size", "12px")
                .style("font-weight", "bold") // Make the text bold
                .text(d);
        })
        .on("mouseout", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "slategrey");

            svg1.select("#tooltip").remove();
        })
        .transition() // Add the transition for the new bars
        .duration(800)
        .ease(easingFunction)
        .attr("x", function(d, i) {
            return xScale(i); // Transition to the correct x position
        })
        .attr("y", function(d) {
            return yScale(d); // Transition to the correct y position
        })
        .attr("height", function(d) {
            return h - padding - yScale(d); // Transition to the correct height
        });

    // Update the x and y axes
    svg1.select(".x-axis").transition().duration(800).call(xAxis);
    svg1.select(".y-axis").transition().duration(800).call(yAxis);
}

// Function to remove the last data point and update the chart
function removeData() {
    if (dataset.length > 0) {
        dataset.pop(); // Remove the last data point

        // Update xScale domain to account for the reduced data length
        xScale.domain(d3.range(dataset.length));

        // Bind the updated dataset to rectangles
        var bars = svg1.selectAll("rect")
            .data(dataset);

        // Transition existing bars to new positions
        bars.transition()
            .delay(function(d, i) { return i * 100; })
            .duration(800)
            .ease(easingFunction)
            .attr("x", function(d, i) {
                return xScale(i); // Update x position
            });

        // Transition the exiting bars out
        bars.exit()
            .transition()
            .duration(800)
            .attr("x", w) // Move exiting bars off the chart
            .remove(); // Remove the bars from the DOM

        // Update the x and y axes
        svg1.select(".x-axis").transition().duration(800).call(xAxis);
        svg1.select(".y-axis").transition().duration(800).call(yAxis);
    }
}

// Handle add button click to add new data and animate the chart
d3.select("#addBtn").on("click", updateWithAnimation);

// Handle remove button click to remove the last data point
d3.select("#removeBtn").on("click", removeData);
