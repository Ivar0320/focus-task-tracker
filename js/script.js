document.addEventListener('DOMContentLoaded', () => {

  // --- 1. アプリケーションの状態（State） ---
  let tasks = JSON.parse(localStorage.getItem('focus_tasks')) || [];
  let currentFilter = 'all';
  
  // タイマー状態
  let timerInterval = null;
  let timeLeft = 25 * 60; // 25分（秒単位）
  let isTimerRunning = false;

  // Chart.js インスタンス保持用
  let productivityChart = null;

  // --- 2. DOM要素の取得 ---
  const currentDateEl = document.getElementById('current-date');
  const taskForm = document.getElementById('task-form');
  const taskTitleInput = document.getElementById('task-title');
  const taskCategorySelect = document.getElementById('task-category');
  const taskListEl = document.getElementById('task-list');
  const filterBtns = document.querySelectorAll('.filter-btn');

  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');

  // --- 3. 日付の表示 ---
  const initDate = () => {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
    currentDateEl.textContent = now.toLocaleDateString('ja-JP', options);
  };

  // --- 4. LocalStorage への保存 ＆ 読み込み ---
  const saveTasks = () => {
    localStorage.setItem('focus_tasks', JSON.stringify(tasks));
  };

  // --- 5. タスクのCRUD操作 ---

  // 【Create】タスクの追加
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    const category = taskCategorySelect.value;

    if (!title) return;

    const newTask = {
      id: Date.now().toString(),
      title: title,
      category: category,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      completedAt: null
    };

    tasks.unshift(newTask); // 配列の先頭に追加
    saveTasks();
    renderTasks();
    updateChart();

    taskTitleInput.value = ''; // フォームリセット
  });

  // 【Update】完了ステータスの切り替え
  window.toggleTaskComplete = (id) => {
    tasks = tasks.map(task => {
      if (task.id === id) {
        const isCompleted = !task.completed;
        return {
          ...task,
          completed: isCompleted,
          completedAt: isCompleted ? new Date().toISOString().split('T')[0] : null
        };
      }
      return task;
    });
    saveTasks();
    renderTasks();
    updateChart();
  };

  // 【Delete】タスクの削除
  window.deleteTask = (id) => {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateChart();
  };

  // 【Read】タスク一覧のレンダリング
  const renderTasks = () => {
    taskListEl.innerHTML = '';

    // フィルタリング処理
    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    if (filteredTasks.length === 0) {
      taskListEl.innerHTML = '<li class="task-item" style="color: #94a3b8; justify-content: center;">タスクはありません</li>';
      return;
    }

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      const categoryLabel = {
        work: 'Work',
        study: 'Study',
        personal: 'Personal'
      }[task.category] || task.category;

      li.innerHTML = `
        <div class="task-left">
          <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''} 
            onChange="toggleTaskComplete('${task.id}')"
          >
          <span class="task-title">${escapeHtml(task.title)}</span>
          <span class="badge badge-${task.category}">${categoryLabel}</span>
        </div>
        <div class="task-actions">
          <button class="delete-btn" title="削除" onClick="deleteTask('${task.id}')">✕</button>
        </div>
      `;
      taskListEl.appendChild(li);
    });
  };

  // フィルタータブ切り替え
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderTasks();
    });
  });

  // XSS対策用エスケープ関数
  const escapeHtml = (str) => {
    return str.replace(/[&<>"']/g, (match) => {
      const escape = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return escape[match];
    });
  };

  // --- 6. ポモドーロ・タイマー機能 ---
  const updateTimerDisplay = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (isTimerRunning) return;
    isTimerRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;

    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        alert('ポモドーロセッション終了！お疲れ様でした。少し休憩しましょう。');
        resetTimer();
      }
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  };

  const resetTimer = () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  };

  startBtn.addEventListener('click', startTimer);
  pauseBtn.addEventListener('click', pauseTimer);
  resetBtn.addEventListener('click', resetTimer);

  // --- 7. 生産性アナリティクス（Chart.js グラフ描画） ---
  const initChart = () => {
    const ctx = document.getElementById('productivity-chart').getContext('2d');
    
    productivityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: '完了したタスク数',
          data: [],
          backgroundColor: '#2563eb',
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    updateChart();
  };

  // 直近7日間の完了タスク数を集計してグラフを更新
  const updateChart = () => {
    if (!productivityChart) return;

    const days = [];
    const counts = [];
    const today = new Date();

    // 直近7日間の日付ラベルを生成（過去6日〜今日）
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const displayLabel = `${d.getMonth() + 1}/${d.getDate()}`;

      // 該当日に完了したタスク数をカウント
      const count = tasks.filter(t => t.completed && t.completedAt === dateStr).length;

      days.push(displayLabel);
      counts.push(count);
    }

    productivityChart.data.labels = days;
    productivityChart.data.datasets[0].data = counts;
    productivityChart.update();
  };

  // --- 初期化実行 ---
  initDate();
  renderTasks();
  initChart();
});