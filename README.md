# Kiss Recorder App

A lightweight personal tracking application to log interactions ("events") with people, analyze patterns, and visualize statistics over time.

Built with React, Tailwind CSS, and a modular architecture focused on clarity and scalability.

---

## Features

### People Management
- Add, edit, and delete people
- Store attributes such as:
  - Name
  - Age
  - Gender
  - Zodiac sign
  - Activity
  - How you met
- Each person contains a list of events

### Event Tracking
- Add events per person
- Store:
  - Date
  - Details
  - Optional score
- Edit and delete individual events
- Clear all events for a person

### Analytics Dashboard
- Overview statistics
- Time-based analysis:
  - Events per month
  - Events per year
- People insights:
  - Distribution by gender, age, zodiac, activity
- Score analysis:
  - Score distribution
  - Scored vs unscored events
- Export statistics as PDF

### Localization
- English and Spanish support
- Language preference is persisted locally

### Persistence
- Data is stored locally (device/browser storage)
- Automatic load and save
- Safe fallback if storage fails

---

## Project Structure

src/
├── components/
│ ├── app/
│ ├── charts/
│ ├── people/
│ ├── stats/
│ └── shared/
├── lib/
│ ├── constants.js
│ ├── date.js
│ ├── device-storage.js
│ ├── format.js
│ ├── helpers.js
│ └── pdf-export.js
├── App.jsx
├── main.jsx

---

## Tech Stack

- React
- Tailwind CSS
- Framer Motion
- Lucide Icons
- Recharts
- jsPDF

---

## Getting Started

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

---

## Design Principles

- Separation of concerns: logic split across `lib` and `components`
- Pure functions in utilities: formatting, stats, and helpers are isolated
- Single responsibility components
- Incremental refactorability

---

## Data Model (Simplified)

```js
Person {
  id: string
  name: string
  age: number
  gender: string
  zodiacSign: string
  activity: string
  howWeMet: string
  events: Event[]
}

Event {
  id: string
  date: string
  details: string
  score: number | null
}
```

## Notes

- All data is stored locally; no backend is used
- Clearing storage permanently deletes all data
- Score values are validated before saving

---

## License

MIT