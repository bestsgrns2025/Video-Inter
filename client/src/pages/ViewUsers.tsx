
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsers } from '../services/auth';
import * as XLSX from 'xlsx';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await getUsers();
                setUsers(res.data);
            } catch (err: any) {
                if (err.response && err.response.data && err.response.data.msg) {
                    setError(err.response.data.msg);
                } else {
                    setError('An unexpected error occurred.');
                }
            }
        };
        fetchUsers();
    }, []);

    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(users);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users");
        XLSX.writeFile(wb, "users.xlsx");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="font-bold text-2xl">Registered Users</h1>
                    <button
                        onClick={handleExport}
                        className="transition duration-200 bg-green-500 hover:bg-green-600 focus:bg-green-700 focus:shadow-sm focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 text-white py-2 px-4 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold"
                    >
                        Export to Excel
                    </button>
                </div>
                {error && <p className="text-red-500 text-center pb-3">{error}</p>}
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Email</th>
                                <th className="py-2 px-4 border-b">Registered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: any) => (
                                <tr key={user._id}>
                                    <td className="py-2 px-4 border-b text-center">{user.email}</td>
                                    <td className="py-2 px-4 border-b text-center">{user.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="transition duration-200 bg-gray-500 hover:bg-gray-600 focus:bg-gray-700 focus:shadow-sm focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50 text-white py-2.5 px-6 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold"
                    >
                        Exit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewUsers;
