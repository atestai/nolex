import { useEffect} from "react";
import { RadioGroup } from "./RadioGroup";
import { RadioBox } from "./RadioBox";
import { useSharedState } from "../hooks/useSharedState";
import { getBodyParts, getClinics, getExamsByBodyPartAndClinic } from "../utilities/fetch";

export function ChooseOption() {
    const { 
        query, 
        searchBy,
        selectedClinic, 
        setSelectedClinic, 
        selectedBodyPart, 
        setSelectedBodyPart, 
        selectedExame, 
        setSelectedExame, 
        clinics, 
        setClinics, 
        bodyParts, 
        setBodyParts, 
        bodyExames, 
        setBodyExames 
    } = useSharedState();

    if (clinics.length > 0 && !selectedClinic) {
        setSelectedClinic(clinics[0].id);
    }
    
    useEffect(() => {
        async function fetchClinics() {
            const data = await getClinics();
            setClinics(data.clinics);
        }
        fetchClinics();
    }, [setClinics]);


    useEffect(() => {
        async function fetchBodyParts() {
            if (!selectedClinic) {
                return;    
            }
            const data = await getBodyParts(selectedClinic, query, searchBy);
            setBodyParts(data.bodyParts);
        }
        
        fetchBodyParts();
    }, [selectedClinic, setBodyParts, setSelectedBodyPart, setBodyExames, setSelectedExame]);

    useEffect(() => {
        if (!selectedBodyPart || !selectedClinic) {
            return;
        }
        
        async function fetchBodyExames() {
            const data =  await getExamsByBodyPartAndClinic(selectedBodyPart, selectedClinic, query, searchBy);
            setBodyExames(data.exams);
        }

        fetchBodyExames();
    }, [selectedClinic, selectedBodyPart, setBodyExames, setSelectedExame]);


    const onClinicChange = (value: string) => {
        setSelectedBodyPart(undefined);
        setBodyExames([]);
        setSelectedExame(undefined);
        setSelectedClinic(value); 
    }

    const onBodyPartChange = (value: string) => {
        setBodyExames([]);
        setSelectedExame(undefined);
        setSelectedBodyPart(value);
    }

    return (
        <>
            {/* <div className="mb-6 text-lg font-semibold">
                {selectedClinic} - {selectedBodyPart} - {selectedExame}
            </div> */}
            <div className="flex flex-row space-x-4">
                <div className='w-1/4  h-full p-5'>
                    <RadioGroup
                        name="clinic"
                        value={selectedClinic}
                        onChange={ onClinicChange }
                        label="Choose Your Clinic"
                        className="mb-8"
                    >
                        {clinics.map((option) => (<RadioBox value={option.id} label={option.name} />))}
                    </RadioGroup>
                </div>

                <div className='w-1/4 h-full border-l border-l-gray-400 p-5'>
                    <RadioGroup
                        name="bodyPart"
                        value={selectedBodyPart}
                        onChange={onBodyPartChange}
                        label="Choose Body Part"
                        className="mb-3"
                    >
                        {bodyParts.length === 0 && <div className="text-gray-500 text-sm">No body parts available</div>}  
                        {bodyParts.map((option) => (<RadioBox value={option.id} label={option.name} />))}
                    </RadioGroup>
                </div>

                <div className='w-1/2 h-full border-l border-l-gray-400 p-5'>
                    <RadioGroup
                        name="exame"
                        value={selectedExame}
                        onChange={setSelectedExame}
                        label="Choose Exame"
                        className="mb-3"
                    >
                        {bodyExames.length === 0 && <div className="text-gray-500 text-sm">No exames available</div>}
                        {bodyExames.map((option) => (<RadioBox value={option.id} label={option.name} description={`${option.min_cod} - ${option.internal_code}`} />))} 
                    </RadioGroup>
                </div>
            </div>

            <div className="mt-6 text-right">
                <button
                    disabled={!selectedExame}
                    onClick={() => { alert('Button clicked!') }}
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ${!selectedExame ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    Add new item
                </button>
            </div>
        </>
    );
}