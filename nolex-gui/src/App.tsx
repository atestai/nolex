
import { ChooseOption } from './componets/ChooseOption'
import { DataGrid } from './componets/DataGrid'
import { SearchBar } from './componets/SearchBar'

function App() {
   
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            {/* Container del contenuto */}
            <div className="bg-white rounded-lg shadow-lg p-8 w-7xl">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Wellcome in Nolex
                    </h1>
                    <p className="text-gray-600">
                        Select the desired options to get started.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <SearchBar />
                    </div>

                    <div>
                       <ChooseOption /> 
                    </div>

                    <div>
                        <DataGrid />
                    </div>
                </div>
            </div>

        </div>

    )
}

export default App
