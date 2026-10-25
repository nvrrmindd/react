import { useState } from 'react';
import QuestForm from './components/QuestForm.jsx';
import QuestCard from './components/QuestCard.jsx';

const startQuests = [
  { id: 1, title: 'Finish React lab', reward: 50, status: 'active', version: 0 },
  { id: 2, title: 'Eat baursak', reward: 10, status: 'done', version: 0 },
  { id: 3, title: 'Sleep 8 hours', reward: 100, status: 'active', version: 0 },
];

function App() {
  const [quests, setQuests] = useState(startQuests);
  const [filter, setFilter] = useState('all');

  console.log('render App');

  function addQuest(title) {
    setQuests([...quests, { id: Date.now(), title, reward: 10, status: 'active', version: 0 }]);
  }

  function removeQuest(id) {
    setQuests(quests.filter((q) => q.id !== id));
  }

  function toggleStatus(id) {
    setQuests(quests.map((q) =>
      q.id === id ? { ...q, status: q.status === 'active' ? 'done' : 'active' } : q
    ));
  }

  function resetProgress(id) {
    setQuests(quests.map((q) => (q.id === id ? { ...q, version: q.version + 1 } : q)));
  }

  function reverseList() {
    setQuests([...quests].reverse());
  }

  const visible = quests.filter((q) => filter === 'all' || q.status === filter);

  return (
    <div className="app">
      <h1>Quest Board</h1>

      <QuestForm onAdd={addQuest} />

      <div className="toolbar">
        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
        <button className={filter === 'active' ? 'active' : ''} onClick={() => setFilter('active')}>Active</button>
        <button className={filter === 'done' ? 'active' : ''} onClick={() => setFilter('done')}>Done</button>
        <button onClick={reverseList}>Reverse</button>
      </div>

      {visible.length === 0 ? (
        <p className="empty">No quests here</p>
      ) : (
        <div className="list">
          {visible.map((q) => (
            <QuestCard
              key={q.id + '-' + q.version}
              quest={q}
              onToggle={toggleStatus}
              onRemove={removeQuest}
              onReset={resetProgress}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
