# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

约会盲盒 Lovebox is a psychology-based dating inspiration web application designed to help couples in early relationships strengthen their emotional connection. The app provides 50 carefully designed dating activities across 5 categories, with a gamified "mystery box" drawing mechanism.

## Technology Stack

- **Frontend**: Pure HTML5 + CSS3 + JavaScript (no framework dependencies)
- **Data Storage**: LocalStorage (client-side persistence)
- **Data Format**: JSON
- **Server**: Static file server (Python HTTP server or Node.js http-server)

## Development Commands

### Running the Application

**Method 1: Python HTTP Server (Recommended)**
```bash
python -m http.server 8000
```
Then open: http://localhost:8000

**Method 2: Node.js HTTP Server**
```bash
npx http-server -p 8000
```

**Note**: The app requires a web server to run (not file:// protocol) due to fetch() API usage for loading tasks.json.

## Architecture

### Core State Management

The application uses a client-side state management system with three key storage items:

1. **`lovebox_last_date`**: Tracks the last visit date for daily reset logic
2. **`lovebox_changes_remaining`**: Stores remaining "change task" attempts (max 3 per day)
3. **`lovebox_used_tasks`**: Array of task IDs already shown today to prevent duplicates

**Daily Reset Logic** (`app.js:76-101`):
- Compares current date with stored date
- If different day: resets `dailyChangesRemaining` to 3, clears `usedTaskIds`
- If same day: loads saved state from LocalStorage

### Task Drawing Algorithm

**Filter-then-Random Approach** (`app.js:219-261`):
1. First, filter tasks by active filters (duration, location, budget)
2. Then, exclude tasks already used today (`usedTaskIds`)
3. If no tasks available:
   - If due to filters: alert user to change filters
   - If all filtered tasks used: reset `usedTaskIds` and draw from filtered set
4. Randomly select from available tasks and add to `usedTaskIds`

### UI State Machine

Three mutually exclusive states:
- **Draw State**: Initial screen with filter UI and draw button
- **Loading State**: Animated "searching" screen (1-1.5s delay for ritual sense)
- **Card State**: Task card display with change/confirm actions

Transitions:
```
Draw State → (draw button) → Loading → Card State
Card State → (change button) → Loading → Card State
Card State → (confirm button) → Draw State
```

## Data Structure

### Task Schema (`tasks.json`)

Each task object contains:
```json
{
  "id": number,
  "category": string,  // One of: "冒险与新奇", "深度连接", "团队协作", "玩乐与放松", "价值与未来"
  "title": string,
  "description": string,
  "science": string,   // Psychology research explanation
  "steps": string[],   // Action steps
  "duration": string,  // "30分钟内" | "1-2小时" | "半天以上"
  "location": string,  // "在家" | "外出"
  "budget": string     // "免费" | "<100元" | ">100元"
}
```

**Important**: Task IDs must be unique integers. Currently 50 tasks (IDs 1-50).

## Key Implementation Details

### Filter System (`app.js:332-374`)

- Uses `data-filter-type` and `data-filter-value` attributes on filter buttons
- Single-select within each filter group (clicking again deselects)
- Filters stored in `activeFilters` object with properties: `duration`, `location`, `budget`
- Filters apply during task drawing, not as a pre-filter of UI display

### Event Handling Pattern

All event listeners bound in `bindEvents()` function (`app.js:109-127`):
- Draw button → `handleDraw()`
- Change button → `handleChange()`
- Confirm button → `handleConfirm()`
- Tip toggle → `toggleTip()`
- Filter buttons → `handleFilterClick()`

### Async/Await for UX

Loading delays use `sleep()` helper (`app.js:328-330`) to create anticipation:
- Initial draw: 1500ms delay
- Change task: 1000ms delay

## File Organization

```
lovebox/
├── index.html              # Main mystery box page
├── guide.html             # Relationship guide articles
├── src/
│   ├── css/
│   │   └── style.css      # All styles (includes responsive design)
│   ├── js/
│   │   └── app.js         # All application logic
│   └── data/
│       └── tasks.json     # 50 dating tasks with metadata
└── README.md
```

**Note**: This is a single-page application architecture with minimal file structure.

## Scientific Basis

All content is based on relationship psychology research:
- **Self-Expansion Model** (Arthur Aron): Novel experiences enhance relationship vitality
- **Love Maps** (John Gottman): Deep understanding builds stable relationships
- **Emotional Bank Account** (John Gottman): Positive interactions accumulate relationship capital
- **Attachment Theory**: Understanding emotional needs and security

## Common Modifications

### Adding New Tasks

1. Add task object to `src/data/tasks.json` with unique ID
2. Ensure all required fields are present (id, category, title, description, science, steps, duration, location, budget)
3. Use existing categories or add new filter values
4. Test filter combinations to ensure task is discoverable

### Modifying Daily Limits

Change `MAX_DAILY_CHANGES` constant in `app.js:6` (currently 3).

### Adding Filter Categories

1. Add filter UI in `index.html` (around line 34-60)
2. Add filter property to `activeFilters` in `app.js:12-16`
3. Update `getRandomTask()` filter logic in `app.js:222-234`
4. Ensure all tasks in `tasks.json` have the new metadata field

## Browser Compatibility

Targets modern browsers (Chrome, Firefox, Safari, Edge) with ES6+ features:
- `async/await`
- `fetch()` API
- `localStorage`
- Arrow functions
- Template literals

**No transpilation/bundling required**.
