import { useState } from 'react';

function QuestCard({ quest, onToggle, onRemove, onReset }) {
  const [progress, setProgress] = useState(0);

  console.log('render QuestCard', quest.title);

  return (
    <div className={'card ' + quest.status}>
      <div className="card-top">
        <h3>{quest.title}</h3>
        <span className="reward">+{quest.reward} XP</span>
      </div>

      <p>Progress: {progress} / 3</p>
      {progress >= 3 && <p className="ready">Ready to complete!</p>}

      <div className="card-buttons">
        <button onClick={() => setProgress(progress + 1)}>+1 progress</button>
        <button onClick={() => onReset(quest.id)}>Reset</button>
        <button onClick={() => onToggle(quest.id)}>
          {quest.status === 'active' ? 'Mark done' : 'Mark active'}
        </button>
        <button className="remove" onClick={() => onRemove(quest.id)}>Remove</button>
      </div>
    </div>
  );
}

export default QuestCard;
