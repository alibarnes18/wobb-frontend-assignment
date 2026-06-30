# Wobb Vibe Coder Intern - Frontend Assignment

A highly polished, premium influencer search and campaign builder application built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**. 

**Live Repository:** [alibarnes18/wobb-frontend-assignment](https://github.com/alibarnes18/wobb-frontend-assignment)

---

## 🚀 Getting Started

To run the application locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alibarnes18/wobb-frontend-assignment.git
   cd wobb-frontend-assignment
   ```

2. **Install dependencies:**
   We use React 19. Since some drag-and-drop libraries have strict peer dependency checks, install using `--legacy-peer-deps`:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Verify the production build and linting:**
   ```bash
   npm run build
   ```
   ```bash
   npm run lint
   ```

---

## 🛠️ What Was Changed

We transformed the starter application from a basic, functional prototype into a high-end SaaS product.

### 1. Bug Fixes
* **Case-Sensitive Username Search:** Fixed in `src/utils/dataHelpers.ts`. The username filtering is now case-insensitive, matching the behavior of the fullname filter.
* **Incorrect Engagement Rate:** Fixed in `src/pages/ProfileDetailPage.tsx`. The engagement rate was previously multiplied by `10000` (e.g. rendering `125.51%` instead of `1.26%`). It now correctly utilizes the `formatEngagementRate` helper.
* **Broken Engagements Card:** Fixed in `src/pages/ProfileDetailPage.tsx`. The card labeled **Engagements** was displaying the engagement rate instead of the actual total engagement count (`user.engagements`). It now renders the formatted total engagements count.
* **TypeScript 6.0 `baseUrl` Deprecation:** Removed `"baseUrl": "."` from `tsconfig.app.json` and `tsconfig.node.json` to resolve TS5101 deprecation warnings and ensure compatibility with modern TS compilers without requiring temporary suppression flags.

### 2. State Management (Zustand)
* Swapped the stubbed React Context pattern with a global **Zustand** store (`src/store/useListStore.ts`).
* Integrated Zustand's **`persist` middleware** to ensure that the campaign shortlist is saved in the browser's `localStorage` and persists across page refreshes.
* Implemented duplicate prevention logic during additions and a custom `reorderProfiles` method to support drag-and-drop sorting.

### 3. UI/UX Redesign (SaaS Creator Dashboard)
* **Dark-Mode-First Aesthetic:** Designed a high-end interface using a zinc-950 background, custom scrollbars, glassmorphic panels, and subtle borders.
* **Responsive CSS Grid:** Replaced the single-column list with a responsive grid (1 column on mobile, 2 on tablet, 3 on desktop) of creator cards.
* **Campaign Builder Sidebar:** Developed a sliding drawer that displays:
  * Shortlisted creators.
  * Real-time aggregate statistics: **Total Reach** (sum of followers), **Average Engagement Rate**, and **Platform Distribution**.
  * Dynamic action buttons: **Copy Summary** (copies a formatted text overview of the campaign to the clipboard) and **Export JSON** (downloads the list as a JSON file).
* **Interactive Toggles:** Enabled the "Add to List" button on both the search cards and the details page. When clicked, it turns into a blue "Added" button, which dynamically transitions to a red "Remove" button on hover.
* **Platform-Specific Themes:** Styled active tabs and badges with platform-specific gradients (Instagram pink, YouTube red, TikTok cyan/indigo).
* **Creator DNA Analytics:** Redesigned the profile detail page into a full analytics report. It now visualizes rich data from the JSON files that was previously ignored: **Top Hashtags**, **Top Mentions**, **Interests**, and **Similar Creators**.

---

## 📦 Libraries Added

* **`zustand`**: For clean, boilerplate-free global state management with built-in persistence.
* **`lucide-react`**: For high-quality, consistent, and modern iconography.
* **`@hello-pangea/dnd`**: A maintained, React 19-compatible fork of `react-beautiful-dnd` used to enable drag-and-drop reordering of the shortlist.

---

## 🧠 Assumptions & Trade-offs

### Assumptions
* **Local Data Sources:** Since the data is loaded from local static JSON files, we assumed that no remote API calls were needed. However, the UI was built with loading states (`loaded`, spinner) to easily adapt to asynchronous backend endpoints in the future.
* **React 19 Compatibility:** The project runs on React 19. We chose `@hello-pangea/dnd` over the original `react-beautiful-dnd` because the latter is deprecated and throws runtime errors on React 19 due to the removal of legacy React internal methods.

### Trade-offs
* **Static Import vs. Lazy Loading:** For search results, the JSON files are imported statically. This is extremely fast for 10-30 items, but for larger datasets, we would implement lazy loading or server-side pagination.
* **Tailwind v4 `@import`:** We stayed with the Tailwind v4 standard imported via CSS, avoiding heavy configuration files to keep the build process lightweight and fast.

---

## 🔮 Future Improvements

1. **Analytical Charts:** Add visual graphs (e.g., using `recharts` or `chart.js`) to show historical follower growth and engagement trends using the `stat_history` array in the profile JSONs.
2. **Advanced Search Filters:** Add sliders to filter creators by range (e.g., minimum 100K followers, minimum 2% engagement rate).
3. **Multi-Campaign Support:** Allow users to create and switch between multiple campaign lists (e.g., "Q3 Instagram Launch", "TikTok Brand Awareness").
