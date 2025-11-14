import { useEffect, useState } from "react";
import { RadioGroup } from "./RadioGroup";


// interface RadioBoxProps {
//     name: string;
//     label: string;
//     value: number | string;
//     checked?: boolean;
//     handleOptionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// function SympleRadioBox(props: RadioBoxProps) {

//     const {name, label, value, checked = false, handleOptionChange} = props;
//     return (
//         <label className="block"><input value={value} checked={checked} type="radio" name={name} onChange={handleOptionChange} /> {label} </label>
//     );
//}   

// const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    //     console.log(event);
    //     console.log(`Selected option: ${event.target.value}`);
    //     setValue(Number(event.target.value));
    // }   


import { RadioBox } from "./RadioBox";
import type { BodyPart, Clinic, Exame } from "../types/fetch.types";

export function ChooseOption() {

    const [selectedClinic, setSelectedClinic] = useState<string|undefined>(undefined);
    const [selectedBodyPart, setSelectedBodyPart] = useState<string|undefined>(undefined);
    const [selectedExame, setSelectedExame] = useState<string|undefined>(undefined);

    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [bodyParts, setBodyParts] = useState<BodyPart[]>([]);
    const [bodyExames, setBodyExames] = useState<Exame[]>([]);

    if (clinics.length > 0 && !selectedClinic) {
        setSelectedClinic(clinics[0].id);
    }
    
    useEffect(() => {
        async function fetchClinics() {
            await fetch ('http://localhost:3000/api/clinics')
            .then(response => response.json())
            .then(data => setClinics(data.clinics));
        }
        fetchClinics();
    }, []);

    useEffect(() => {
        async function fetchBodyParts() {

            await fetch (` http://localhost:3000/api/clinics/${selectedClinic}/bodyParts`)
            .then(response => response.json())
            .then(data => setBodyParts(data.bodyParts));
            
            setSelectedBodyPart(undefined);
            setBodyExames([]);
            setSelectedExame(undefined);
        }
        
        fetchBodyParts();
    }, [selectedClinic]);

    useEffect(() => {
        if (!selectedBodyPart || !selectedClinic) {
            return;
        }
        
        async function fetchBodyExames() {
            await fetch (`http://localhost:3000/api/examsByBodyPartAndClinic?bodyPartId=${selectedBodyPart}&clinicId=${selectedClinic}`)
            .then(response => response.json())
            .then((data) => setBodyExames(data.exams));
            setSelectedExame(undefined);
        }

        fetchBodyExames();
    }, [selectedClinic,selectedBodyPart]);


    return (
        <>
            {/* <div className="mb-6 text-lg font-semibold">
                {selectedClinic} - {selectedBodyPart} - {selectedExame}
            </div> */}
            <div className="flex flex-row space-x-4">
                <div className='w-full h-full p-2'>
                    
                    <RadioGroup
                        name="clinic"
                        value={selectedClinic}
                        onChange={setSelectedClinic}
                        label="Choose Your Clinic"
                        className="mb-8"
                    >
                        {clinics.map((option) => (<RadioBox value={option.id} label={option.name} />))}
                    </RadioGroup>
                </div>

                <div className='w-full border-l border-l-gray-400 h-fit p-2'>
                  
                    <RadioGroup
                        name="bodyPart"
                        value={selectedBodyPart}
                        onChange={setSelectedBodyPart}
                        label="Choose Body Part"
                        className="mb-3"
                    >
                        {bodyParts.length === 0 && <div className="text-gray-500 text-sm">No body parts available</div>}  
                        {bodyParts.map((option) => (<RadioBox value={option.id} label={option.name} />))}
                   
                    </RadioGroup>
                </div>

                <div className='w-full border-l border-l-gray-400 h-full p-2'>
                   
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
                    Add new exame
                </button>
            </div>
        </>
    );
}