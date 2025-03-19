<template>
	<div class="about">
		<div class="container">
			<div class="page-content">
				<h1 class="text-center mb-5">About MEVN Shop</h1>

				<div class="row">
					<div class="col-md-6 mb-4">
						<img src="https://picsum.photos/id/180/600/400" alt="About Us" class="img-fluid rounded">
					</div>
					<div class="col-md-6">
						<h2>Who are we?</h2>
						<p>MEVN Shop is the leading online platform in Vietnam for buying and selling premium accounts for entertainment, learning, and online tools at the best prices in the market.</p>
						<p>Founded in 2022, MEVN Shop has served over 10,000 customers and provided more than 50,000 accounts for popular online services such as Netflix, Spotify, Coursera, and many others.</p>
						<p>We pride ourselves on being a trusted partner to customers, providing high-quality accounts with dedicated support.</p>
					</div>
				</div>

				<div class="row mt-5">
					<div class="col-md-12">
						<h2 class="text-center mb-4">Our Mission</h2>
						<p class="text-center">MEVN Shop's mission is to provide customers with a secure, convenient, and cost-effective online account shopping experience. We are committed to providing high-quality service at reasonable prices, ensuring customer satisfaction in every transaction.</p>
					</div>
				</div>

				<div class="row mt-5">
					<div class="col-md-4 mb-4">
						<div class="card h-100">
							<div class="card-body text-center">
								<i class="huge handshake icon text-primary mb-3"></i>
								<h4 class="card-title">Trustworthy</h4>
								<p class="card-text">We always prioritize trust and are committed to providing the highest quality service to our customers.</p>
							</div>
						</div>
					</div>
					<div class="col-md-4 mb-4">
						<div class="card h-100">
							<div class="card-body text-center">
								<i class="huge shield alternate icon text-primary mb-3"></i>
								<h4 class="card-title">Safety & Security</h4>
								<p class="card-text">All transactions on MEVN Shop are secure, and we are committed to protecting customers' personal information.</p>
							</div>
						</div>
					</div>
					<div class="col-md-4 mb-4">
						<div class="card h-100">
							<div class="card-body text-center">
								<i class="huge headset icon text-primary mb-3"></i>
								<h4 class="card-title">24/7 Support</h4>
								<p class="card-text">Our support team is always available to help you anytime, anywhere. We guarantee fast responses.</p>
							</div>
						</div>
					</div>
				</div>

				<div class="row mt-5">
					<div class="col-md-12">
						<h2 class="text-center mb-4">Our Team</h2>
					</div>
				</div>

				<div class="row">
					<div class="col-md-3 mb-4" v-for="(member, index) in teamMembers" :key="index">
						<div class="card h-100 team-card">
							<img :src="member.avatar" class="card-img-top team-avatar" :alt="member.name">
							<div class="card-body text-center">
								<h5 class="card-title">{{ member.name }}</h5>
								<p class="card-text text-muted">{{ member.position }}</p>
							</div>
						</div>
					</div>
				</div>

				<div class="row mt-5">
					<div class="col-md-12 text-center">
						<h2 class="mb-4">Contact Us</h2>
						<p>If you have any questions or requests, please contact us via:</p>
						<p><i class="envelope icon"></i> Email: info@mevnshop.vn</p>
						<p><i class="phone icon"></i> Hotline: 0123.456.789</p>
						<p><i class="map marker alternate icon"></i> Address: 123 ABC Street, XYZ District, HCMC</p>

						<div class="mt-4">
							<router-link to="/contact" class="btn btn-primary btn-lg">
								<i class="envelope icon"></i> Send us a message
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'About',
	data() {
		return {
			// Team members data
			teamMembers: [
				{
					name: 'Nguyễn Văn A',
					position: 'CEO & Founder',
					avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
				},
				{
					name: 'Trần Thị B',
					position: 'CTO',
					avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
				},
				{
					name: 'Lê Văn C',
					position: 'Marketing Director',
					avatar: 'https://randomuser.me/api/portraits/men/68.jpg'
				},
				{
					name: 'Phạm Thị D',
					position: 'Customer Support',
					avatar: 'https://randomuser.me/api/portraits/women/90.jpg'
				}
			]
		}
	}
}
</script>

<style scoped>
.about h1, .about h2 {
	color: #2c3e50;
}

.team-avatar {
	height: 200px;
	object-fit: cover;
}

.team-card {
	transition: transform 0.3s;
}

.team-card:hover {
	transform: translateY(-5px);
}

@media (max-width: 768px) {
	.team-avatar {
		height: 250px;
	}
}
</style>
