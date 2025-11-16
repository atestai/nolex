import { useEffect} from "react";
import { RadioGroup } from "./RadioGroup";
import { RadioBox } from "./RadioBox";
import { useSharedState } from "../hooks/useSharedState";
import { getBodyParts, getClinics, getClinicsBySearch, getExamsByBodyPartAndClinic } from "../utilities/fetch";
import type { DataGridType } from "./DataGrid";
import { useConfirmDialog } from "../hooks/useConfirmDialog";
import ConfirmDialog from "./ConfirmDialog";
import { Add } from "./Icons";

async function sha1(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

export function ChooseOption() {
    const { 
        searchStatus,
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
        setBodyExames,
        dataStore,
        setDataStore
    } = useSharedState();

    const { isOpen, isLoading, options, openDialog, closeDialog, handleConfirm} = useConfirmDialog();
    
    if (clinics.length > 0 && !selectedClinic) {
        setSelectedClinic(clinics[0].id);
    }
    
    useEffect(() => {
        async function fetchClinics() {
            if (searchStatus.query.trim() === '') {
                const data = await getClinics();
                return setClinics(data.clinics);
            }
            const data = await getClinicsBySearch(searchStatus.query, searchStatus.searchBy);
            return setClinics(data.clinics); 
        }
        fetchClinics();
    }, [setClinics, searchStatus]);


    useEffect(() => {
        async function fetchBodyParts() {
            if (!selectedClinic) {
                return;    
            }
            const data = await getBodyParts(selectedClinic, searchStatus.query, searchStatus.searchBy);
            setBodyParts(data.bodyParts);
        }
        
        fetchBodyParts();
    }, [selectedClinic, searchStatus, setBodyParts, setSelectedBodyPart, setBodyExames, setSelectedExame]);

    useEffect(() => {
        if (!selectedBodyPart || !selectedClinic) {
            return;
        }
        
        async function fetchBodyExames() {
            const data =  await getExamsByBodyPartAndClinic(selectedBodyPart, selectedClinic, searchStatus.query, searchStatus.searchBy);
            setBodyExames(data.exams);
        }
        fetchBodyExames();
    }, [selectedClinic, selectedBodyPart, searchStatus,setBodyExames, setSelectedExame]);


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

    const onAddItem = async () => {
        const exam = bodyExames.find(e => e.id == selectedExame);
        const item : DataGridType = {
            id: await sha1(`${selectedClinic}-${selectedBodyPart}-${selectedExame}`),
            clinicName: clinics.find(c => c.id == selectedClinic)?.name || '',
            bodyPartName: bodyParts.find(b => b.id == selectedBodyPart)?.name || '',
            exameName: exam?.name || '',
            min_cod: exam?.min_cod || '',
            internal_code: exam?.internal_code || '',
        }

        if (dataStore.find(d => d.id === item.id)) {
            return openDialog({
                title: 'Item Already Added',
                message: `This exame is already added.`,
                confirmText: 'Ok',
                type: 'info',
                onConfirm: () => {
                    closeDialog();
                }
            });
        }

        setDataStore(prevData => [...prevData, item]);
        sessionStorage.setItem('dataStore', JSON.stringify([...dataStore, item]));
    }   

    return (    
        <>
            <ConfirmDialog
                isOpen={isOpen}
                onClose={closeDialog}
                onConfirm={handleConfirm}
                title={options.title}
                message={options.message}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
                type={options.type}
                confirmLoading={isLoading}
            />

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
                    onClick={onAddItem}
                    className={`w-fit bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 ${!selectedExame ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="flex items-center">
                        <Add /> <span className="ml-2">Add new item</span>
                    </div>
                </button>
            </div>
        </>
    );
}