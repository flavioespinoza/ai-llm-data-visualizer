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

## 🧪 Example Prompts

- "Show website traffic for Monday through Friday"
- "Visualize user engagement by device type"
- "Compare 2023 and 2024 quarterly earnings"

---

## ✅ Todo

- [ ] Add a theme switch for iframes
- [ ] Support sharing links from the main app
- [ ] Enable auto-resizing or make the embed responsive

---

## 📝 License

MIT — free to use, adapt, and deploy.
