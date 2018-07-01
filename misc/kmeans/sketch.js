// Number of clusters
let K = 4;
// Number of datapoints
let n = 150;
// datapoints
let points = [];
let centres = [];

function setup() {
	createCanvas(500,500);
	rectMode(CENTER)

	let centre_indices = [];
	// Choose n random points
	for (let i = 0; i < n; i++) {
		points.push({
			x: random(500),
			y: random(500),
			cluster: -1
		});	
		// Build array of sequential integers for use in selecting cluster centres
		centre_indices.push(i);
	}

	// Choose K points to act as cluster centres
	for (let i = 0; i < (n - K); i++) {
		centre_indices.splice(int(random(0, centre_indices.length)),1);
	}

	// Set the cluster centres
	for (let i = 0; i < K; i++) {
		let p = points[centre_indices[i]];
		p.cluster = centres.length;
		console.log(centres);
		p.population = 0;
	 	centres.push(p);
	}
	

	frameRate(3);
}

function draw() {
	colorMode(HSB);
	background(10);
	noStroke();

	// Draw points as circles and cluster centres as rectangles
	for (let i = 0; i < points.length; i++) {
		fill((255 / (K+1)) + points[i].cluster * (255 / (K+1)), 120, 120);
		ellipse(points[i].x, points[i].y, 7, 7);
	}
	for (let i = 0; i < centres.length; i++) {
		fill((255 / (K+1)) + centres[i].cluster * (255 / (K+1)), 120, 120);
		rect(centres[i].x, centres[i].y, 7, 7);
		centres[i].population = 0;
	}

	// Recalculate centres
	for (let i = 0; i < points.length; i++) {
		record_dist = Infinity;
		for (let j = 0; j < centres.length; j++) {
			let dist = distance(points[i], centres[j]);
			if (dist < record_dist) {
				points[i].cluster = j;
				record_dist = dist;
			}
		}

		centres[points[i].cluster].population++;
	}

	// Reset centres
	for (let i = 0; i < centres.length; i++) {
		centres[i].x = 0;
		centres[i].y = 0;
	}

	// Set centres to mean of all points in its cluster
	for (let i = 0; i < points.length; i++) {
		let cluster_population = centres[points[i].cluster].population;
		centres[points[i].cluster].x += (points[i].x / cluster_population);
		centres[points[i].cluster].y += (points[i].y / cluster_population);  
	}

}

// Returns euclidean distance between two points (p1, p2)
function distance(p1, p2) {
	return sqrt(pow((p1.x - p2.x), 2) + pow((p1.y - p2.y), 2));
}