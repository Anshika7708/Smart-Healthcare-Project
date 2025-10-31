import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	FileText,
	Upload,
	Download,
	Trash2,
	Eye,
	File,
	Image as ImageIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { uploadReport, getUserReports, deleteReport } from "../api/api";

const Reports = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();
	const [reports, setReports] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const [fileType, setFileType] = useState("Report");

	useEffect(() => {
		if (!user) {
			navigate("/login");
			return;
		}

		fetchReports();
	}, [user, navigate]);

	const fetchReports = async () => {
		try {
			const response = await getUserReports(user._id);
			setReports(response.data);
		} catch (error) {
			console.error("Error fetching reports:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
	};

	const handleUpload = async (e) => {
		e.preventDefault();
		if (!selectedFile) return;

		setUploading(true);
		const formData = new FormData();
		formData.append("file", selectedFile);
		formData.append("userId", user._id);
		formData.append("fileType", fileType);

		try {
			await uploadReport(formData);
			setSelectedFile(null);
			setFileType("Report");
			fetchReports();
			// Reset file input
			e.target.reset();
		} catch (error) {
			console.error("Error uploading report:", error);
			alert("Failed to upload file");
		} finally {
			setUploading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this file?")) return;

		try {
			await deleteReport(id);
			fetchReports();
		} catch (error) {
			console.error("Error deleting report:", error);
		}
	};

	const getFileIcon = (mimeType) => {
		if (mimeType?.startsWith("image/")) {
			return <ImageIcon className="w-6 h-6" />;
		}
		return <File className="w-6 h-6" />;
	};

	const formatFileSize = (bytes) => {
		if (!bytes) return "N/A";
		const mb = bytes / (1024 * 1024);
		if (mb < 1) {
			return `${(bytes / 1024).toFixed(1)} KB`;
		}
		return `${mb.toFixed(1)} MB`;
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
			<Navbar />

			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						Medical Reports
					</h1>
					<p className="text-gray-600">
						Upload and manage your medical documents
					</p>
				</div>

				{/* Upload Section */}
				<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
					<h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<Upload className="w-6 h-6 text-indigo-600" />
						Upload New Document
					</h2>

					<form onSubmit={handleUpload} className="space-y-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{/* File Type Selection */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Document Type
								</label>
								<select
									value={fileType}
									onChange={(e) =>
										setFileType(e.target.value)
									}
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300"
								>
									<option value="Report">
										Medical Report
									</option>
									<option value="Prescription">
										Prescription
									</option>
								</select>
							</div>

							{/* File Upload */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Choose File
								</label>
								<input
									type="file"
									onChange={handleFileChange}
									accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
									className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 outline-none hover:border-indigo-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
									required
								/>
							</div>
						</div>

						{selectedFile && (
							<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
								<p className="text-sm text-gray-700">
									<span className="font-semibold">
										Selected:
									</span>{" "}
									{selectedFile.name}
								</p>
							</div>
						)}

						<button
							type="submit"
							disabled={uploading || !selectedFile}
							className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
						>
							{uploading ? (
								<>
									<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
									Uploading...
								</>
							) : (
								<>
									<Upload className="w-5 h-5" />
									Upload Document
								</>
							)}
						</button>
					</form>
				</div>

				{/* Reports List */}
				<div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
					<h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
						<FileText className="w-6 h-6 text-indigo-600" />
						Uploaded Documents ({reports.length})
					</h2>

					{loading ? (
						<div className="flex justify-center py-12">
							<div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
						</div>
					) : reports.length === 0 ? (
						<div className="text-center py-12">
							<FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
							<p className="text-gray-500">
								No documents uploaded yet
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 gap-4">
							{reports.map((report) => (
								<div
									key={report._id}
									className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200 group"
								>
									<div className="flex items-center gap-4">
										{/* File Icon */}
										<div
											className={`w-12 h-12 rounded-xl flex items-center justify-center ${
												report.fileType === "Report"
													? "bg-blue-100 text-blue-600"
													: "bg-purple-100 text-purple-600"
											}`}
										>
											{getFileIcon(report.mimeType)}
										</div>

										{/* File Info */}
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-gray-800 truncate">
												{report.fileName}
											</h3>
											<div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
												<span
													className={`px-2 py-1 rounded-lg text-xs font-medium ${
														report.fileType ===
														"Report"
															? "bg-blue-100 text-blue-700"
															: "bg-purple-100 text-purple-700"
													}`}
												>
													{report.fileType}
												</span>
												<span>
													{formatDate(
														report.uploadDate
													)}
												</span>
												<span>
													{formatFileSize(
														report.fileSize
													)}
												</span>
											</div>
										</div>

										{/* Actions */}
										<div className="flex items-center gap-2">
											<a
												href={`http://localhost:5000${report.filePath}`}
												target="_blank"
												rel="noopener noreferrer"
												className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
												title="View"
											>
												<Eye className="w-5 h-5" />
											</a>
											<a
												href={`http://localhost:5000${report.filePath}`}
												download
												className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
												title="Download"
											>
												<Download className="w-5 h-5" />
											</a>
											<button
												onClick={() =>
													handleDelete(report._id)
												}
												className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
												title="Delete"
											>
												<Trash2 className="w-5 h-5" />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Reports;
