import React from 'react';
import { Clock, Filter, Target, Smartphone, MapPin, UserRound, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
	{
		title: 'Expert Mutual Fund Management',
		description:
			'Professional management of your mutual fund portfolio with proven track record.',
		icon: PieChart,
	},
	{
		title: 'For Serious Investors',
		description:
			'Strategies calibrated for wealth preservation & mid-life growth needs.',
		icon: UserRound,
	},
	{
		title: 'Smart Timing',
		description: 'We called the exits that mattered—2008, 2020, 2024.',
		icon: Clock,
	},
	{
		title: 'Focused Universe',
		description: 'Just the best 15 AMCs; no "flavour-of-the-month" clutter.',
		icon: Filter,
	},
	{
		title: 'High-Ticket Strategy',
		description: 'Designed for significant deployments, not micro SIPs.',
		icon: Target,
	},
	{
		title: 'Transparent Tech',
		description: 'Watch every rupee grow in our secure iOS / Android / Web app.',
		icon: Smartphone,
	},
	{
		title: 'Local & Personal',
		description: 'Delhi-NCR meetings, quarterly coffee catch-ups on us.',
		icon: MapPin,
	},
];

const Features = () => {
	const [visibleItems, setVisibleItems] = React.useState<number[]>([]);

	React.useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const id = Number(entry.target.getAttribute('data-index'));
						setVisibleItems((prev) => [...prev, id]);
					}
				});
			},
			{ threshold: 0.1 }
		);

		document.querySelectorAll('.feature-item').forEach((item) => {
			observer.observe(item);
		});

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<section id="why-us" className="py-8 sm:py-12 md:py-20 bg-white">
			<div className="container mx-auto px-4 sm:px-6">
				<div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10 md:mb-16">
					<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blueumbrella-900 mb-3 sm:mb-4">
						Why Choose Us
					</h2>
					<p className="text-sm sm:text-base md:text-lg text-gray-600">
						Strategies designed for mature investors, focused on wealth
						preservation and growth.
					</p>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							data-index={index}
							className={cn(
								'feature-item bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-500',
								visibleItems.includes(index)
									? 'opacity-100 translate-y-0'
									: 'opacity-0 translate-y-10'
							)}
						>
							<div className="flex items-start">
								<div className="mr-3 sm:mr-4 p-2 bg-blueumbrella-50 rounded-lg text-blueumbrella-700">
									<feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
								</div>
								<div>
									<h3 className="text-lg sm:text-xl font-bold text-blueumbrella-900 mb-1 sm:mb-2">
										{feature.title}
									</h3>
									<p className="text-sm sm:text-base text-gray-600">
										{feature.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Features;
