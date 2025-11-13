import { FileText, Link2 } from 'lucide-react';

export const Dashboard = () => {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Notes</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">0</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <FileText size={32} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Saved Links</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">0</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <Link2 size={32} className="text-green-600" />
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
