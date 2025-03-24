# AI LLM Data Visualizer

An interactive AI-powered data visualization app built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **D3.js**, and the **OpenAI API (`gpt-4o`)**. The app allows users to input raw text or prompts, transforms them into structured JSON using GPT, and visualizes the output in real time as bar, line, or pie charts.

---

## ✨ Features

- 📊 Dynamic D3.js visualizations (Bar, Line, Pie)
- 🤖 LLM-powered JSON generation using `gpt-4o-2024-05-13`
- 🌓 Theme toggle via `next-themes`
- 🌐 `/embed` route for iframe integration and live chart sharing
- 🧠 Prompt-to-chart experience powered by AI
- 💾 Export structured JSON to `.json` file
- 🚫 Robust error handling for bad input or failed requests
- 🔄 Zustand state management for chat-related features (if needed later)

---

## 🛠️ Tech Stack

- **Next.js 14** — App Router, API Routes
- **TypeScript 5.3+**
- **Tailwind CSS 3.4+**
- **D3.js 7.8+** — For all chart rendering
- **OpenAI SDK** — GPT-4o JSON generation
- **Zustand** — Lightweight state store
- **shadcn/ui** — For styled components (`button`, `input`, `textarea`)
- **clsx + tailwind-merge** — For clean utility class merging

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/llm-data-visualizer.git
cd llm-data-visualizer
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
OPENAI_API_KEY=your-openai-api-key-here
```

### 4. Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Embed Support

Use the `/embed` route with a URL like:

```html
<iframe
	src="https://yourdomain.com/embed?prompt=Show sales for A, B, C&type=bar"
	width="600"
	height="350"
	frameborder="0"
></iframe>
```

---

### 🧪 Example Prompts

Here are 20 prompts you can use with the LLM Data Visualizer:

1. Visualize sales numbers for Product A, B, C, and D.
2. Show time spent on work, exercise, sleep, and entertainment per day.
3. Breakdown website traffic sources: direct, referral, search, and social.
4. Compare monthly revenue from January to June.
5. Show popularity of programming languages in 2024.
6. Compare coffee vs tea consumption by day of the week.
7. Visualize a weekly breakdown of fitness activities: running, lifting, yoga, and rest.
8. Show user engagement by platform: mobile, desktop, tablet.
9. Breakdown daily calorie intake: carbs, protein, fat.
10. Show distribution of time across meetings, emails, and deep work.
11. Compare average temperatures for spring, summer, fall, and winter.
12. Visualize time spent per task in a morning routine.
13. Show customer satisfaction ratings from five departments.
14. Compare income streams: salary, freelance, dividends, and rental income.
15. Visualize how students rate math, science, English, and art.
16. Show device usage: iOS, Android, Windows, macOS, and Linux.
17. Visualize time spent learning different subjects each week.
18. Compare sales performance of four team members.
19. Breakdown vacation days taken across each quarter.
20. Compare hours spent on personal, family, and professional development.

---

## ✅ Todo

- [ ] Add a theme switch for iframes
- [ ] Support sharing links from the main app
- [ ] Enable auto-resizing or make the embed responsive

---

## 📝 License

MIT — free to use, adapt, and deploy.
