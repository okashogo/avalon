import React, { useState } from 'react';
import './App.css'; // Ensure Tailwind CSS is imported in your project.
import asa from './images/アーサーの忠実なる家来.jpg';
import marlin from './images/マーリン.jpg';
import ovelon from './images/オベロン.jpg';
import morgana from './images/モルガナ.jpg';
import modelet from './images/モードレット.jpg';
import assassin from './images/暗殺者.jpg';


type Role = {
  name: string;
  description: string;
  image: string;
};

type Participant = {
  id: number;
  name: string;
  role?: Role;
};

type RoleCount = {
  [key: string]: number;
};

const roles: Role[] = [
  { name: '暗殺者', description: 'モードレットの手下', image: assassin },
  { name: 'アーサーの忠実なる家来', description: '', image: asa },
  { name: 'マーリン', description: '邪悪を知るが見つかってはならない', image: marlin },
  { name: 'パーシヴァル', description: 'マーリンを知る', image: ovelon },
  { name: 'オベロン', description: '邪悪を知らず', image: ovelon },
  { name: 'モルガナ', description: 'マーリンを装う', image: morgana },
  { name: 'モードレット', description: 'マーリンを知らず', image: modelet }
];

function App() {
  const [numParticipants, setNumParticipants] = useState<number | null>(null);
  const [initialNames, setInitialNames] = useState<string[]>([
    'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack', 'Kate', 'Leo'
  ]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roleCounts, setRoleCounts] = useState<RoleCount>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState<number | null>(null);
  const [isRoleRevealed, setIsRoleRevealed] = useState<boolean>(false);

  const handleNumParticipantsSubmit = () => {
    if (numParticipants && numParticipants > 0 && numParticipants <= initialNames.length) {
      const initialParticipants = initialNames.map((name, i) => ({ id: i, name }));
      setParticipants(initialParticipants);
      setCurrentStep(1);
    }
  };

  const handleNameChange = (index: number, name: string) => {
    setParticipants((prev) => {
      const updatedParticipants = [...prev];
      updatedParticipants[index].name = name;
      return updatedParticipants;
    });
  };

  const removeParticipant = (index: number) => {
    setInitialNames((prev) => prev.filter((_, i) => i !== index));
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRoleCountChange = (roleName: string, count: number) => {
    setRoleCounts((prev) => ({
      ...prev,
      [roleName]: count,
    }));
  };

  const validateRoleCounts = () => {
    const totalRoles = Object.values(roleCounts).reduce((sum, count) => sum + count, 0);
    return totalRoles === participants.length;
  };

  const proceedToNameInput = () => {
    // if (validateRoleCounts()) {
      setCurrentStep(2);
    // } else {
    //   alert('役割の合計数が参加者数と一致しません。再設定してください。');
    // }
  };

  const assignRoles = () => {
    const assignedRoles: Role[] = [];
    for (const role of roles) {
      const count = roleCounts[role.name] || 0;
      for (let i = 0; i < count; i++) {
        assignedRoles.push(role);
      }
    }

    const shuffledRoles = assignedRoles.sort(() => Math.random() - 0.5);
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant, index) => ({
        ...participant,
        role: shuffledRoles[index],
      }))
    );
    setCurrentParticipantIndex(0); // Set the first participant index
    setCurrentStep(3);
  };

  const handleNext = () => {
    if (currentParticipantIndex === null || currentParticipantIndex >= participants.length - 1) {
      setCurrentParticipantIndex(0);
    } else {
      setCurrentParticipantIndex(currentParticipantIndex + 1);
    }
    setIsRoleRevealed(false);
  };

  const revealRole = () => {
    setIsRoleRevealed(true);
  };

  return (
    <div className="container mx-auto p-4">
      {currentStep === 0 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">参加人数を入力してください (最大12人)</h1>
          <input
            type="number"
            placeholder="人数を入力"
            className="border p-2 mb-4 w-full"
            onChange={(e) => setNumParticipants(Number(e.target.value))}
            max={initialNames.length}
          />
          <button
            onClick={handleNumParticipantsSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!numParticipants || numParticipants <= 0 || numParticipants > initialNames.length}
          >
            次へ
          </button>
        </div>
      )}

      {currentStep === 1 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">名前を編集または削除してください</h1>
          <p className="mb-2">残り削除可能人数: {participants.length - numParticipants!}</p>
          <p className="mb-4">現在の参加人数: {numParticipants}</p>
          {initialNames.map((name, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={name}
                className="border p-2 w-full mr-2"
                onChange={(e) => handleNameChange(index, e.target.value)}
              />
              <button
                onClick={() => removeParticipant(index)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                削除
              </button>
            </div>
          ))}
          <button
            onClick={proceedToNameInput}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            次へ
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">役割の人数を設定してください</h1>
          <div>
            {numParticipants}人
            </div>
          {roles.map((role) => (
            <div key={role.name} className="mb-2">
              <label className="block font-bold mb-1">{role.name}</label>
              <input
                type="number"
                min="0"
                className="border p-2 w-full"
                onChange={(e) => handleRoleCountChange(role.name, Number(e.target.value))}
              />
            </div>
          ))}
          <button
            onClick={assignRoles}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            次へ
          </button>
        </div>
      )}

      {currentStep === 3 && currentParticipantIndex !== null && (
        <div>
          {!isRoleRevealed ? (
            <div>
              <h2 className="text-xl font-bold">{participants[currentParticipantIndex].name}さんの番です。{participants[currentParticipantIndex].name}さんですか？</h2>
              <button
                onClick={revealRole}
                className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
              >
                はい、そうです。
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold">あなたは「{participants[currentParticipantIndex].role?.name}」です。</h2>
              <img
                src={participants[currentParticipantIndex].role?.image}
                alt={participants[currentParticipantIndex].role?.name}
                className="w-64 h-64 object-cover mx-auto my-4"
              />
              <p className="italic">
                {participants[currentParticipantIndex].role?.description}
              </p>
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
              >
                確認OK
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;