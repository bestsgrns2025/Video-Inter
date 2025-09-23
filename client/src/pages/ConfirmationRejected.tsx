
const ConfirmationRejected = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="bg-white p-10 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Confirmation Rejected</h1>
                <p className="text-gray-700">Your registration has been cancelled. If this was a mistake, please sign up again.</p>
            </div>
        </div>
    );
};

export default ConfirmationRejected;
