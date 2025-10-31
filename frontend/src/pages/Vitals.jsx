import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Heart, Droplet, Thermometer } from "lucide-react";
import {
	LineChart,
	Line,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";
import { toast, Toaster } from "sonner";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { getUserVitals } from "../api/api";

const Vitals = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [vitals, setVitals] = useState([]);
	const [loading, setLoading] = useState(true);
	const [liveHeartRate, setLiveHeartRate] = useState(75);
	const [liveOxygenLevel, setLiveOxygenLevel] = useState(97);
	const [liveHeartRateData, setLiveHeartRateData] = useState([]);
	const [liveOxygenData, setLiveOxygenData] = useState([]);
	const hasNotifiedRef = useRef({ heartRate: false, oxygen: false });
	const dataPointCounter = useRef(0);

	// Critical thresholds
	const HEART_RATE_MIN = 60;
	const HEART_RATE_MAX = 100;
	const OXYGEN_MIN = 95;
	const MAX_DATA_POINTS = 20; // Show last 20 data points on live graph

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		const fetchVitals = async () => {
			try {
				const response = await getUserVitals(user._id);
				// Reverse to show oldest to newest in charts
				setVitals(response.data.reverse());
			} catch (error) {
				console.error("Error fetching vitals:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchVitals();
	}, [user, navigate]);

	// Live data simulation with notifications
	useEffect(() => {
		const interval = setInterval(() => {
			dataPointCounter.current += 1;
			const timeLabel = `${dataPointCounter.current}`;

			// Generate realistic heart rate variations
			const newHeartRate = Math.max(
				50,
				Math.min(120, liveHeartRate + (Math.random() - 0.5) * 8)
			);
			const roundedHeartRate = Math.round(newHeartRate);
			setLiveHeartRate(roundedHeartRate);

			// Generate realistic oxygen level variations
			const newOxygenLevel = Math.max(
				90,
				Math.min(100, liveOxygenLevel + (Math.random() - 0.5) * 2)
			);
			const roundedOxygenLevel = Math.round(newOxygenLevel);
			setLiveOxygenLevel(roundedOxygenLevel);

			// Update live graph data for heart rate
			setLiveHeartRateData((prevData) => {
				const newData = [
					...prevData,
					{ time: timeLabel, value: roundedHeartRate },
				];
				// Keep only last MAX_DATA_POINTS
				return newData.slice(-MAX_DATA_POINTS);
			});

			// Update live graph data for oxygen level
			setLiveOxygenData((prevData) => {
				const newData = [
					...prevData,
					{ time: timeLabel, value: roundedOxygenLevel },
				];
				// Keep only last MAX_DATA_POINTS
				return newData.slice(-MAX_DATA_POINTS);
			});

			// Check critical thresholds for heart rate
			if (
				(newHeartRate < HEART_RATE_MIN ||
					newHeartRate > HEART_RATE_MAX) &&
				!hasNotifiedRef.current.heartRate
			) {
				toast.error("Critical Alert: Abnormal Heart Rate!", {
					description: `Heart rate is ${roundedHeartRate} bpm. ${
						newHeartRate < HEART_RATE_MIN ? "Too low!" : "Too high!"
					}`,
					duration: 5000,
				});
				hasNotifiedRef.current.heartRate = true;
				setTimeout(() => {
					hasNotifiedRef.current.heartRate = false;
				}, 10000);
			}

			// Check critical thresholds for oxygen
			if (newOxygenLevel < OXYGEN_MIN && !hasNotifiedRef.current.oxygen) {
				toast.error("Critical Alert: Low Oxygen Level!", {
					description: `Oxygen saturation is ${roundedOxygenLevel}%. Below safe threshold!`,
					duration: 5000,
				});
				hasNotifiedRef.current.oxygen = true;
				setTimeout(() => {
					hasNotifiedRef.current.oxygen = false;
				}, 10000);
			}
		}, 2000); // Update every 2 seconds

		return () => clearInterval(interval);
	}, [liveHeartRate, liveOxygenLevel]);

	// Get latest vital for non-live cards
	const latestVital = vitals[vitals.length - 1];

	const vitalCards = [
		{
			title: "Heart Rate",
			value: liveHeartRate,
			unit: "bpm",
			icon: Heart,
			color: "from-red-500 to-pink-500",
			bgColor: "bg-red-50",
			textColor: "text-red-600",
			isLive: true,
		},
		{
			title: "Blood Pressure",
			value: latestVital?.bloodPressure || "--",
			unit: "mmHg",
			icon: Activity,
			color: "from-blue-500 to-cyan-500",
			bgColor: "bg-blue-50",
			textColor: "text-blue-600",
			isLive: false,
		},
		{
			title: "Oxygen Level",
			value: liveOxygenLevel,
			unit: "%",
			icon: Droplet,
			color: "from-green-500 to-emerald-500",
			bgColor: "bg-green-50",
			textColor: "text-green-600",
			isLive: true,
		},
		{
			title: "Temperature",
			value: latestVital?.temperature || "--",
			unit: "°C",
			icon: Thermometer,
			color: "from-orange-500 to-amber-500",
			bgColor: "bg-orange-50",
			textColor: "text-orange-600",
			isLive: false,
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			<Toaster position="top-right" richColors />
			<Navbar />

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Health Vitals
					</h1>
					<p className="text-gray-600">
						Track your health metrics over time
					</p>
				</div>

				{loading ? (
					<div className="flex justify-center py-12">
						<div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
					</div>
				) : (
					<>
						{/* Latest Vitals Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
							{vitalCards.map((card, index) => {
								const Icon = card.icon;
								return (
									<div
										key={index}
										className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 hover:shadow-xl transition-all duration-300"
									>
										<div className="flex items-center justify-between mb-4">
											<div
												className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}
											>
												<Icon
													className={`w-6 h-6 ${card.textColor}`}
												/>
											</div>
											<div
												className={`px-3 py-1 ${
													card.isLive
														? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
														: `bg-gradient-to-r ${card.color}`
												} text-white text-xs font-semibold rounded-full`}
											>
												{card.isLive
													? "LIVE"
													: "Latest"}
											</div>
										</div>
										<h3 className="text-gray-600 text-sm font-medium mb-2">
											{card.title}
										</h3>
										<div className="flex items-baseline gap-1">
											<p className="text-3xl font-bold text-gray-800">
												{card.value}
											</p>
											<p className="text-gray-500 text-sm">
												{card.unit}
											</p>
										</div>
									</div>
								);
							})}
						</div>

						{/* Charts */}
						{vitals.length > 0 ? (
							<div className="space-y-6">
								{/* Live Heart Rate Chart */}
								<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
									<div className="flex items-center justify-between mb-6">
										<h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
											<Heart className="w-6 h-6 text-red-600" />
											Live Heart Rate Monitor
										</h2>
										<div className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-full animate-pulse">
											LIVE
										</div>
									</div>
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<LineChart data={liveHeartRateData}>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#e0e0e0"
											/>
											<XAxis
												dataKey="time"
												stroke="#666"
												label={{
													value: "Time (seconds)",
													position: "insideBottom",
													offset: -5,
												}}
											/>
											<YAxis
												stroke="#666"
												domain={[50, 120]}
												label={{
													value: "BPM",
													angle: -90,
													position: "insideLeft",
												}}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "#fff",
													border: "1px solid #e0e0e0",
													borderRadius: "8px",
													padding: "10px",
												}}
											/>
											<Legend />
											<Line
												type="monotone"
												dataKey="value"
												stroke="#ef4444"
												strokeWidth={3}
												dot={{ fill: "#ef4444", r: 4 }}
												activeDot={{ r: 8 }}
												name="Heart Rate (bpm)"
												isAnimationActive={false}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>

								{/* Live Oxygen Level Chart */}
								<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
									<div className="flex items-center justify-between mb-6">
										<h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
											<Droplet className="w-6 h-6 text-green-600" />
											Live Oxygen Level Monitor
										</h2>
										<div className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full animate-pulse">
											LIVE
										</div>
									</div>
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<LineChart data={liveOxygenData}>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#e0e0e0"
											/>
											<XAxis
												dataKey="time"
												stroke="#666"
												label={{
													value: "Time (seconds)",
													position: "insideBottom",
													offset: -5,
												}}
											/>
											<YAxis
												stroke="#666"
												domain={[90, 100]}
												label={{
													value: "SpO₂ (%)",
													angle: -90,
													position: "insideLeft",
												}}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "#fff",
													border: "1px solid #e0e0e0",
													borderRadius: "8px",
													padding: "10px",
												}}
											/>
											<Legend />
											<Line
												type="monotone"
												dataKey="value"
												stroke="#10b981"
												strokeWidth={3}
												dot={{ fill: "#10b981", r: 4 }}
												activeDot={{ r: 8 }}
												name="SpO₂ (%)"
												isAnimationActive={false}
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>

								{/* Blood Pressure Chart */}
								<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
									<h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
										<Activity className="w-6 h-6 text-blue-600" />
										Blood Pressure History
									</h2>
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<BarChart data={vitals}>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#e0e0e0"
											/>
											<XAxis
												dataKey="day"
												stroke="#666"
											/>
											<YAxis stroke="#666" />
											<Tooltip
												contentStyle={{
													backgroundColor: "#fff",
													border: "1px solid #e0e0e0",
													borderRadius: "8px",
													padding: "10px",
												}}
											/>
											<Legend />
											<Bar
												dataKey="bloodPressure"
												fill="#3b82f6"
												radius={[8, 8, 0, 0]}
												name="BP (mmHg)"
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>

								{/* Temperature Chart */}
								<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
									<h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
										<Thermometer className="w-6 h-6 text-orange-600" />
										Body Temperature History
									</h2>
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<LineChart data={vitals}>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#e0e0e0"
											/>
											<XAxis
												dataKey="day"
												stroke="#666"
											/>
											<YAxis
												stroke="#666"
												domain={[36, 37.5]}
											/>
											<Tooltip
												contentStyle={{
													backgroundColor: "#fff",
													border: "1px solid #e0e0e0",
													borderRadius: "8px",
													padding: "10px",
												}}
											/>
											<Legend />
											<Line
												type="monotone"
												dataKey="temperature"
												stroke="#f97316"
												strokeWidth={3}
												dot={{ fill: "#f97316", r: 5 }}
												activeDot={{ r: 8 }}
												name="Temperature (°C)"
											/>
										</LineChart>
									</ResponsiveContainer>
								</div>
							</div>
						) : (
							<div className="bg-white rounded-2xl shadow-lg p-12 text-center">
								<Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
								<p className="text-gray-500">
									No vital data available
								</p>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Vitals;
