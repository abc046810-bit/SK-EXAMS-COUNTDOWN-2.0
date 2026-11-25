// To-Do List & Task Manager + Customizable Syllabus Tracker
PlatformViews.todo = function (container) {
  StudentStore.recordRecentTool('/todo', 'To-Do Manager');
  let filterView = 'all'; // all | today | upcoming | pending | completed
  let prioFilter = 'all';
  let sortBy = 'deadline';
  let searchQ = '';
  let editingId = null;

  const prioWeight = { high: 1, medium: 2, low: 3 };

  const draw = () => {
    const d = StudentStore.get();
    const today = getISTDateString();
    const editItem = editingId ? d.todos.find((x) => x.id === editingId) : null;

    let list = [...d.todos];
    if (filterView === 'today') list = list.filter((x) => x.deadline === today);
    else if (filterView === 'upcoming') list = list.filter((x) => x.deadline && x.deadline > today && !x.completed);
    else if (filterView === 'pending') list = list.filter((x) => !x.completed);
    else if (filterView === 'completed') list = list.filter((x) => x.completed);

    if (prioFilter !== 'all') list = list.filter((x) => x.priority === prioFilter);
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      list = list.filter((x) => (x.title + ' ' + (x.description || '') + ' ' + (x.category || '')).toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (sortBy === 'priority') return (prioWeight[a.priority] || 2) - (prioWeight[b.priority] || 2);
      return (a.deadline || '9999-12-31').localeCompare(b.deadline || '9999-12-31');
    });

    const total = d.todos.length;
    const done = d.todos.filter((x) => x.completed).length;
    const overdue = d.todos.filter((x) => !x.completed && x.deadline && x.deadline < today).length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">To-Do List & Task Manager</h1>
          <p class="section-desc">Track daily study tasks, priorities, and deadlines locally on your device.</p>
        </div>
        ${done > 0 ? `<button type="button" class="btn btn-danger btn-sm" id="todo-clear-done">Clear Completed (${done})</button>` : ''}
      </div>

      <div class="kpi-grid">
        <div class="kpi-card"><span class="kpi-label">Progress</span><span class="kpi-value">${pct}%</span><span class="kpi-sub">${done} of ${total} completed</span></div>
        <div class="kpi-card"><span class="kpi-label">Pending</span><span class="kpi-value">${total - done}</span></div>
        <div class="kpi-card"><span class="kpi-label">Overdue</span><span class="kpi-value" style="color:${overdue ? '#fb7185' : 'inherit'};">${overdue}</span></div>
      </div>

      <section class="panel-card">
        <h2 class="section-title" style="font-size:1rem;margin-bottom:0.75rem;">${editItem ? 'Edit Task' : 'Add New Task'}</h2>
        <form id="todo-form" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;">
          <div><label class="form-label">Task Title</label><input class="input-field" style="width:100%;" id="td-title" required value="${escapeHtml(editItem?.title || '')}" placeholder="e.g. Solve 30 Organic Chem MCQs" /></div>
          <div><label class="form-label">Category</label><input class="input-field" style="width:100%;" id="td-cat" value="${escapeHtml(editItem?.category || 'Study')}" placeholder="Study / Revision / Mock" /></div>
          <div><label class="form-label">Deadline</label><input type="date" class="input-field" style="width:100%;" id="td-date" value="${escapeHtml(editItem?.deadline || today)}" /></div>
          <div>
            <label class="form-label">Priority</label>
            <select id="td-prio" class="input-field" style="width:100%;">
              <option value="high" ${editItem?.priority === 'high' ? 'selected' : ''}>High</option>
              <option value="medium" ${!editItem || editItem?.priority === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="low" ${editItem?.priority === 'low' ? 'selected' : ''}>Low</option>
            </select>
          </div>
          <div style="grid-column:1/-1;"><label class="form-label">Description (Optional)</label><input class="input-field" style="width:100%;" id="td-desc" value="${escapeHtml(editItem?.description || '')}" placeholder="Notes or page numbers..." /></div>
          <div style="display:flex;gap:0.5rem;">
            <button type="submit" class="btn btn-primary">${editItem ? 'Update Task' : 'Add Task'}</button>
            ${editItem ? `<button type="button" class="btn btn-secondary" id="td-cancel">Cancel</button>` : ''}
          </div>
        </form>
      </section>

      <div class="filter-bar">
        <input type="search" id="td-search" class="input-field" style="flex:1;min-width:190px;" value="${escapeHtml(searchQ)}" placeholder="Search tasks..." />
        <div class="chip-row">
          ${['all', 'today', 'upcoming', 'pending', 'completed'].map((v) => `<button type="button" class="filter-chip ${filterView === v ? 'active' : ''}" data-td-view="${v}">${v[0].toUpperCase() + v.slice(1)}</button>`).join('')}
        </div>
        <select id="td-prio-filter" class="input-field">
          <option value="all" ${prioFilter === 'all' ? 'selected' : ''}>All Priorities</option>
          <option value="high" ${prioFilter === 'high' ? 'selected' : ''}>High</option>
          <option value="medium" ${prioFilter === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="low" ${prioFilter === 'low' ? 'selected' : ''}>Low</option>
        </select>
        <select id="td-sort" class="input-field">
          <option value="deadline" ${sortBy === 'deadline' ? 'selected' : ''}>Sort by Date</option>
          <option value="priority" ${sortBy === 'priority' ? 'selected' : ''}>Sort by Priority</option>
        </select>
      </div>

      <div class="item-list">
        ${list.length ? list.map((item) => {
          const isOverdue = !item.completed && item.deadline && item.deadline < today;
          return `
            <div class="list-row-card ${item.completed ? 'completed' : ''}">
              <div style="display:flex;gap:0.75rem;align-items:flex-start;">
                <input type="checkbox" data-td-toggle="${item.id}" ${item.completed ? 'checked' : ''} style="margin-top:0.25rem;width:18px;height:18px;" />
                <div>
                  <div class="row-title">${escapeHtml(item.title)} ${isOverdue ? '<span class="status-badge status-postponed">Overdue</span>' : ''}</div>
                  ${item.description ? `<div class="row-meta">${escapeHtml(item.description)}</div>` : ''}
                  <div class="row-meta">${escapeHtml(item.category || 'General')} • Due: ${escapeHtml(item.deadline || 'No date')}</div>
                </div>
              </div>
              <div style="display:flex;align-items:center;gap:0.4rem;">
                <span class="status-badge prio-${item.priority}">${item.priority}</span>
                <button type="button" class="icon-btn" data-td-edit="${item.id}" title="Edit">${icon('edit')}</button>
                <button type="button" class="icon-btn" data-td-del="${item.id}" title="Delete">${icon('trash')}</button>
              </div>
            </div>
          `;
        }).join('') : `<div class="empty-state"><h3>No matching tasks</h3><p>Add a task above or adjust your filters.</p></div>`}
      </div>
    `;

    container.querySelector('#todo-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const obj = {
        id: editingId || `td_${Date.now()}`,
        title: container.querySelector('#td-title').value.trim(),
        category: container.querySelector('#td-cat').value.trim() || 'Study',
        deadline: container.querySelector('#td-date').value,
        priority: container.querySelector('#td-prio').value,
        description: container.querySelector('#td-desc').value.trim(),
        completed: editItem ? editItem.completed : false,
        createdAt: editItem ? editItem.createdAt : new Date().toISOString()
      };
      if (editingId) {
        const idx = d.todos.findIndex((x) => x.id === editingId);
        if (idx >= 0) d.todos[idx] = obj;
      } else {
        d.todos.unshift(obj);
      }
      editingId = null;
      StudentStore.save();
      showToast('Task saved!');
      draw();
    });
    container.querySelector('#td-cancel')?.addEventListener('click', () => { editingId = null; draw(); });
    container.querySelector('#todo-clear-done')?.addEventListener('click', () => {
      if (window.confirm('Clear all completed tasks?')) {
        d.todos = d.todos.filter((x) => !x.completed);
        StudentStore.save();
        draw();
      }
    });
    container.querySelector('#td-search')?.addEventListener('input', (e) => {
      searchQ = e.target.value;
      draw();
      const inp = container.querySelector('#td-search');
      if (inp) { inp.focus(); inp.setSelectionRange(searchQ.length, searchQ.length); }
    });
    container.querySelectorAll('[data-td-view]').forEach((b) => b.addEventListener('click', () => { filterView = b.getAttribute('data-td-view'); draw(); }));
    container.querySelector('#td-prio-filter')?.addEventListener('change', (e) => { prioFilter = e.target.value; draw(); });
    container.querySelector('#td-sort')?.addEventListener('change', (e) => { sortBy = e.target.value; draw(); });
    container.querySelectorAll('[data-td-toggle]').forEach((cb) => cb.addEventListener('change', () => {
      const it = d.todos.find((x) => x.id === cb.getAttribute('data-td-toggle'));
      if (it) {
        it.completed = cb.checked;
        it.completedAt = it.completed ? new Date().toISOString() : null;
        if (it.completed) StudentStore.recordStudyActivity();
        StudentStore.save();
        draw();
      }
    }));
    container.querySelectorAll('[data-td-edit]').forEach((b) => b.addEventListener('click', () => { editingId = b.getAttribute('data-td-edit'); draw(); }));
    container.querySelectorAll('[data-td-del]').forEach((b) => b.addEventListener('click', () => {
      d.todos = d.todos.filter((x) => x.id !== b.getAttribute('data-td-del'));
      StudentStore.save();
      draw();
    }));
  };

  draw();
};

PlatformViews.syllabus = function (container) {
  StudentStore.recordRecentTool('/syllabus', 'Syllabus Tracker');

  const draw = () => {
    const d = StudentStore.get();
    const stats = StudentStore.getSyllabusStats();

    container.innerHTML = `
      <div class="section-header" style="margin-top:0;">
        <div>
          <h1 class="section-title" style="font-size:1.55rem;">Customizable Syllabus Tracker</h1>
          <p class="section-desc">Build your own subject, chapter, and topic tree — track completion, difficulty, and revisions.</p>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card"><span class="kpi-label">Overall Completion</span><span class="kpi-value">${stats.pct}%</span><span class="kpi-sub">${stats.completed}/${stats.total} topics</span></div>
        <div class="kpi-card"><span class="kpi-label">In Progress</span><span class="kpi-value">${stats.inProgress}</span></div>
        <div class="kpi-card"><span class="kpi-label">Pending Topics</span><span class="kpi-value">${stats.pending}</span></div>
        <div class="kpi-card"><span class="kpi-label">Total Revisions</span><span class="kpi-value">${stats.revisions}</span></div>
      </div>

      ${stats.perSubject.length ? `
        <section class="panel-card">
          <h2 class="section-title" style="font-size:1rem;margin-bottom:0.85rem;">Subject-Wise Progress</h2>
          <div class="item-list">
            ${stats.perSubject.map((s) => `
              <div>
                <div class="progress-meta" style="margin-bottom:0.25rem;"><strong>${escapeHtml(s.subject)}</strong><span>${s.completed}/${s.total} (${s.pct}%)</span></div>
                <div class="progress-track"><div class="progress-fill" style="width:${s.pct}%;"></div></div>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}

      <section class="panel-card">
        <form id="add-subject-form" style="display:flex;gap:0.65rem;flex-wrap:wrap;">
          <input id="syl-new-sub" class="input-field" style="flex:1;min-width:220px;" required placeholder="Add a subject (e.g. Physics, Biology, Indian Polity)..." />
          <button type="submit" class="btn btn-primary">${icon('plus')} Add Subject</button>
        </form>
      </section>

      ${d.syllabus.length ? d.syllabus.map((sub) => `
        <section class="panel-card">
          <div class="exam-card-head" style="margin-bottom:0.9rem;">
            <h2 class="section-title" style="font-size:1.15rem;">${escapeHtml(sub.subject)}</h2>
            <button type="button" class="btn btn-danger btn-sm" data-del-sub="${sub.id}">Delete Subject</button>
          </div>
          <form class="add-chapter-form" data-sub-id="${sub.id}" style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;">
            <input class="input-field" style="flex:1;min-width:200px;" required placeholder="Add chapter to ${escapeHtml(sub.subject)}..." />
            <button type="submit" class="btn btn-secondary btn-sm">${icon('plus')} Chapter</button>
          </form>

          ${(sub.chapters || []).map((ch) => {
            const cTotal = (ch.topics || []).length;
            const cDone = (ch.topics || []).filter((tp) => tp.status === 'completed').length;
            return `
              <div style="border:1px solid var(--border);border-radius:var(--radius-sm);padding:0.85rem;margin-bottom:0.75rem;background:var(--bg-glass);">
                <div class="exam-card-head" style="margin-bottom:0.6rem;">
                  <strong>${escapeHtml(ch.name)} <span style="color:var(--text-secondary);font-size:0.8rem;">(${cDone}/${cTotal})</span></strong>
                  <button type="button" class="icon-btn" data-del-ch="${sub.id}|${ch.id}" title="Delete Chapter">${icon('trash')}</button>
                </div>
                <form class="add-topic-form" data-ch-key="${sub.id}|${ch.id}" style="display:flex;gap:0.45rem;margin-bottom:0.65rem;flex-wrap:wrap;">
                  <input class="input-field" style="flex:1;min-width:170px;padding:0.45rem 0.75rem;" required placeholder="Add topic..." />
                  <select class="input-field" style="padding:0.45rem 0.6rem;">
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="low">Low</option>
                  </select>
                  <button type="submit" class="btn btn-secondary btn-sm">+ Topic</button>
                </form>
                <div class="item-list">
                  ${(ch.topics || []).map((tp) => `
                    <div class="list-row-card" style="padding:0.6rem 0.75rem;">
                      <div>
                        <div class="row-title" style="font-size:0.88rem;">
                          ${escapeHtml(tp.name)}
                          ${tp.difficult ? '<span class="status-badge status-postponed">Difficult</span>' : ''}
                        </div>
                        <div class="row-meta">Priority: ${tp.priority || 'medium'} • Revisions: ${tp.revisions || 0} ${tp.notes ? `• Note: ${escapeHtml(tp.notes)}` : ''}</div>
                      </div>
                      <div style="display:flex;gap:0.35rem;flex-wrap:wrap;align-items:center;">
                        <select class="input-field" style="padding:0.3rem 0.5rem;font-size:0.76rem;" data-tp-status="${sub.id}|${ch.id}|${tp.id}">
                          <option value="not-started" ${tp.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                          <option value="in-progress" ${tp.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                          <option value="completed" ${tp.status === 'completed' ? 'selected' : ''}>Completed</option>
                        </select>
                        <button type="button" class="btn btn-secondary btn-sm" data-tp-rev="${sub.id}|${ch.id}|${tp.id}" title="Log Revision">+1 Rev</button>
                        <button type="button" class="btn btn-secondary btn-sm" data-tp-diff="${sub.id}|${ch.id}|${tp.id}" title="Toggle Difficult">${tp.difficult ? '★' : '☆'}</button>
                        <button type="button" class="btn btn-secondary btn-sm" data-tp-note="${sub.id}|${ch.id}|${tp.id}" title="Personal Note">Note</button>
                        <button type="button" class="icon-btn" data-tp-del="${sub.id}|${ch.id}|${tp.id}" title="Delete">${icon('trash')}</button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </section>
      `).join('') : `<div class="empty-state"><h3>Your syllabus is empty</h3><p>Add your subjects above and customize chapters & topics according to your official exam syllabus.</p></div>`}
    `;

    container.querySelector('#add-subject-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = container.querySelector('#syl-new-sub').value.trim();
      if (!name) return;
      d.syllabus.push({ id: `sub_${Date.now()}`, subject: name, chapters: [] });
      StudentStore.save();
      draw();
    });

    container.querySelectorAll('[data-del-sub]').forEach((b) => b.addEventListener('click', () => {
      if (window.confirm('Delete this subject and all its chapters?')) {
        d.syllabus = d.syllabus.filter((s) => s.id !== b.getAttribute('data-del-sub'));
        StudentStore.save();
        draw();
      }
    }));

    container.querySelectorAll('.add-chapter-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const sub = d.syllabus.find((s) => s.id === form.getAttribute('data-sub-id'));
        const name = form.querySelector('input').value.trim();
        if (sub && name) {
          sub.chapters.push({ id: `ch_${Date.now()}`, name, topics: [] });
          StudentStore.save();
          draw();
        }
      });
    });

    container.querySelectorAll('[data-del-ch]').forEach((b) => b.addEventListener('click', () => {
      const [sid, cid] = b.getAttribute('data-del-ch').split('|');
      const sub = d.syllabus.find((s) => s.id === sid);
      if (sub) {
        sub.chapters = sub.chapters.filter((c) => c.id !== cid);
        StudentStore.save();
        draw();
      }
    }));

    container.querySelectorAll('.add-topic-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const [sid, cid] = form.getAttribute('data-ch-key').split('|');
        const sub = d.syllabus.find((s) => s.id === sid);
        const ch = sub?.chapters.find((c) => c.id === cid);
        const name = form.querySelector('input').value.trim();
        const prio = form.querySelector('select').value;
        if (ch && name) {
          ch.topics.push({ id: `tp_${Date.now()}`, name, status: 'not-started', difficult: false, priority: prio, revisions: 0, notes: '' });
          StudentStore.save();
          draw();
        }
      });
    });

    const findTopic = (key) => {
      const [sid, cid, tid] = key.split('|');
      const sub = d.syllabus.find((s) => s.id === sid);
      const ch = sub?.chapters.find((c) => c.id === cid);
      return { ch, tp: ch?.topics.find((t) => t.id === tid), tid };
    };

    container.querySelectorAll('[data-tp-status]').forEach((sel) => sel.addEventListener('change', () => {
      const { tp } = findTopic(sel.getAttribute('data-tp-status'));
      if (tp) {
        tp.status = sel.value;
        if (tp.status === 'completed') StudentStore.recordStudyActivity();
        StudentStore.save();
        draw();
      }
    }));

    container.querySelectorAll('[data-tp-rev]').forEach((b) => b.addEventListener('click', () => {
      const { tp } = findTopic(b.getAttribute('data-tp-rev'));
      if (tp) {
        tp.revisions = (tp.revisions || 0) + 1;
        StudentStore.recordStudyActivity();
        StudentStore.save();
        draw();
      }
    }));

    container.querySelectorAll('[data-tp-diff]').forEach((b) => b.addEventListener('click', () => {
      const { tp } = findTopic(b.getAttribute('data-tp-diff'));
      if (tp) {
        tp.difficult = !tp.difficult;
        StudentStore.save();
        draw();
      }
    }));

    container.querySelectorAll('[data-tp-note]').forEach((b) => b.addEventListener('click', () => {
      const { tp } = findTopic(b.getAttribute('data-tp-note'));
      if (tp) {
        const next = window.prompt('Personal note for ' + tp.name, tp.notes || '');
        if (next !== null) {
          tp.notes = next.trim();
          StudentStore.save();
          draw();
        }
      }
    }));

    container.querySelectorAll('[data-tp-del]').forEach((b) => b.addEventListener('click', () => {
      const { ch, tid } = findTopic(b.getAttribute('data-tp-del'));
      if (ch) {
        ch.topics = ch.topics.filter((t) => t.id !== tid);
        StudentStore.save();
        draw();
      }
    }));
  };

  draw();
};
