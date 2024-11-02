import React, { useState } from 'react';
import './App.css'; // Ensure Tailwind CSS is imported in your project.

// Import images dynamically
function importAll(r: __WebpackModuleApi.RequireContext) {
  let images: { [key: string]: string } = {};
  r.keys().forEach((item) => {
    images[item.replace('./', '').replace(/\.[^/.]+$/, '')] = r(item);
  });
  return images;
}

const images = importAll(require.context('./images', false, /\.(jpg|jpeg|png|gif)$/));

type Role = {
  name: string;
  description: string;
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
  { name: '暗殺者', description: 'モードレットの手下' },
  { name: 'アーサーの忠実なる家来', description: '' },
  { name: 'マーリン', description: '邪悪を知るが見つかってはならない' },
  { name: 'パーシヴァル', description: 'マーリンを知る' },
  { name: 'オベロン', description: '邪悪を知らず' },
  { name: 'モルガナ', description: 'マーリンを装う' },
  { name: 'モードレット', description: 'マーリンを知らず' }
];

function App() {
  const [numParticipants, setNumParticipants] = useState<number | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [roleCounts, setRoleCounts] = useState<RoleCount>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentParticipantIndex, setCurrentParticipantIndex] = useState<number | null>(null);
  const [isRoleRevealed, setIsRoleRevealed] = useState<boolean>(false);

  const handleNumParticipantsSubmit = () => {
    if (numParticipants && numParticipants > 0) {
      setParticipants(Array.from({ length: numParticipants }, (_, i) => ({ id: i, name: '' })));
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
    if (validateRoleCounts()) {
      setCurrentStep(2);
    } else {
      alert('役割の合計数が参加者数と一致しません。再設定してください。');
    }
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
          <h1 className="text-2xl font-bold mb-4">参加人数を入力してください</h1>
          <input
            type="number"
            placeholder="人数を入力"
            className="border p-2 mb-4 w-full"
            onChange={(e) => setNumParticipants(Number(e.target.value))}
          />
          <button
            onClick={handleNumParticipantsSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!numParticipants || numParticipants <= 0}
          >
            次へ
          </button>
        </div>
      )}

      {currentStep === 1 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">役割の人数を設定してください</h1>
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
            onClick={proceedToNameInput}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
          >
            次へ
          </button>
        </div>
      )}

      {currentStep === 2 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">名前を入力してください</h1>
          {participants.map((participant, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder={`参加者 ${index + 1} の名前`}
                className="border p-2 w-full"
                onChange={(e) => handleNameChange(index, e.target.value)}
              />
            </div>
          ))}
          <button
            onClick={assignRoles}
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
            disabled={participants.some((p) => !p.name.trim())}
          >
            役割を設定して開始
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
              {participants[currentParticipantIndex].role && images[participants[currentParticipantIndex].role.name] && (
                <img
                  src={images[participants[currentParticipantIndex].role.name]}
                  alt={participants[currentParticipantIndex].role.name}
                  className="w-64 h-64 object-cover mx-auto my-4"
                />
              )}
              <p className="italic">{participants[currentParticipantIndex].role?.description}</p>
              <button
                onClick={handleNext}
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
              >
                確認OK
              </button>
            </div>
          )}
        </div>
     
